import { Router } from 'express';
const router = Router();
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories, getPriceRange, getRelatedProducts, getLowStockProducts } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.get('/categories', protect, getCategories); 
router.get('/low-stock', protect, adminOnly, getLowStockProducts);
router.get('/price-range', getPriceRange); 
router.get('/', getProducts);
router.get('/:id/related', getRelatedProducts);
router.get('/:id', getProductById);
router.post('/', protect,  createProduct);
router.put('/:id', protect,  updateProduct);
router.delete('/:id', protect,  deleteProduct);


export default router;