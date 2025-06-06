import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe, SlicePipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../services/cart.service'; // Import CartService

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, SlicePipe],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard { // Class name already ProductCard
  @Input() product: Product | undefined;
  // @Output() addToCart = new EventEmitter<Product>(); // Keep or remove if direct service call is preferred

  constructor(private toastr: ToastrService, private cartService: CartService) {} // Inject CartService

  addToCartHandler(): void {
    if (this.product) {
      this.cartService.addToCart(this.product); // Call CartService directly
      // Toastr message is now handled by CartService upon successful add.
      console.log('Add to cart clicked for:', this.product);
    }
  }
}
