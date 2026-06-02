import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, maxlength: 600 },
  price:       { type: Number, required: true, min: 0 },
  compareAt:   { type: Number, default: null },  // original price
  category:    {
    type: String,
    enum: ['Electronics','Clothing','Home & Kitchen','Beauty','Sports','Books','Toys','Food','Other'],
    default: 'Other'
  },
  images:      [{ type: String }],
  tags:        [{ type: String }],
  inventory:   { type: Number, default: 100, min: 0 },
  isActive:    { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false },
  rating:      { type: Number, default: 4.0, min: 1, max: 5 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Product', productSchema);
