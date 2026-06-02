import express from 'express';
import { getProducts, getProduct, getCategories } from '../controllers/productController.js';
const router = express.Router();
router.get('/categories', getCategories);
router.get('/',           getProducts);
router.get('/:id',        getProduct);
export default router;
