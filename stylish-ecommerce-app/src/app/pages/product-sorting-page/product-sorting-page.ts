import { Component, OnInit } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ToastrService } from 'ngx-toastr';

const USER_SORT_ORDER_KEY = 'userProductSortOrder';

@Component({
  selector: 'app-product-sorting-page',
  standalone: true,
  imports: [CommonModule, DragDropModule, SlicePipe],
  templateUrl: './product-sorting-page.html',
  styleUrls: ['./product-sorting-page.css']
})
export class ProductSortingPage implements OnInit { // Renamed class
  productsToDisplay: Product[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private productService: ProductService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (fetchedProducts) => {
        // Apply saved sort order if it exists
        const savedOrder = this.getSavedOrder();
        if (savedOrder && savedOrder.length > 0 ) {
          this.productsToDisplay = this.sortProducts(fetchedProducts, savedOrder);
        } else {
          this.productsToDisplay = fetchedProducts;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load products for sorting.';
        this.isLoading = false;
        this.toastr.error(this.error, 'API Error');
      }
    });
  }

  onProductDropped(event: CdkDragDrop<Product[]>) {
    moveItemInArray(this.productsToDisplay, event.previousIndex, event.currentIndex);
    this.saveOrder();
    this.toastr.info('Product order updated and saved!', 'Order Changed');
  }

  private saveOrder(): void {
    const orderToSave = this.productsToDisplay.map(p => p.id);
    try {
      localStorage.setItem(USER_SORT_ORDER_KEY, JSON.stringify(orderToSave));
    } catch (e) {
      this.toastr.error('Could not save your sort order. Local storage might be full or disabled.', 'Save Error');
      console.error('Error saving to localStorage:', e);
    }
  }

  private getSavedOrder(): number[] | null {
    try {
      const saved = localStorage.getItem(USER_SORT_ORDER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return null;
    }
  }

  private sortProducts(products: Product[], order: number[]): Product[] {
    const productMap = new Map(products.map(p => [p.id, p]));
    const sortedProducts: Product[] = [];
    order.forEach(id => {
      const product = productMap.get(id);
      if (product) {
        sortedProducts.push(product);
        productMap.delete(id); // Remove from map to handle products not in saved order
      }
    });
    // Add any products not in the saved order (e.g., new products) to the end
    productMap.forEach(product => sortedProducts.push(product));
    return sortedProducts;
  }
}
