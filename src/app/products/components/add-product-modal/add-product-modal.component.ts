import {
  Component,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { hasErrorForm } from '@/shared/utils/has-error-form';
import { ImageService } from '@/core/services/image.service';
import { ProductService } from '@/core/services/product.service';
import { Product } from '@/shared/models/product';
import { ToastComponent } from '@/shared/components/toast/toast.component';
import { buildProductForm } from '@/shared/utils/build-product-form';

@Component({
  selector: 'tm-add-product-modal',
  imports: [ReactiveFormsModule, ToastComponent],
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['../../../shared/styles/forms.css'],
})
export class AddProductModalComponent {
  private readonly imageService = inject(ImageService);
  private readonly productService = inject(ProductService);
  private readonly closeBtn =
    viewChild<ElementRef<HTMLButtonElement>>('closeBtn');
  private readonly toastComponent = viewChild.required<ToastComponent>(
    'addProductModalToast'
  );

  protected productAddedEvent = output<Product>();
  protected form = buildProductForm();

  /* Other form fields that can't be included in the form */
  protected discountType = signal<string>('');
  protected category = signal<string>('');
  protected images = signal<string[]>([]);

  hasErrors(fieldName: string, errorType: string): boolean {
    return hasErrorForm(this.form, fieldName, errorType);
  }

  loadImage(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith('image')) {
        this.toastComponent().open({
          message: 'The selected file is not a valid image.',
          type: 'warning',
        });
        return;
      }

      this.imageService.toBase64(file).then((img) => {
        this.images.update((imgs) => [...imgs, img]);
      });
    }
  }

  deleteImage(target: string) {
    this.images.update((images) => images.filter((img) => img !== target));
  }

  discard() {
    this.category.set('');
    this.discountType.set('');
    this.images.set([]);
    this.form.reset();
  }

  onSubmit() {
    if (!this.form.valid) return;

    const formValues = this.form.value;

    if (this.images().length === 0) {
      this.toastComponent().open({
        message: 'An image is required for this product.',
        type: 'warning',
      });
      return;
    } else if (this.discountType() && !Number(formValues.discount)) {
      this.toastComponent().open({
        message:
          'Product with a discount type must have a discount greater than 0.',
        type: 'warning',
      });
      return;
    }

    this.productService
      .create({
        name: formValues.name!,
        description: formValues.description!,
        stock: Number(formValues.stock),
        price: Number(formValues.price),
        discount: Number(formValues.discount),
        discountType: this.discountType(),
        category: this.category(),
        images: this.images(),
      })
      .subscribe({
        next: (newProduct) => {
          this.productAddedEvent.emit(newProduct);
          this.toastComponent().open({
            message: 'Product added successfully.',
            type: 'success',
          });
          this.closeBtn()?.nativeElement.click();
        },
        error: () =>
          this.toastComponent().open({
            message: 'A server error has occurred',
            type: 'error',
          }),
      });
  }
}
