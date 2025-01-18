import { Injectable } from '@angular/core';
import { Product } from '@/shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  paginate<T>(arr: T[], page: number): T[] {
    const startIndex = page * 6 - 6;
    const results = [];

    for (let i = 0; i < 6; i++) {
      const el = arr[startIndex + i];
      if (el) {
        results.push(el);
      }
    }

    return results;
  }
}
