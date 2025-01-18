import { Injectable } from '@angular/core';
import { Product } from '@/shared/models/product';

export const enum SortStrategyName {
  NAME_ASC = 'Name (A-Z)',
  NAME_DESC = 'Name (Z-A)',
  PRICE_ASC = 'Price (Low to High)',
  PRICE_DESC = 'Price (High to Low)',
}

interface SortStrategy {
  name: SortStrategyName;
  callback: (products: Product[]) => Product[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductSortService {
  private sortStrategies: SortStrategy[] = [
    {
      name: SortStrategyName.NAME_ASC,
      callback: (products: Product[]) => {
        const collator = new Intl.Collator('en');
        return products.sort((a, b) => collator.compare(a.name, b.name));
      },
    },
    {
      name: SortStrategyName.NAME_DESC,
      callback: (products: Product[]) => {
        const collator = new Intl.Collator('en');
        return products.sort((a, b) => collator.compare(b.name, a.name));
      },
    },
    {
      name: SortStrategyName.PRICE_ASC,
      callback: (products: Product[]) => {
        return products.sort((a, b) => a.price - b.price);
      },
    },
    {
      name: SortStrategyName.PRICE_DESC,
      callback: (products: Product[]) => {
        return products.sort((a, b) => b.price - a.price);
      },
    },
  ];

  /**
   *
   * @param products - Array of products to be sorted
   * @param sortStrategyName - Name of the strategy which products will be sorted
   * @returns An array of sorted products
   * @throws An error if the given `sortStrategyName` is invalid
   */
  sort(products: Product[], sortStrategyName: SortStrategyName) {
    const sortStrategy = this.sortStrategies.find(
      (sortStrategy) => sortStrategy.name === sortStrategyName
    );

    if (!sortStrategy) {
      throw new Error(`Sort strategy: ${sortStrategyName} unsupported`);
    }

    return sortStrategy.callback(products);
  }
}
