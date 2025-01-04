import { inject, Injectable } from '@angular/core';
import { CreateProductDto } from '../dto/create-product';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../../shared/models/product';
import { PaginationDto } from '../dto/pagination';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/products';

  create(createProductDto: CreateProductDto): Observable<Product> {
    const id = crypto.randomUUID();
    const product = { id, ...createProductDto };

    return this.http.post<Product>(this.baseUrl, product);
  }

  getAll(paginationDto: PaginationDto): Observable<{
    products: Product[];
    total: number;
    showing: string;
  }> {
    return this.http
      .get<Product[] | null>(this.baseUrl)
      .pipe(map((products) => (products ? products : [])))
      .pipe(
        map((products) => {
          const { page, limit } = paginationDto;
          const startIndex = (page - 1) * limit;
          const pageProducts = [];

          for (let i = 0; i < 6; i++) {
            const product = products[startIndex + i];
            if (product) pageProducts.push(product);
          }

          return {
            products: pageProducts,
            total: products.length,
            showing: `${startIndex + 1}-${
              page * limit > products.length ? products.length : page * limit
            }`,
          };
        })
      );
  }

  delete(id: string): Observable<Product> {
    return this.http.delete<Product>(`${this.baseUrl}/${id}`);
  }

  update(
    id: string,
    updateProductDto: Partial<CreateProductDto>
  ): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, updateProductDto);
  }
}
