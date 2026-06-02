import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart, CartItem } from '../models/store.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly API = `${environment.apiUrl}/cart`;
  private http = inject(HttpClient);

  cart   = signal<Cart | null>(null);
  count  = computed(() => this.cart()?.items.reduce((s,i) => s + i.quantity, 0) ?? 0);

  get sessionId(): string {
    let id = localStorage.getItem('bs_session');
    if (!id) { id = uuidv4(); localStorage.setItem('bs_session', id); }
    return id;
  }

  loadCart(): Observable<{ success: boolean; cart: Cart }> {
    return this.http.get<{ success: boolean; cart: Cart }>(`${this.API}/${this.sessionId}`).pipe(
      tap(r => this.cart.set(r.cart))
    );
  }

  addProduct(productId: string, quantity = 1): Observable<any> {
    return this.http.post<any>(`${this.API}/${this.sessionId}/product`, { productId, quantity }).pipe(
      tap(r => this.cart.set(r.cart))
    );
  }

  addBundle(bundleId: string, quantity = 1): Observable<any> {
    return this.http.post<any>(`${this.API}/${this.sessionId}/bundle`, { bundleId, quantity }).pipe(
      tap(r => this.cart.set(r.cart))
    );
  }

  updateItem(itemId: string, quantity: number): Observable<any> {
    return this.http.patch<any>(`${this.API}/${this.sessionId}/item/${itemId}`, { quantity }).pipe(
      tap(r => this.cart.set(r.cart))
    );
  }

  removeItem(itemId: string): Observable<any> {
    return this.http.delete<any>(`${this.API}/${this.sessionId}/item/${itemId}`).pipe(
      tap(r => this.cart.set(r.cart))
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(`${this.API}/${this.sessionId}`).pipe(
      tap(() => this.cart.update(c => c ? { ...c, items: [], subtotal: 0 } : null))
    );
  }
}
