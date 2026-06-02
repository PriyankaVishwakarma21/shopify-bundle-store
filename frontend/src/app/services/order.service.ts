import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, ShippingAddress } from '../models/store.model';
import { CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = `${environment.apiUrl}/orders`;
  private http = inject(HttpClient);
  private cartSvc = inject(CartService);

  createOrder(shippingAddr: ShippingAddress): Observable<{ success: boolean; order: Order }> {
    return this.http.post<any>(this.API, { sessionId: this.cartSvc.sessionId, shippingAddr });
  }

  getOrder(orderNumber: string): Observable<{ success: boolean; order: Order }> {
    return this.http.get<any>(`${this.API}/${orderNumber}`);
  }

  getMyOrders(): Observable<{ success: boolean; orders: Order[] }> {
    return this.http.get<any>(`${this.API}/session/${this.cartSvc.sessionId}`);
  }
}
