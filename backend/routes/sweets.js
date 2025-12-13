import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Sweet from '../models/Sweet.js';
import User from '../models/User.js';
import auth from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

// Ensure static/images directory exists
const imagesDir = 'static/images';
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET / - List sweets
// Admin: sees all sweets for management
// User: sees all
router.get('/', auth, async (req, res) => {
  try {
    let sweets;
    if (req.isAdmin) {
      // Admin sees all sweets for management
      sweets = await Sweet.find();
    } else {
      sweets = await Sweet.find();
    }
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// GET /search?q=...
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    const sweets = await Sweet.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// POST /{id}/purchase - Decrements stock
router.post('/:id/purchase', auth, async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    if (sweet.quantity < quantity) return res.status(400).json({ message: 'Insufficient stock' });
    sweet.quantity -= quantity;
    await sweet.save();
    res.json({ message: 'Purchase successful', sweet });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// POST / - Create sweet (admin)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { name, category, price, quantity, image_url } = req.body;
    const user = await User.findById(req.userId);
    const newSweet = new Sweet({ name, category, price, quantity, image_url, owner_email: user.email });
    await newSweet.save();
    res.status(201).json(newSweet);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// POST /upload - Upload image (admin)
router.post('/upload', auth, admin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const imageUrl = `${req.protocol}://${req.get('host')}/static/images/${req.file.filename}`;
  res.json({ image_url: imageUrl });
});

// PUT /{id} - Update sweet (admin)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const updatedSweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSweet) return res.status(404).json({ message: 'Sweet not found' });
    res.json(updatedSweet);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// DELETE /{id} - Delete sweet (admin)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const deletedSweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!deletedSweet) return res.status(404).json({ message: 'Sweet not found' });
    res.json({ message: 'Sweet deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// POST /{id}/restock - Increase quantity (admin)
router.post('/:id/restock', auth, admin, async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    sweet.quantity += quantity;
    await sweet.save();
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;