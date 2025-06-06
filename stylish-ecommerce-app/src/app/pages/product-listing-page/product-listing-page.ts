import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCard } from '../../components/product-card/product-card'; // Corrected import
import { ToastrService } from 'ngx-toastr';

const USER_SORT_ORDER_KEY = 'userProductSortOrder'; // Shared key

@Component({
  selector: 'app-product-listing-page',
  standalone: true,
  imports: [CommonModule, ProductCard], // Corrected import
  templateUrl: './product-listing-page.html',
  styleUrls: ['./product-listing-page.css'],
})
export class ProductListingPage implements OnInit {
  // Class name already ProductListingPage
  products: Product[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        const savedOrder = this.getSavedOrder();
        if (savedOrder && savedOrder.length > 0) {
          // Apply if order exists
          this.products = this.sortProducts(data, savedOrder);
        } else {
          this.products = data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load products for sorting.';
        this.isLoading = false;
        this.toastr.error(
          this.error || 'Failed to load products for sorting.',
          'API Error'
        );
      },
    });
  }

  private getSavedOrder(): number[] | null {
    try {
      const saved = localStorage.getItem(USER_SORT_ORDER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error reading sort order from localStorage:', e);
      // Optionally notify user or handle error
      // this.toastr.warning('Could not retrieve your saved product order.', 'Warning');
      return null;
    }
  }

  private sortProducts(products: Product[], order: number[]): Product[] {
    const productMap = new Map(products.map((p) => [p.id, p]));
    const sortedProducts: Product[] = [];

    // Add products based on saved order
    order.forEach((id) => {
      const product = productMap.get(id);
      if (product) {
        sortedProducts.push(product);
        productMap.delete(id); // Remove from map so it's not added again
      }
    });

    // Add any remaining products (e.g., new products not in the saved order) to the end
    // This ensures new products are still displayed.
    productMap.forEach((product) => sortedProducts.push(product));

    return sortedProducts;
  }

  handleAddToCart(product: Product): void {
    // Future: Interaction with CartService.
    // ProductCardComponent already shows a toast.
    console.log('Product to add to cart (from listing page):', product);
  }
}
