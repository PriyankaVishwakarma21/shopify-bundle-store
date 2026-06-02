import Product from '../models/Product.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (featured) filter.isFeatured = true;
    if (search)   filter.$text = { $search: search };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(search ? { score: { $meta:'textScore' } } : { createdAt: -1 })
        .skip((+page - 1) * +limit)
        .limit(+limit),
      Product.countDocuments(filter)
    ]);
    res.json({ success: true, products, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (err) { next(err); }
};

export const getProduct = async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, product: p });
  } catch (err) { next(err); }
};

export const getCategories = async (_req, res, next) => {
  try {
    const cats = await Product.distinct('category', { isActive: true });
    res.json({ success: true, categories: cats });
  } catch (err) { next(err); }
};
