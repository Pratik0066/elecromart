import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getRecommendations,
  getChatResponse
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// AI Endpoints (Place these BEFORE the /:id route to avoid conflicts)
router.route('/chat').post(getChatResponse);
router.route('/:id/recommendations').get(getRecommendations);

// Standard Routes
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);

export default router;