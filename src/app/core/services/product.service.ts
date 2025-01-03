import { inject, Injectable } from '@angular/core';
import { CreateProductDto } from '../dto/create-product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../shared/models/product';

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
}
