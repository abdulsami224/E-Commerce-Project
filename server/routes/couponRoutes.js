import express from 'express';
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  toggleCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/validate', protect, validateCoupon);          
router.get('/', protect, adminOnly, getCoupons);            
router.post('/', protect, adminOnly, createCoupon);         
router.put('/:id/toggle', protect, adminOnly, toggleCoupon); 
router.delete('/:id', protect, adminOnly, deleteCoupon);    

export default router;