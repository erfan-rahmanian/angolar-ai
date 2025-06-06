import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for AsyncPipe
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service'; // Import CartService

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Add CommonModule
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit { // Class name already Navbar
  cartItemCount$: Observable<number>;

  constructor(private cartService: CartService) { // Inject CartService
    this.cartItemCount$ = this.cartService.getCartItemCount();
  }

  ngOnInit(): void {}
}
