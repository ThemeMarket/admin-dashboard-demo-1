import { Injectable } from '@angular/core';
import { Product } from '../../shared/models/product';

export interface Filters {
  fromPrice?: number;
  toPrice?: number;
  category?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductFilterService {
  filter(products: Product[], filters: Filters): Product[] {
    const { category = '', fromPrice = 0, toPrice = 5000 } = filters;

    return products.filter((product) => {
      let matched = true;

      if (!product.category?.includes(category)) matched = false;
      if (fromPrice > product.price) matched = false;
      if (toPrice < product.price) matched = false;

      return matched;
    });
  }
}
