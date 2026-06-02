import Order from '../models/Order.js';
import Cart  from '../models/Cart.js';

const TAX_RATE     = 0.08;  // 8%
const SHIPPING_FEE = 5.99;
const FREE_SHIPPING_THRESHOLD = 50;

export const createOrder = async (req, res, next) => {
  try {
    const { sessionId, shippingAddr } = req.body;
    const cart = await Cart.findOne({ sessionId })
      .populate('items.product')
      .populate({ path: 'items.bundle', populate: { path: 'items.product' } });

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    const subtotal = cart.items.reduce((s,i) => s + (i.unitPrice - i.discount) * i.quantity, 0);
    const tax      = Math.round(subtotal * TAX_RATE * 100) / 100;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total    = Math.round((subtotal + tax + shipping) * 100) / 100;

    const orderItems = cart.items.map(i => ({
      itemType:  i.itemType,
      name:      i.itemType === 'product' ? i.product?.name : i.bundle?.name,
      quantity:  i.quantity,
      unitPrice: i.unitPrice,
      discount:  i.discount
    }));

    const order = await Order.create({ sessionId, items: orderItems, subtotal, tax, shipping, total, shippingAddr });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

export const getOrdersBySession = async (req, res, next) => {
  try {
    const orders = await Order.find({ sessionId: req.params.sessionId }).sort({ createdAt:-1 });
    res.json({ success: true, orders });
  } catch (err) { next(err); }
};
