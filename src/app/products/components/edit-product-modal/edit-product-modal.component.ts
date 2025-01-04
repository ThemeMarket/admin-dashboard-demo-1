import {
  Component,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ImageService } from '../../../core/services/image.service';
import { NotificationDirective } from '../../../core/directives/notification.directive';
import { Product } from '../../../shared/models/product';
import { hasErrorForm } from '../../../shared/utils/has-error-form';

@Component({
  selector: 'tm-edit-product-modal',
  imports: [ReactiveFormsModule, NotificationDirective],
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['../../../shared/styles/forms.css'],
})
export class EditProductModalComponent {
  private readonly productService = inject(ProductService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly imageService = inject(ImageService);
  private readonly notificationDirective = viewChild<NotificationDirective>(
    'notificationDirective'
  );
  private readonly closeBtn =
    viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  product?: Product;
  productUpdatedEvent = output<Product>();

  form = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(50)]],
    price: ['', [Validators.required, Validators.min(1)]],
    stock: [
      '',
      [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
    ],
    discount: ['', Validators.max(100)],
  });

  discountType = signal<string>('');
  category = signal<string>('');
  images = signal<string[]>([]);

  setProduct(product: Product) {
    this.product = product;

    this.category.set(product.category ?? '');
    this.discountType.set(product.discountType ?? '');
    this.images.set(product.images);

    this.form.patchValue({
      description: product.description,
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      discount: product.discount.toString(),
    });
  }

  hasErrors(fieldName: string, errorType: string): boolean {
    return hasErrorForm(this.form, fieldName, errorType);
  }

  loadImage(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith('image')) {
        this.notificationDirective()?.createNotification(
          'The selected file is not a valid image.',
          'warning'
        );
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

  onSubmit() {
    if (!this.form.valid) return;

    const formValues = this.form.value;

    if (this.images().length === 0) {
      this.notificationDirective()?.createNotification(
        'An image is required for this product.',
        'warning'
      );
      return;
    } else if (this.discountType() && !Number(formValues.discount)) {
      this.notificationDirective()?.createNotification(
        'Product with a discount type must have a discount greater than 0.',
        'warning'
      );
      return;
    }

    if (this.product) {
      this.productService
        .update(this.product.id, {
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
          next: (updatedProduct) => {
            this.productUpdatedEvent.emit(updatedProduct);
            this.notificationDirective()?.createNotification(
              'Product updated successfully.',
              'success'
            );
            this.closeBtn()?.nativeElement.click();
          },
          error: () =>
            this.notificationDirective()?.createNotification(
              'A server error has occurred',
              'error'
            ),
        });
    }
  }
}
