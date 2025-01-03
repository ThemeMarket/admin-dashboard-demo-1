import { Component, inject, input, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AddProductModalComponent } from './components/add-product-modal/add-product-modal.component';
import { FilterDropdownComponent } from './components/filter-dropdown/filter-dropdown.component';
import { SortDropdownComponent } from './components/sort-dropdown/sort-dropdown.component';
import { DeleteModalComponent } from './components/delete-product-modal/delete-product-modal.component';
import { EditProductModalComponent } from './components/edit-product-modal/edit-product-modal.component';
import { ProductService } from '../core/services/product.service';
import { Product } from '../shared/models/product';
import { CurrencyPipe, NgOptimizedImage, PercentPipe } from '@angular/common';

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
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService);

  /* Query params that I'll use to manipulate the products */
  displayBy = input<string>();

  products: Product[] = [];

  ngOnInit(): void {
    this.productService.getAll().subscribe((products) => {
      this.products = products;

      setTimeout(() => {
        initFlowbite();
      }, 100);
    });
  }
}
