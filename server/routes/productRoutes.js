import { Router } from 'express';
const router = Router();
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect,  createProduct);
router.put('/:id', protect,  updateProduct);
router.delete('/:id', protect,  deleteProduct);

export default router;