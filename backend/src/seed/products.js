import dotenv from 'dotenv'; dotenv.config();
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const products = [
  // Electronics
  { name:'Wireless Noise-Cancelling Headphones', category:'Electronics', price:79.99, compareAt:119.99, description:'Premium over-ear headphones with 30h battery and ANC technology.', tags:['audio','headphones','wireless'], rating:4.7, reviewCount:1240, isFeatured:true, images:['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'] },
  { name:'Smart Watch Series 5',  category:'Electronics', price:199.99, compareAt:249.99, description:'Track your fitness, calls, and notifications right from your wrist.', tags:['watch','fitness','smart'], rating:4.5, reviewCount:876, images:['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'] },
  { name:'Portable Bluetooth Speaker', category:'Electronics', price:49.99, compareAt:69.99, description:'360° surround sound in a compact, waterproof design.', tags:['speaker','bluetooth','portable'], rating:4.6, reviewCount:532, images:['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'] },
  { name:'USB-C Hub 7-in-1', category:'Electronics', price:34.99, description:'Expand your laptop with HDMI, USB-A, SD card, and more.', tags:['hub','usb','accessories'], rating:4.4, reviewCount:310, images:['https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400'] },
  // Clothing
  { name:'Classic Crew-Neck Tee', category:'Clothing', price:24.99, compareAt:34.99, description:'100% organic cotton everyday tee in 12 colors.', tags:['t-shirt','casual','cotton'], rating:4.3, reviewCount:2100, isFeatured:true, images:['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'] },
  { name:'Slim-Fit Chinos', category:'Clothing', price:49.99, compareAt:69.99, description:'Versatile stretch chinos for work or weekend.', tags:['pants','chinos','slim'], rating:4.2, reviewCount:890, images:['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'] },
  { name:'Merino Wool Sweater',   category:'Clothing', price:89.99, description:'Soft, breathable merino wool – perfect for layering.', tags:['sweater','wool','warm'], rating:4.8, reviewCount:430, images:['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400'] },
  // Home & Kitchen
  { name:'Stainless Steel Water Bottle 1L', category:'Home & Kitchen', price:19.99, compareAt:27.99, description:'Double-wall insulated keeps drinks cold 24h or hot 12h.', tags:['bottle','hydration','eco'], rating:4.9, reviewCount:5600, isFeatured:true, images:['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'] },
  { name:'French Press Coffee Maker', category:'Home & Kitchen', price:29.99, description:'Classic 8-cup borosilicate glass French press for rich coffee.', tags:['coffee','kitchen','french press'], rating:4.6, reviewCount:1100, images:['https://images.unsplash.com/photo-1544127715-78c54ac33e2a?w=400'] },
  { name:'Bamboo Cutting Board Set', category:'Home & Kitchen', price:39.99, compareAt:54.99, description:'Set of 3 eco-friendly bamboo boards with juice groove.', tags:['kitchen','bamboo','cooking'], rating:4.5, reviewCount:780, images:['https://images.unsplash.com/photo-1547592180-85f173990554?w=400'] },
  // Beauty
  { name:'Vitamin C Face Serum 30ml', category:'Beauty', price:28.99, compareAt:42.99, description:'Brightening serum with 20% Vitamin C for radiant skin.', tags:['skincare','serum','vitamin c'], rating:4.7, reviewCount:2300, isFeatured:true, images:['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400'] },
  { name:'Hyaluronic Acid Moisturizer', category:'Beauty', price:22.99, description:'Lightweight daily moisturizer with deep hydration.', tags:['moisturizer','skincare','hydration'], rating:4.6, reviewCount:1400, images:['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'] },
  { name:'Natural Lip Balm Pack x6', category:'Beauty', price:12.99, description:'Beeswax-based lip balms in 6 flavors – SPF 15.', tags:['lip','balm','natural'], rating:4.4, reviewCount:980, images:['https://images.unsplash.com/photo-1586495777744-4e6232bf5763?w=400'] },
  // Sports
  { name:'Resistance Band Set (5 levels)', category:'Sports', price:22.99, compareAt:34.99, description:'Premium latex resistance bands for home workouts.', tags:['fitness','bands','workout'], rating:4.5, reviewCount:3200, isFeatured:true, images:['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'] },
  { name:'Yoga Mat Premium 6mm', category:'Sports', price:39.99, description:'Non-slip TPE yoga mat with alignment lines – 183×61cm.', tags:['yoga','mat','fitness'], rating:4.7, reviewCount:1760, images:['https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400'] },
  { name:'Foam Roller Deep Tissue', category:'Sports', price:27.99, description:'High-density EVA foam roller for muscle recovery.', tags:['recovery','foam','fitness'], rating:4.3, reviewCount:640, images:['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400'] },
  // Books
  { name:'Atomic Habits – James Clear', category:'Books', price:14.99, compareAt:18.99, description:'The #1 bestselling guide to building good habits and breaking bad ones.', tags:['productivity','self-help','habits'], rating:4.9, reviewCount:8900, images:['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'] },
  { name:'Deep Work – Cal Newport',     category:'Books', price:13.99, description:'Rules for focused success in a distracted world.', tags:['focus','productivity','career'], rating:4.7, reviewCount:4200, images:['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400'] }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
