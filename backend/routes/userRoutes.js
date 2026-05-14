import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Base Route: /api/users
router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);

// Auth & Logout
router.post('/auth', authUser);
router.post('/logout', logoutUser);

// User Profile (Private)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Wishlist (Private)
router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);
router.route('/wishlist/:productId')
  .delete(protect, removeFromWishlist);

// Admin-Only Operations: /api/users/:id
router.route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;