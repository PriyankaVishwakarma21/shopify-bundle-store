import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  itemType:  { type: String, enum: ['product','bundle'] },
  name:      { type: String },
  quantity:  { type: Number },
  unitPrice: { type: Number },
  discount:  { type: Number, default: 0 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber:  { type: String, unique: true },
  sessionId:    { type: String },
  items:        [orderItemSchema],
  subtotal:     { type: Number },
  tax:          { type: Number, default: 0 },
  shipping:     { type: Number, default: 0 },
  total:        { type: Number },
  status:       { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  shippingAddr: {
    name: String, email: String, address: String, city: String, state: String, zip: String, country: String
  }
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase();
  }
  next();
});

export default mongoose.model('Order', orderSchema);
