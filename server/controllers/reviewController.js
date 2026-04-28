import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Add review
export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed)
      return res.status(400).json({ message: 'You have already reviewed this product' });

    // check if user has a delivered order containing this product
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      status: 'delivered',
      'items.product': productId
    });
    if (!deliveredOrder)
      return res.status(403).json({ message: 'You can only review products you have purchased and received' });

    // add review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);

    // recalculate average rating
    product.totalReviews = product.reviews.length;
    product.averageRating = (
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length
    ).toFixed(1);

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reviews for a product
export const getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .select('reviews averageRating totalReviews');
    if (!product)
      return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete own review
export const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    // check review belongs to user
    const review = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );
    if (!review)
      return res.status(404).json({ message: 'Review not found' });

    // remove review
    product.reviews = product.reviews.filter(
      r => r.user.toString() !== req.user._id.toString()
    );

    // recalculate
    product.totalReviews = product.reviews.length;
    product.averageRating = product.reviews.length > 0
      ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
      : 0;

    await product.save();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};