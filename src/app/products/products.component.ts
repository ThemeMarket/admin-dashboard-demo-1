import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
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
import { ProductPaginationService } from '../core/services/product-pagination.service';
import { ProductFilterService } from '../core/services/product-filter.service';
import {
  ProductSortService,
  SortStrategyName,
} from '../core/services/product-sort.service';

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
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly productPaginationService = inject(ProductPaginationService);
  private readonly productFilterService = inject(ProductFilterService);
  private readonly productSortService = inject(ProductSortService);
  private readonly router = inject(Router);
  private readonly toastComponent = viewChild.required<ToastComponent>('toast');

  private totalProducts = signal<Product[]>([]);
  protected products: Product[] = [];
  protected total = signal<number>(0);
  protected showingProducts = signal<string>('');

  /* Query Params */
  protected page = input<string>();
  protected searchTerm = input<string>();
  protected sortBy = input<string>();
  /* Filters */
  protected category = input<string>();
  protected fromPrice = input<string>();
  protected toPrice = input<string>();

  protected selectedPage = computed(() => Number(this.page()) || 1);
  protected selectedFromPrice = computed(() => Number(this.fromPrice()) || 0);
  protected selectedToPrice = computed(() =>
    this.toPrice() ? Number(this.toPrice()) : 5000
  );

  constructor() {
    effect(() => {
      const filteredProducts = this.productFilterService.filter(
        this.totalProducts(),
        {
          category: this.category(),
          fromPrice: this.selectedFromPrice(),
          toPrice: this.selectedToPrice(),
        }
      );

      const sortedProducts = this.productSortService.sort(
        filteredProducts,
        this.sortBy()
          ? (this.sortBy() as SortStrategyName)
          : SortStrategyName.NAME_ASC
      );

      const products = this.productPaginationService.paginate(
        sortedProducts,
        this.selectedPage()
      );

      if (products.length == 0) {
        this.loadPage(this.selectedPage() - 1);
      } else {
        this.products = products;
      }

      const desiredFinalIndex = this.selectedPage() * 6;
      const startIndex = Math.min(
        desiredFinalIndex - 5,
        filteredProducts.length
      );
      const endIndex = Math.min(desiredFinalIndex, filteredProducts.length);

      this.showingProducts.set(`${startIndex}-${endIndex}`);
      this.total.set(filteredProducts.length);
    });
  }

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (totalProducts) => {
        this.totalProducts.set(totalProducts);

        setTimeout(() => {
          initFlowbite();
        }, 100);
      },
      error: () => {
        this.toastComponent().open({
          message: 'Error fetching products...',
          type: 'error',
        });
      },
    });
  }

  addProduct(product: Product) {
    this.totalProducts.update((products) => [product, ...products]);

    /* Update modal events */
    setTimeout(() => {
      initFlowbite();
    }, 100);
  }

  deleteProduct(target: Product) {
    this.totalProducts.update((products) =>
      products.filter((product) => product.id !== target.id)
    );
  }

  updateProduct(target: Product) {
    this.totalProducts.update((products) => {
      products = products.filter((product) => product.id !== target.id);
      return [target, ...products];
    });
  }

  loadPage(page: number) {
    if (page < 1 || Math.ceil(this.total() / 6) < page) return;

    this.router.navigate(['/products'], {
      queryParams: {
        page,
      },
      queryParamsHandling: 'merge',
    });
  }
}
