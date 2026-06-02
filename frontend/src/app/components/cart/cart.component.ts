import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/store.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cartSvc = inject(CartService);
  loading = signal(true);

  cart    = this.cartSvc.cart;

  subtotal = computed(() => this.cart()?.items.reduce((s,i) => s + (i.unitPrice - i.discount) * i.quantity, 0) ?? 0);
  tax      = computed(() => Math.round(this.subtotal() * 0.08 * 100) / 100);
  shipping = computed(() => this.subtotal() >= 50 ? 0 : (this.subtotal() > 0 ? 5.99 : 0));
  total    = computed(() => Math.round((this.subtotal() + this.tax() + this.shipping()) * 100) / 100);

  ngOnInit(): void {
    this.cartSvc.loadCart().subscribe(() => this.loading.set(false));
  }

  updateQty(item: CartItem, qty: number): void {
    if (qty < 1) return;
    this.cartSvc.updateItem(item._id, qty).subscribe();
  }

  removeItem(itemId: string): void {
    this.cartSvc.removeItem(itemId).subscribe();
  }

  clearCart(): void {
    this.cartSvc.clearCart().subscribe();
  }

  itemName(item: CartItem): string {
    return item.itemType === 'product' ? (item.product?.name || 'Product') : (item.bundle?.name || 'Bundle');
  }

  itemImage(item: CartItem): string {
    if (item.itemType === 'product') return item.product?.images?.[0] || '';
    return '';
  }
}
