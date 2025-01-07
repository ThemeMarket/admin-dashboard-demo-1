import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tm-sort-dropdown',
  imports: [],
  templateUrl: './sort-dropdown.component.html',
})
export class SortDropdownComponent {
  private readonly router = inject(Router);

  sort(sortStrategy: string) {
    this.router.navigate(['/products'], {
      queryParamsHandling: 'merge',
      queryParams: {
        sortBy: sortStrategy,
      },
    });
  }
}
