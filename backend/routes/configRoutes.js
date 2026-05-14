// backend/routes/configRoutes.js
import express from 'express';
const router = express.Router();

// This becomes /api/config/razorpay
router.get('/razorpay', (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
});

export default router;