import {
  Component,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { hasErrorForm } from '../../../shared/utils/has-error-form';
import { ImageService } from '../../../core/services/image.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../shared/models/product';
import { NotificationDirective } from '../../../core/directives/notification.directive';

@Component({
  selector: 'tm-add-product-modal',
  imports: [ReactiveFormsModule, NotificationDirective],
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['../../../shared/styles/forms.css'],
})
export class AddProductModalComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly imageService = inject(ImageService);
  private readonly productService = inject(ProductService);
  private readonly notificationDirective = viewChild<NotificationDirective>(
    'notificationDirective'
  );
  private readonly closeBtn =
    viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  productAddedEvent = output<Product>();

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
          this.notificationDirective()?.createNotification(
            'Product added successfully.',
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
