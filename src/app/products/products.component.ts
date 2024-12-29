import { Component, input, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AddProductModalComponent } from './components/add-product-modal/add-product-modal.component';
import { FilterDropdownComponent } from "./components/filter-dropdown/filter-dropdown.component";
import { SortDropdownComponent } from "./components/sort-dropdown/sort-dropdown.component";

@Component({
  selector: 'tm-products',
  imports: [AddProductModalComponent, FilterDropdownComponent, SortDropdownComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  /* Query params that I'll use to manipulate the products */
  displayBy = input<string>();

  ngOnInit(): void {
    initFlowbite();
  }
}
