import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import {
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail
} from '../config/email.js';

export const placeOrder = async (req, res) => {
  const { shippingAddress, couponCode, discountAmount } = req.body; 
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${item.product.title}"`
        });
      }
    }

    const items = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // apply discount if coupon used
    const finalTotal = discountAmount
      ? Math.max(0, subtotal - discountAmount)
      : subtotal;

    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice: finalTotal,
      couponCode: couponCode || null,       // ← save coupon used
      discountAmount: discountAmount || 0,   // ← save discount amount
      shippingAddress,
      timeline: [
        {
          status: 'pending',
          message: 'Order placed successfully',
          timestamp: new Date()
        }
      ]
    });

    // increment coupon usage count
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(201).json(order);

    
      try {
        const user = await User.findById(req.user._id);
        await sendOrderConfirmationEmail(user.email, {
          ...order.toObject(),
          userName: user.name,
          items: cart.items.map(item => ({  
            product: item.product,
            quantity: item.quantity,
            price: item.product.price
          }))
        });
      } catch (emailErr) {
        console.log('Order confirmation email failed:', emailErr.message);
      }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get my orders
export async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Admin - get all orders
export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Admin - update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const messages = {
      pending:    'Order placed successfully',
      processing: 'Order is being processed',
      shipped:    'Order has been shipped',
      delivered:  'Order delivered successfully',
      cancelled:  'Order has been cancelled',
    };

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: {
          timeline: {
            status,
            message: messages[status],
            timestamp: new Date()
          }
        }
      },
      { new: true }
    ).populate('items.product', 'title price images')
     .populate('user', 'name email');  // ← populate user for email

    // send email based on status
    try {
      const emailData = {
        ...order.toObject(),
        userName: order.user.name,
      };

      if (status === 'shipped') {
        await sendOrderShippedEmail(order.user.email, emailData);
      } else if (status === 'delivered') {
        await sendOrderDeliveredEmail(order.user.email, emailData);
      }
    } catch (emailErr) {
      console.log('Status email failed:', emailErr.message);
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'title images');  // ← get title + images only
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // make sure user owns this order
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'title price')
      .populate('user', 'name email');

    if (!order)
      return res.status(404).json({ message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    if (order.status !== 'pending')
      return res.status(400).json({
        message: `Cannot cancel order that is already ${order.status}`
      });

    order.status = 'cancelled';
    order.timeline.push({
      status: 'cancelled',
      message: 'Order cancelled by customer',
      timestamp: new Date()
    });
    await order.save();

    // restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product._id || item.product, {
        $inc: { stock: item.quantity }
      });
    }

    // send cancellation email
    try {
      await sendOrderCancelledEmail(order.user.email, {
        ...order.toObject(),
        userName: order.user.name,
      });
    } catch (emailErr) {
      console.log('Cancellation email failed:', emailErr.message);
    }

    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};