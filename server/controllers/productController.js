import Product from '../models/Product.js';
import { deleteFromCloudinary } from '../routes/uploadRoutes.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const filtered = categories.filter(c => c && c.trim() !== '').sort();
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete all images from cloudinary first
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(img => deleteFromCloudinary(img.publicId))
      );
      console.log(`Deleted ${product.images.length} image(s) from Cloudinary`);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product and images deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};