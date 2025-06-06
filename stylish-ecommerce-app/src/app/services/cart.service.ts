import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';
import { ToastrService } from 'ngx-toastr';

const CART_STORAGE_KEY = 'userShoppingCart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());
  public items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  constructor(private toastr: ToastrService) {}

  private loadCartFromStorage(): CartItem[] {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
      return [];
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
      this.toastr.error('Could not save cart changes. Local storage might be full or disabled.', 'Cart Error');
    }
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = [...this.itemsSubject.value];
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }
    this.itemsSubject.next(currentItems);
    this.saveCartToStorage(currentItems);
    this.toastr.success(`${product.title} added to cart.`, 'Cart Updated');
  }

  updateQuantity(productId: number, quantity: number): void {
    let currentItems = [...this.itemsSubject.value];
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      if (quantity > 0) {
        currentItems[itemIndex].quantity = quantity;
      } else {
        // Remove item if quantity is 0 or less
        currentItems = currentItems.filter(item => item.product.id !== productId);
      }
      this.itemsSubject.next(currentItems);
      this.saveCartToStorage(currentItems);
      this.toastr.info('Cart quantity updated.', 'Cart Updated');
    }
  }

  removeFromCart(productId: number): void {
    const currentItems = this.itemsSubject.value.filter(item => item.product.id !== productId);
    this.itemsSubject.next(currentItems);
    this.saveCartToStorage(currentItems);
    this.toastr.info('Item removed from cart.', 'Cart Updated');
  }

  clearCart(): void {
    this.itemsSubject.next([]);
    this.saveCartToStorage([]);
    this.toastr.info('Cart cleared.', 'Cart Empty');
  }

  getCartTotal(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((total, item) => total + (item.product.price * item.quantity), 0))
    );
  }

  getCartItemCount(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }
}
