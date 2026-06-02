import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/database.js';
import productRoutes from './routes/products.js';
import bundleRoutes  from './routes/bundles.js';
import cartRoutes    from './routes/cart.js';
import orderRoutes   from './routes/orders.js';

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(rateLimit({ windowMs: 15*60*1000, max: 300 }));

const origins = (process.env.FRONTEND_URL || 'http://localhost:4200').split(',');
app.use(cors({
  origin: (o, cb) => (!o || origins.includes(o)) ? cb(null,true) : cb(new Error('CORS blocked')),
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE']
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.use('/api/products', productRoutes);
app.use('/api/bundles',  bundleRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);

app.get('/health', (_, res) => res.json({ status:'OK', service:'Shopify Bundle Store API', ts: new Date() }));
app.get('/',       (_, res) => res.json({ message:'Shopify Custom Bundle Store API', endpoints:['/api/products','/api/bundles','/api/cart','/api/orders'] }));

app.use((_req, res) => res.status(404).json({ message:'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🛍️  Bundle Store API on port ${PORT}`));
export default app;
