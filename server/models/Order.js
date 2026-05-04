import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    phone: String
  },
  couponCode: { type: String, default: null },
  discountAmount: { type: Number, default: 0 },
  timeline: [
    {
      status: { type: String },
      message: { type: String },
      timestamp: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

export default model('Order', orderSchema);