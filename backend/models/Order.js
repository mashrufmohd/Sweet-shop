import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  items: [{
    sweet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sweet', required: true },
    sweet_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'completed' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);