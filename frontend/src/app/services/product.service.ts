import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/store.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = `${environment.apiUrl}/products`;
  private http = inject(HttpClient);

  getProducts(filters: { category?: string; search?: string; featured?: boolean; page?: number; limit?: number } = {}): Observable<any> {
    let params = new HttpParams();
    if (filters.category) params = params.set('category', filters.category);
    if (filters.search)   params = params.set('search', filters.search);
    if (filters.featured) params = params.set('featured', 'true');
    if (filters.page)     params = params.set('page', filters.page.toString());
    if (filters.limit)    params = params.set('limit', filters.limit.toString());
    return this.http.get<any>(this.API, { params });
  }

  getProduct(id: string): Observable<{ success: boolean; product: Product }> {
    return this.http.get<{ success: boolean; product: Product }>(`${this.API}/${id}`);
  }

  getCategories(): Observable<{ success: boolean; categories: string[] }> {
    return this.http.get<any>(`${this.API}/categories`);
  }
}
