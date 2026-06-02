export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  compareAt?: number;
  category: string;
  images: string[];
  tags?: string[];
  inventory: number;
  isActive: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
}

export interface BundleItem {
  product: Product;
  quantity: number;
}

export interface BundlePricing {
  original: number;
  discount: number;
  final: number;
}

export interface Bundle {
  _id: string;
  name: string;
  description?: string;
  items: BundleItem[];
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  pricing?: BundlePricing;
  sessionId?: string;
  createdAt?: string;
}

export interface CartItem {
  _id: string;
  itemType: 'product' | 'bundle';
  product?: Product;
  bundle?: Bundle;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface Cart {
  _id?: string;
  sessionId: string;
  items: CartItem[];
  subtotal: number;
}

export interface Order {
  orderNumber: string;
  items: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  shippingAddr?: ShippingAddress;
  createdAt?: string;
}

export interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
