import { Router } from 'express';
const router = Router();
import { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderById, cancelOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/all', protect, getAllOrders);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);
router.get('/:id', protect, getOrderById);

export default router;