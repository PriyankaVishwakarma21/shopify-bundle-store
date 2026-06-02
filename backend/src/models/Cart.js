import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  itemType:  { type: String, enum: ['product', 'bundle'], required: true },
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  bundle:    { type: mongoose.Schema.Types.ObjectId, ref: 'Bundle',  default: null },
  quantity:  { type: Number, default: 1, min: 1 },
  unitPrice: { type: Number, required: true },   // snapshot at add time
  discount:  { type: Number, default: 0 }        // in currency units
}, { _id: true });

const cartSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  items:     [cartItemSchema],
  coupon:    { type: String, default: null }
}, { timestamps: true });

cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((s, i) => s + (i.unitPrice - i.discount) * i.quantity, 0);
});
cartSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Cart', cartSchema);
