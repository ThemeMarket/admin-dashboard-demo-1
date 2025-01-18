import { Injectable } from '@angular/core';
import { Product } from '@/shared/models/product';

interface Filters {
  fromPrice?: number;
  toPrice?: number;
  category?: string;
  searchTerm?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductFilterService {
  /**
   *
   * @param products - Array of products to be filtered
   * @param filters - Filters to filter the products array
   * @returns - An array of filtered products
   */
  filter(products: Product[], filters: Filters): Product[] {
    const { category, fromPrice, toPrice, searchTerm } = filters;

    return products.filter((product) => {
      let matched = true;

      if (category && product.category?.includes(category)) matched = false;
      if (fromPrice && fromPrice > product.price) matched = false;
      if (toPrice && toPrice < product.price) matched = false;
      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        matched = false;
      }

      return matched;
    });
  }
}
