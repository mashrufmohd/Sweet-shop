import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        is_admin: true
      });
      await adminUser.save();
      console.log('Admin user created: admin@example.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    // Check if regular user already exists
    const existingUser = await User.findOne({ email: 'user@example.com' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('user123', 12);
      const regularUser = new User({
        name: 'Regular User',
        email: 'user@example.com',
        password: hashedPassword,
        is_admin: false
      });
      await regularUser.save();
      console.log('Regular user created: user@example.com / user123');
    } else {
      console.log('Regular user already exists');
    }

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
