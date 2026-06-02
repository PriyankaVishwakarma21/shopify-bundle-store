import mongoose from 'mongoose';

const bundleItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1, min: 1 }
}, { _id: false });

const bundleSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  description:  { type: String },
  items:        { type: [bundleItemSchema], validate: { validator: v => v.length >= 2 && v.length <= 8, message: 'Bundles must contain 2–8 products' } },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue:{ type: Number, default: 10, min: 0 },    // e.g. 10 = 10%
  isPublished:  { type: Boolean, default: true },
  sessionId:    { type: String, index: true }              // anonymous cart session
}, { timestamps: true });

// Virtual: original total price (populated)
bundleSchema.virtual('originalPrice').get(function () {
  if (!this.populated('items.product')) return null;
  return this.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
});

bundleSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Bundle', bundleSchema);
