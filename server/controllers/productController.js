import Product from '../models/Product.js';
import { deleteFromCloudinary } from '../routes/uploadRoutes.js';

// REPLACE WITH
export const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20, sort = 'newest', minPrice, maxPrice } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    // price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // sort options
    let sortOption = {};
    if (sort === 'price-low')  sortOption = { price: 1 };   // low → high
    if (sort === 'price-high') sortOption = { price: -1 };  // high → low
    if (sort === 'newest')     sortOption = { createdAt: -1 }; // newest first
    if (sort === 'oldest')     sortOption = { createdAt: 1 };  // oldest first

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter)
    ]);

    res.json({
      products,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalProducts: total,
    });
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

export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const related = await Product.find({
      category: product.category,  
      _id: { $ne: product._id },   
    })
    .limit(4)                      
    .select('title price images stock category'); 

    res.json(related);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lte: 5, $gt: 0 } })
      .select('title stock images category')
      .sort({ stock: 1 }); // lowest stock first
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPriceRange = async (req, res) => {
  try {
    const result = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    res.json(result[0] || { minPrice: 0, maxPrice: 10000 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};