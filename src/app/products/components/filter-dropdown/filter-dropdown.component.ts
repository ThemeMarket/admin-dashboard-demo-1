import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tm-filter-dropdown',
  imports: [],
  templateUrl: './filter-dropdown.component.html',
})
export class FilterDropdownComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected fromPrice = signal<number>(0);
  protected toPrice = signal<number>(5000);
  protected category = signal<string>('');

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.category.set(params.get('category') ?? '');

      const strFromPrice = params.get('fromPrice');
      const fromPrice = strFromPrice ? Number(strFromPrice) : 0;
      this.fromPrice.set(fromPrice);

      const strToPrice = params.get('toPrice');
      const toPrice = strToPrice ? Number(strToPrice) : 5000;
      this.toPrice.set(toPrice);
    });
  }

  save() {
    this.router.navigate(['/products'], {
      queryParams: {
        fromPrice: this.fromPrice(),
        toPrice: this.toPrice(),
        category: this.category(),
      },
      queryParamsHandling: 'merge',
    });
  }

  reset() {
    this.fromPrice.set(0);
    this.toPrice.set(5000);
    this.category.set('');

    this.save();
  }
}
