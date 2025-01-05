import { Injectable } from '@angular/core';
import { Product } from '../../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductPaginationService {
  paginate(products: Product[], page: number): Product[] {
    const startIndex = page * 6 - 6;
    const results = [];

    for (let i = 0; i < 6; i++) {
      const product = products[startIndex + i];
      if (product) {
        results.push(product);
      }
    }

    return results;
  }
}
