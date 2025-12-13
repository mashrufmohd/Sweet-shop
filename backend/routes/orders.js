import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import auth from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

// POST / - Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, total } = req.body;
    const user = await User.findById(req.userId);
    const newOrder = new Order({ user_email: user.email, items, total });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// GET /my-orders - Get order history for logged-in user
router.get('/my-orders', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const orders = await Order.find({ user_email: user.email });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// GET / - Get all orders (admin)
router.get('/', auth, admin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;