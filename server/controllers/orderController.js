import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Place order
export async function placeOrder(req, res) {
  const { shippingAddress } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${item.product.title}". Only ${item.product.stock} left.`
        });
      }
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    // Calculate total
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      shippingAddress
    });

    // Decrease stock for each product ← new
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }  
      });
    }
    
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
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
export async function updateOrderStatus(req, res) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}