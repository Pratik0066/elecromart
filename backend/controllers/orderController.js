// backend/controllers/orderController.js

import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/Product.js';
import User from '../models/userModel.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // 🛡️ SAFETY GUARD: Ensure user exists in request context
  if (!req.user) {
    res.status(401);
    throw new Error('User not found. Please log out and log back in.');
  }

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id, // Now safe from null reference
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice: taxPrice || 0,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Initialize Razorpay
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await instance.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: 'INR',
      receipt: `receipt_${createdOrder._id}`,
    });

    res.status(201).json({
      ...createdOrder._doc,
      razorpayOrderId: razorpayOrder.id,
    });
  }
});

// @desc    Verify Razorpay Payment Signature (Production Security)
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'success',
        update_time: Date.now().toString(),
        email_address: req.user.email,
      };
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(400);
      throw new Error('Payment verification failed');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered (Admin)
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders (Admin)
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Get admin dashboard stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();

  const orders = await Order.find({});
  const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  const paidOrders = await Order.find({ isPaid: true });
  const totalPaidSales = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

  const recentOrders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  const lowStockProducts = await Product.find({ countInStock: { $lte: 5 } })
    .select('name countInStock price')
    .sort({ countInStock: 1 })
    .limit(5);

  const salesData = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
        sales: { $sum: '$totalPrice' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 30 },
  ]);

  res.json({
    totalOrders,
    totalProducts,
    totalUsers,
    totalSales: totalSales.toFixed(2),
    totalPaidSales: totalPaidSales.toFixed(2),
    recentOrders,
    lowStockProducts,
    salesData,
  });
});

export {
  addOrderItems,
  verifyPayment,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  getOrders,
  getAdminStats,
};