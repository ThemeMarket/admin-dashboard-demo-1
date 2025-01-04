import {
  Component,
  ElementRef,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { Product } from '../../../shared/models/product';
import { ProductService } from '../../../core/services/product.service';
import { NotificationDirective } from '../../../core/directives/notification.directive';

@Component({
  selector: 'tm-delete-product-modal',
  imports: [NotificationDirective],
  templateUrl: './delete-product-modal.component.html',
})
export class DeleteModalComponent {
  private readonly productService = inject(ProductService);
  private readonly notificationDirective =
    viewChild.required<NotificationDirective>('notificationDirective');
  private readonly closeBtn =
    viewChild.required<ElementRef<HTMLButtonElement>>('closeBtn');

  private product?: Product;

  productDeletedEvent = output<Product>();

  setProduct(product: Product) {
    this.product = product;
  }

  delete() {
    if (this.product) {
      this.productService.delete(this.product.id).subscribe({
        next: (deletedProduct) => {
          this.productDeletedEvent.emit(deletedProduct);
          this.notificationDirective().createNotification(
            'Product deleted successfully',
            'success'
          );
          this.closeBtn().nativeElement.click();
        },
        error: () => {
          this.notificationDirective().createNotification(
            'Error deleting product...',
            'error'
          );
        },
      });
    }
  }
}
