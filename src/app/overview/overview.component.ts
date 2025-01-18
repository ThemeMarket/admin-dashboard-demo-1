import { OrderService } from '@/core/services/order.service';
import { ProductService } from '@/core/services/product.service';
import { Order } from '@/shared/models/order';
import { Product } from '@/shared/models/product';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';

interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  grid: ApexGrid;
}

interface BestOfferProduct {
  product: Product;
  discountPrice: number;
}

@Component({
  selector: 'tm-overview',
  imports: [NgApexchartsModule, CurrencyPipe, RouterLink, DatePipe],
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);

  protected chartOptions: ChartOptions;
  protected bestOffersProducts = signal<BestOfferProduct[]>([]);
  protected orders = signal<Order[]>([]);

  constructor() {
    this.chartOptions = {
      chart: {
        height: 300,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      series: [
        {
          name: 'Revenue',
          data: [15, 17, 20, 17, 19, 22, 18, 20, 24, 20, 18, 21],
          color: '#7e3af2',
        },
        {
          name: 'Invested',
          data: [12, 16, 18, 15, 19, 17, 17, 20, 14, 17, 19, 16],
          color: '#3b82f6',
        },
      ],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yaxis: {
        labels: {
          formatter: (val) => val + 'k',
        },
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: '#e5e7eb',
        padding: {
          left: 24,
        },
      },
    };
  }

  ngOnInit(): void {
    this.productService
      .getOffers()
      .subscribe((offers) => this.bestOffersProducts.set(offers));

    this.orderService.getAll().subscribe((orders) => {
      /* Retrieve the last six orders */
      orders = orders.filter((_, index) => index >= orders.length - 6);
      this.orders.set(orders);
    });
  }
}
