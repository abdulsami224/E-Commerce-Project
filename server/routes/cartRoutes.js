import { Router } from 'express';
const router = Router();
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/', protect, updateCartItem);
router.delete('/clear', protect, clearCart);
router.delete('/:productId', protect, removeFromCart);

export default router;