import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent) },
  { path: 'bundle-builder', loadComponent: () => import('./components/bundle-builder/bundle-builder.component').then(m => m.BundleBuilderComponent) },
  { path: 'cart',     loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'orders',   loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent) },
  { path: '**', redirectTo: '' }
];
