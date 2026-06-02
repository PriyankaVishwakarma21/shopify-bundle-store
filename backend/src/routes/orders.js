import express from 'express';
import { createOrder, getOrder, getOrdersBySession } from '../controllers/orderController.js';
const router = express.Router();
router.post('/',                     createOrder);
router.get('/session/:sessionId',    getOrdersBySession);
router.get('/:orderNumber',          getOrder);
export default router;
