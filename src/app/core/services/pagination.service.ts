import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  /**
   *
   * @param arr - Array of elements to be paginated
   * @param page - The page to start retrieving the elements
   * @returns An array of elements for the given page
   *
   * @example
   * const elements = [1, 2, 3, 4, 5, 6, 7, 8, 9];
   * const page = 2;
   *
   * const result = paginationService.paginate(elements, page);
   * console.log(result); // -> [7,8,9]
   */
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
