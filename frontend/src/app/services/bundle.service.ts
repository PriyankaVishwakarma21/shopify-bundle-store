import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bundle } from '../models/store.model';

@Injectable({ providedIn: 'root' })
export class BundleService {
  private readonly API = `${environment.apiUrl}/bundles`;
  private http = inject(HttpClient);

  getBundles(sessionId?: string): Observable<any> {
    const url = sessionId ? `${this.API}?sessionId=${sessionId}` : this.API;
    return this.http.get<any>(url);
  }

  getBundle(id: string): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  createBundle(data: {
    name: string;
    description?: string;
    items: { productId: string; quantity: number }[];
    discountType: string;
    discountValue: number;
    sessionId?: string;
  }): Observable<any> {
    return this.http.post<any>(this.API, data);
  }

  previewBundle(items: { productId: string; quantity: number }[], discountType = 'percentage', discountValue = 10): Observable<any> {
    return this.http.post<any>(`${this.API}/preview`, { items, discountType, discountValue });
  }

  deleteBundle(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API}/${id}`);
  }
}
