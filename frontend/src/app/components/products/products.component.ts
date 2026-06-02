import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/store.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  private productSvc = inject(ProductService);
  cartSvc            = inject(CartService);

  products    = signal<Product[]>([]);
  categories  = signal<string[]>([]);
  loading     = signal(true);
  added       = signal('');

  Math = Math; // expose to template

  // Filters
  selectedCat = '';
  searchQuery = '';
  sortBy      = 'newest';

  ngOnInit(): void {
    this.productSvc.getCategories().subscribe(r => this.categories.set(r.categories));
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productSvc.getProducts({
      category: this.selectedCat || undefined,
      search:   this.searchQuery || undefined,
      limit: 50
    }).subscribe({
      next: r => { this.products.set(this.sort(r.products)); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onFilter(): void { this.loadProducts(); }

  sort(products: Product[]): Product[] {
    const sorted = [...products];
    if (this.sortBy === 'price-asc')  return sorted.sort((a,b) => a.price - b.price);
    if (this.sortBy === 'price-desc') return sorted.sort((a,b) => b.price - a.price);
    if (this.sortBy === 'rating')     return sorted.sort((a,b) => b.rating - a.rating);
    return sorted;
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
