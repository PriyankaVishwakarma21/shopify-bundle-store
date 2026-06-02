import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { BundleService } from '../../services/bundle.service';
import { CartService } from '../../services/cart.service';
import { Product, BundlePricing } from '../../models/store.model';

interface SlotProduct { product: Product; quantity: number; }

@Component({
  selector: 'app-bundle-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './bundle-builder.component.html',
  styleUrl: './bundle-builder.component.scss'
})
export class BundleBuilderComponent implements OnInit {
  private productSvc = inject(ProductService);
  private bundleSvc  = inject(BundleService);
  private cartSvc    = inject(CartService);

  allProducts   = signal<Product[]>([]);
  categories    = signal<string[]>([]);
  selectedItems = signal<SlotProduct[]>([]);
  pricing       = signal<BundlePricing | null>(null);
  loading       = signal(true);
  saving        = signal(false);
  saved         = signal(false);
  addedToCart   = signal(false);
  createdBundleId = signal('');

  // Form
  bundleName    = 'My Custom Bundle';
  discountType  = 'percentage';
  discountValue = 10;
  filterCat     = '';
  searchQ       = '';

  MAX_ITEMS = 8;
  MIN_ITEMS = 2;

  filteredProducts = computed(() => {
    let prods = this.allProducts();
    if (this.filterCat) prods = prods.filter(p => p.category === this.filterCat);
    if (this.searchQ)   prods = prods.filter(p => p.name.toLowerCase().includes(this.searchQ.toLowerCase()));
    return prods;
  });

  canSave = computed(() => this.selectedItems().length >= this.MIN_ITEMS && !!this.bundleName.trim());

  ngOnInit(): void {
    Promise.all([
      this.productSvc.getProducts({ limit: 100 }).toPromise(),
      this.productSvc.getCategories().toPromise()
    ]).then(([pr, cr]) => {
      this.allProducts.set(pr!.products);
      this.categories.set(cr!.categories);
      this.loading.set(false);
    }).catch(() => this.loading.set(false));
  }

  addItem(product: Product): void {
    const items = this.selectedItems();
    if (items.length >= this.MAX_ITEMS) return;
    const existing = items.find(i => i.product._id === product._id);
    if (existing) {
      this.selectedItems.update(arr => arr.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      this.selectedItems.update(arr => [...arr, { product, quantity: 1 }]);
    }
    this.updatePricing();
  }

  removeItem(productId: string): void {
    this.selectedItems.update(arr => arr.filter(i => i.product._id !== productId));
    this.updatePricing();
  }

  updateQty(productId: string, qty: number): void {
    if (qty < 1) return;
    this.selectedItems.update(arr => arr.map(i => i.product._id === productId ? { ...i, quantity: qty } : i));
    this.updatePricing();
  }

  updatePricing(): void {
    const items = this.selectedItems();
    if (items.length < 1) { this.pricing.set(null); return; }
    this.bundleSvc.previewBundle(
      items.map(i => ({ productId: i.product._id, quantity: i.quantity })),
      this.discountType,
      this.discountValue
    ).subscribe(r => this.pricing.set(r.pricing));
  }

  saveBundle(): void {
    if (!this.canSave()) return;
    this.saving.set(true);
    const items = this.selectedItems();
    this.bundleSvc.createBundle({
      name: this.bundleName,
      items: items.map(i => ({ productId: i.product._id, quantity: i.quantity })),
      discountType: this.discountType,
      discountValue: this.discountValue,
      sessionId: this.cartSvc.sessionId
    }).subscribe({
      next: r => {
        this.saved.set(true);
        this.createdBundleId.set(r.bundle._id);
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }

  addBundleToCart(): void {
    const id = this.createdBundleId();
    if (!id) return;
    this.cartSvc.addBundle(id).subscribe(() => {
      this.addedToCart.set(true);
    });
  }

  reset(): void {
    this.selectedItems.set([]);
    this.pricing.set(null);
    this.saved.set(false);
    this.addedToCart.set(false);
    this.createdBundleId.set('');
    this.bundleName = 'My Custom Bundle';
  }

  isSelected(productId: string): boolean {
    return this.selectedItems().some(i => i.product._id === productId);
  }

  get totalOriginal(): number {
    return this.selectedItems().reduce((s,i) => s + i.product.price * i.quantity, 0);
  }
}
