import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Get cart
export async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    // ← add this stock check
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock === 0) return res.status(400).json({ message: 'Product is out of stock' });
    if (product.stock < quantity) return res.status(400).json({ message: `Only ${product.stock} items available` });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update quantity
export async function updateCartItem(req, res) {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (item) item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Remove item
export async function removeFromCart(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== req.params.productId
    );
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Clear cart
export async function clearCart(req, res) {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}