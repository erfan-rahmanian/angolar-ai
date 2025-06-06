import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/product-listing-page/product-listing-page').then(m => m.ProductListingPage) },
  { path: 'products', loadComponent: () => import('./pages/product-listing-page/product-listing-page').then(m => m.ProductListingPage) },
  { path: 'login', loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register-page/register-page').then(m => m.RegisterPage) }
  { path: 'sort-products', loadComponent: () => import('./pages/product-sorting-page/product-sorting-page').then(m => m.ProductSortingPage) },
  { path: 'cart', loadComponent: () => import('./pages/cart-page/cart-page').then(m => m.CartPage) },
];
