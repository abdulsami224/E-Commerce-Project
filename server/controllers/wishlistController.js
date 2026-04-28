import Wishlist from '../models/Wishlist.js';

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'title price images stock category');

    if (!wishlist) return res.json({ products: [] });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle product
export const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      // create new wishlist with this product
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId]
      });
      return res.json({ message: 'Added to wishlist', added: true, wishlist });
    }

    const exists = wishlist.products.includes(productId);

    if (exists) {
      // remove product
      wishlist.products = wishlist.products.filter(
        id => id.toString() !== productId
      );
      await wishlist.save();
      return res.json({ message: 'Removed from wishlist', added: false, wishlist });
    } else {
      // add product
      wishlist.products.push(productId);
      await wishlist.save();
      return res.json({ message: 'Added to wishlist', added: true, wishlist });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};