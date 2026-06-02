import Cart    from '../models/Cart.js';
import Product from '../models/Product.js';
import Bundle  from '../models/Bundle.js';

const calcBundlePrice = (items, dtype, dval) => {
  const orig = items.reduce((s,i) => s + i.product.price * i.quantity, 0);
  const disc = dtype === 'percentage' ? (orig * dval)/100 : dval;
  return { unitPrice: orig, discount: disc, final: Math.max(0, orig - disc) };
};

const getOrCreate = async (sessionId) => {
  let cart = await Cart.findOne({ sessionId });
  if (!cart) cart = await Cart.create({ sessionId, items: [] });
  return cart;
};

// ── GET /cart/:sessionId ──────────────────────────────────────────────────────
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId })
      .populate('items.product')
      .populate({ path: 'items.bundle', populate: { path: 'items.product' } });
    if (!cart) return res.json({ success: true, cart: { sessionId: req.params.sessionId, items: [], subtotal: 0 } });
    res.json({ success: true, cart });
  } catch (err) { next(err); }
};

// ── POST /cart/:sessionId/product ─────────────────────────────────────────────
export const addProduct = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await getOrCreate(req.params.sessionId);
    const existing = cart.items.find(i => i.itemType === 'product' && i.product?.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ itemType: 'product', product: productId, quantity, unitPrice: product.price, discount: 0 });
    }
    await cart.save();
    await cart.populate('items.product');
    res.status(201).json({ success: true, cart });
  } catch (err) { next(err); }
};

// ── POST /cart/:sessionId/bundle ──────────────────────────────────────────────
export const addBundle = async (req, res, next) => {
  try {
    const { bundleId, quantity = 1 } = req.body;
    const bundle = await Bundle.findById(bundleId).populate('items.product');
    if (!bundle) return res.status(404).json({ message: 'Bundle not found' });

    const { unitPrice, discount } = calcBundlePrice(bundle.items, bundle.discountType, bundle.discountValue);
    const cart = await getOrCreate(req.params.sessionId);
    cart.items.push({ itemType: 'bundle', bundle: bundleId, quantity, unitPrice, discount });
    await cart.save();
    await cart.populate({ path: 'items.bundle', populate: { path: 'items.product' } });
    res.status(201).json({ success: true, cart });
  } catch (err) { next(err); }
};

// ── PATCH /cart/:sessionId/item/:itemId ───────────────────────────────────────
export const updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.quantity = Math.max(1, quantity);
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) { next(err); }
};

// ── DELETE /cart/:sessionId/item/:itemId ──────────────────────────────────────
export const removeItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ sessionId: req.params.sessionId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
    await cart.save();
    res.json({ success: true, cart });
  } catch (err) { next(err); }
};

// ── DELETE /cart/:sessionId ───────────────────────────────────────────────────
export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ sessionId: req.params.sessionId }, { $set: { items: [] } });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) { next(err); }
};
