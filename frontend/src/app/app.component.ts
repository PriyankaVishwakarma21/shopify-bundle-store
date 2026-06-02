import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <main style="padding-top:64px; min-height:100vh">
      <router-outlet />
    </main>
    <footer class="bg-dark text-white text-center py-3 mt-5">
      <small>© 2025 BundleShop – Built with Angular 17 &amp; Node.js MEAN Stack</small>
    </footer>
  `
})
export class AppComponent implements OnInit {
  private cartSvc = inject(CartService);

  ngOnInit(): void {
    this.cartSvc.loadCart().subscribe();
  }
}
