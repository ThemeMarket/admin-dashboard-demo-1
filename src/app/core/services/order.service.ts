import { Order } from '@/shared/models/order';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/orders';

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }
}
