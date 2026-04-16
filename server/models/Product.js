import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [imageSchema],  
  category: { type: String },
  stock: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);