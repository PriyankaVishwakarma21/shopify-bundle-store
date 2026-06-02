import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/store.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  private orderSvc = inject(OrderService);
  orders  = signal<Order[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.orderSvc.getMyOrders().subscribe({
      next: r => { this.orders.set(r.orders); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  statusColor(status: string): string {
    const map: Record<string,string> = { pending:'warning', processing:'info', shipped:'primary', delivered:'success', cancelled:'danger' };
    return map[status] || 'secondary';
  }
}
