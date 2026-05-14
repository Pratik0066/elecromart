import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  verifyPayment,
  updateOrderToDelivered,
  getOrders,
  getAdminStats,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Base: /api/orders
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/stats').get(protect, admin, getAdminStats);

router.route('/mine').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

// Payment Verification (Razorpay)
// Changed from .put to .post to match standard verification patterns
router.route('/:id/verify').post(protect, verifyPayment);

// Admin: Mark as Delivered
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;