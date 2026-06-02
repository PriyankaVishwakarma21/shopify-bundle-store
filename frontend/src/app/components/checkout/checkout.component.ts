import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/store.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  private fb       = inject(FormBuilder);
  private cartSvc  = inject(CartService);
  private orderSvc = inject(OrderService);
  private router   = inject(Router);

  cart     = this.cartSvc.cart;
  loading  = signal(false);
  error    = signal('');
  order    = signal<Order | null>(null);

  subtotal = computed(() => this.cart()?.items.reduce((s,i) => s + (i.unitPrice - i.discount) * i.quantity, 0) ?? 0);
  tax      = computed(() => Math.round(this.subtotal() * 0.08 * 100) / 100);
  shipping = computed(() => this.subtotal() >= 50 ? 0 : 5.99);
  total    = computed(() => Math.round((this.subtotal() + this.tax() + this.shipping()) * 100) / 100);

  form = this.fb.group({
    name:    ['', Validators.required],
    email:   ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city:    ['', Validators.required],
    state:   ['', Validators.required],
    zip:     ['', Validators.required],
    country: ['United States', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.orderSvc.createOrder(this.form.value as any).subscribe({
      next: r => { this.order.set(r.order); this.loading.set(false); },
      error: e => { this.error.set(e.error?.message || 'Checkout failed'); this.loading.set(false); }
    });
  }

  get f() { return this.form.controls; }
}
