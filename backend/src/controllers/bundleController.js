import Bundle  from '../models/Bundle.js';
import Product from '../models/Product.js';

const calcBundlePrice = (items, discountType, discountValue) => {
  const original = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const discount = discountType === 'percentage'
    ? (original * discountValue) / 100
    : discountValue;
  return { original, discount, final: Math.max(0, original - discount) };
};

// ── POST /bundles ─────────────────────────────────────────────────────────────
export const createBundle = async (req, res, next) => {
  try {
    const { name, description, items, discountType = 'percentage', discountValue = 10, sessionId } = req.body;

    // Validate products exist
    const ids = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: ids }, isActive: true });
    if (products.length !== ids.length)
      return res.status(400).json({ message: 'One or more products not found or inactive' });

    const bundleItems = items.map(i => ({
      product: i.productId,
      quantity: i.quantity || 1
    }));

    const bundle = await Bundle.create({ name, description, items: bundleItems, discountType, discountValue, sessionId });
    await bundle.populate('items.product');

    const pricing = calcBundlePrice(bundle.items, discountType, discountValue);
    res.status(201).json({ success: true, bundle, pricing });
  } catch (err) { next(err); }
};

// ── GET /bundles ──────────────────────────────────────────────────────────────
export const getBundles = async (req, res, next) => {
  try {
    const filter = { isPublished: true };
    if (req.query.sessionId) filter.sessionId = req.query.sessionId;
    const bundles = await Bundle.find(filter).populate('items.product').sort({ createdAt: -1 });
    const enriched = bundles.map(b => {
      const p = calcBundlePrice(b.items, b.discountType, b.discountValue);
      return { ...b.toJSON(), pricing: p };
    });
    res.json({ success: true, bundles: enriched });
  } catch (err) { next(err); }
};

// ── GET /bundles/:id ──────────────────────────────────────────────────────────
export const getBundle = async (req, res, next) => {
  try {
    const bundle = await Bundle.findById(req.params.id).populate('items.product');
    if (!bundle) return res.status(404).json({ message: 'Bundle not found' });
    const pricing = calcBundlePrice(bundle.items, bundle.discountType, bundle.discountValue);
    res.json({ success: true, bundle, pricing });
  } catch (err) { next(err); }
};

// ── DELETE /bundles/:id ───────────────────────────────────────────────────────
export const deleteBundle = async (req, res, next) => {
  try {
    await Bundle.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Bundle deleted' });
  } catch (err) { next(err); }
};

// ── GET /bundles/preview – preview pricing without saving ─────────────────────
export const previewBundle = async (req, res, next) => {
  try {
    const { items, discountType = 'percentage', discountValue = 10 } = req.body;
    const ids = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: ids } });
    const enriched = items.map(i => ({
      product: products.find(p => p._id.toString() === i.productId),
      quantity: i.quantity || 1
    }));
    const pricing = calcBundlePrice(enriched, discountType, discountValue);
    res.json({ success: true, pricing });
  } catch (err) { next(err); }
};
