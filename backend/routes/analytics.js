import express from 'express';
import Order from '../models/Order.js';
import auth from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

// GET /dashboard - Get stats (admin)
router.get('/dashboard', auth, admin, async (req, res) => {
  try {
    // Total Revenue
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Active Customers
    const customersResult = await Order.distinct('user_email');
    const activeCustomers = customersResult.length;

    // Top 10 Selling Products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.sweet_name',
          totalSold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalRevenue,
      totalOrders,
      activeCustomers,
      topSellingProducts: topProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;