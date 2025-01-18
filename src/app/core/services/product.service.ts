import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '@/shared/models/product';

interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  discount: number;
  discountType?: string;
  category?: string;
}

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

  getOffers(): Observable<{ product: Product; discountPrice: number }[]> {
    return this.getAll().pipe(
      map((products) =>
        products
          .filter((product) => product.discount > 30 && product.stock > 0)
          .map((product) => ({
            product,
            discountPrice:
              product.price - (product.discount * product.price) / 100,
          }))
      )
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
