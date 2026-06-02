import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/store.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private productSvc = inject(ProductService);
  cartSvc            = inject(CartService);

  featured = signal<Product[]>([]);
  loading  = signal(true);
  added    = signal<string>('');

  ngOnInit(): void {
    this.productSvc.getProducts({ featured: true, limit: 6 }).subscribe({
      next: r => { this.featured.set(r.products); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  addToCart(productId: string): void {
    this.cartSvc.addProduct(productId).subscribe(() => {
      this.added.set(productId);
      setTimeout(() => this.added.set(''), 1500);
    });
  }

  discount(p: Product): number {
    if (!p.compareAt || p.compareAt <= p.price) return 0;
    return Math.round(((p.compareAt - p.price) / p.compareAt) * 100);
  }
}
