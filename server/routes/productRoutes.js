import { Router } from 'express';
const router = Router();
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', getProducts);
router.get('/categories', protect, getCategories); 
router.get('/:id', getProductById);
router.post('/', protect,  createProduct);
router.put('/:id', protect,  updateProduct);
router.delete('/:id', protect,  deleteProduct);
 // ← add before /:id route

export default router;