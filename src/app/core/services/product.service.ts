import { inject, Injectable } from '@angular/core';
import { CreateProductDto } from '@/core/dto/create-product';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '@/shared/models/product';

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

  getAll(): Observable<Product[]> {
    return this.http
      .get<Product[] | null>(this.baseUrl)
      .pipe(map((products) => (products ? products : [])));
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
