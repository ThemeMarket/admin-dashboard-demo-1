import { OrderService } from '@/core/services/order.service';
import { ListLoadingComponent } from '@/shared/components/list-loading/list-loading.component';
import { Order } from '@/shared/models/order';
import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'tm-sales',
  imports: [ListLoadingComponent, CurrencyPipe],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  protected orders = signal<Order[]>([]);

  ngOnInit(): void {
    this.orderService.getAll().subscribe((orders) => {
      this.orders.set(orders);
    });
  }
}
