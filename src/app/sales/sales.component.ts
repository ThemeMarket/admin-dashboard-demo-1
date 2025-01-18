import { OrderService } from '@/core/services/order.service';
import { PaginationService } from '@/core/services/pagination.service';
import { ListLoadingComponent } from '@/shared/components/list-loading/list-loading.component';
import { Order } from '@/shared/models/order';
import { getShowingInformation } from '@/shared/utils/get-showing-information';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'tm-sales',
  imports: [ListLoadingComponent, CurrencyPipe, RouterLink, NgOptimizedImage],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
  private readonly paginationService = inject(PaginationService);

  protected totalOrders = signal<Order[]>([]);
  protected orders = signal<Order[]>([]);
  protected total = signal<number>(0);
  protected showingOrders = signal<string>('');

  /* Query Params */
  orderStatus = input<string>();
  page = input<string>();

  /* Query Params mapped to usable values */
  protected selectedPage = computed(() => Number(this.page()) || 1);

  constructor() {
    effect(() => {
      const orderStatus = this.orderStatus() ?? '';
      const page = this.selectedPage();

      this.orderService.getAll().subscribe((orders) => {
        const filteredOrders = orders.filter((order) =>
          order.status.includes(orderStatus)
        );

        orders = this.paginationService.paginate(filteredOrders, page);

        this.totalOrders.set(filteredOrders);
        this.orders.set(orders);

        this.updateShowingInformation(filteredOrders);
      });
    });
  }

  loadPage(page: number) {
    if (page < 1 || Math.ceil(this.totalOrders().length / 6) < page) return;

    this.router.navigate(['/sales'], {
      queryParams: {
        page,
      },
      queryParamsHandling: 'merge',
    });
  }

  updateShowingInformation(orders: Order[]) {
    const info = getShowingInformation(orders, this.selectedPage());
    this.showingOrders.set(info.showing);
    this.total.set(info.total);
  }
}
