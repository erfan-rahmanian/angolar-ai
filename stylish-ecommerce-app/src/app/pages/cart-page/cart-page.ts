import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.css']
})
export class CartPage implements OnInit { // Renamed class
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;

  constructor(private cartService: CartService, private toastr: ToastrService) {
    this.cartItems$ = this.cartService.items$;
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {}

  updateItemQuantity(productId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const quantity = parseInt(inputElement.value, 10);
    if (!isNaN(quantity) && quantity >= 0) { // Allow 0 to remove, handled by service
      this.cartService.updateQuantity(productId, quantity);
    } else {
      // Reset to current quantity if input is invalid
      this.cartService.items$.subscribe(items => {
        const item = items.find(i => i.product.id === productId);
        if(item) inputElement.value = item.quantity.toString();
      }).unsubscribe(); // Unsubscribe after getting the value to avoid memory leaks
       this.toastr.warning('Invalid quantity.', 'Input Error');
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  proceedToCheckout(): void {
    // This is a dummy function for now
    this.toastr.info('Checkout is not implemented in this demo.', 'Coming Soon!');
    // Potentially clear cart or navigate to an order confirmation simulation page
  }
}
