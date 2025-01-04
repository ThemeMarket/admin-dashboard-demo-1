import {
  Component,
  ElementRef,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { Product } from '../../../shared/models/product';
import { ProductService } from '../../../core/services/product.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'tm-delete-product-modal',
  imports: [ToastComponent],
  templateUrl: './delete-product-modal.component.html',
})
export class DeleteModalComponent {
  private readonly productService = inject(ProductService);
  private readonly closeBtn =
    viewChild.required<ElementRef<HTMLButtonElement>>('closeBtn');
  private readonly toastComponent =
    viewChild.required<ToastComponent>('deleteModalToast');
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
          this.closeBtn().nativeElement.click();
          this.toastComponent().open({
            message: 'Product deleted successfully',
            type: 'success',
          });
        },
        error: () =>
          this.toastComponent().open({
            message: 'Error deleting product...',
            type: 'error',
          }),
      });
    }
  }
}
