import {
  Component,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AddProductModalComponent } from './components/add-product-modal/add-product-modal.component';
import { FilterDropdownComponent } from './components/filter-dropdown/filter-dropdown.component';
import { SortDropdownComponent } from './components/sort-dropdown/sort-dropdown.component';
import { DeleteModalComponent } from './components/delete-product-modal/delete-product-modal.component';
import { EditProductModalComponent } from './components/edit-product-modal/edit-product-modal.component';
import { ProductService } from '../core/services/product.service';
import { Product } from '../shared/models/product';
import { CurrencyPipe, NgOptimizedImage, PercentPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ToastComponent } from '../shared/components/toast/toast.component';

@Component({
  selector: 'tm-products',
  imports: [
    AddProductModalComponent,
    FilterDropdownComponent,
    SortDropdownComponent,
    DeleteModalComponent,
    EditProductModalComponent,
    NgOptimizedImage,
    CurrencyPipe,
    PercentPipe,
    ToastComponent,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly toastComponent = viewChild.required<ToastComponent>('toast');

  products: Product[] = [];
  totalProducts = 0;
  showingProducts = '';

  /* Query Params */
  page = input<string>();

  selectedPage = computed(() => Number(this.page()) || 1);

  constructor() {
    effect(() => {
      this.productService
        .getAll({
          page: this.selectedPage(),
          limit: 6,
        })
        .subscribe({
          next: ({ products, total, showing }) => {
            this.products = products;
            this.totalProducts = total;
            this.showingProducts = showing;

            setTimeout(() => {
              initFlowbite();
            }, 100);
          },
          error: () =>
            this.toastComponent().open({
              message: 'Error fetching products...',
              type: 'error',
            }),
        });
    });
  }

  addProduct(product: Product) {
    this.products.push(product);
    /* Update modal events */
    setTimeout(() => {
      initFlowbite();
    }, 100);
  }

  deleteProduct(target: Product) {
    this.products = this.products.filter((product) => product.id !== target.id);
  }

  updateProduct(target: Product) {
    const filteredProducts = this.products.filter(
      (product) => product.id !== target.id
    );
    this.products = [target, ...filteredProducts];
  }

  loadPage(page: number) {
    if (page < 1 || Math.ceil(this.totalProducts / 6) < page) return;

    this.router.navigate(['/products'], {
      queryParams: {
        page,
      },
      queryParamsHandling: 'merge',
    });
  }
}
