import { Component, inject, output, signal, viewChild } from '@angular/core';
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
  formBuilder = inject(FormBuilder);
  imageService = inject(ImageService);
  productService = inject(ProductService);

  newProductEvent = output<Product>();

  form = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(25)]],
    price: ['', [Validators.required, Validators.min(1)]],
    stock: [
      '',
      [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
    ],
    discount: ['', Validators.max(100)],
  });

  discountType = signal<string>('None');
  category = signal<string>('None');
  images = signal<string[]>([]);

  notificationDirective = viewChild<NotificationDirective>(
    'notificationDirective'
  );

  hasErrors(fieldName: string, errorType: string): boolean {
    return hasErrorForm(this.form, fieldName, errorType);
  }

  loadImage(e: Event): void {
    const input = e.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith('image')) {
        this.notificationDirective()?.notify(
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
    if (this.images().length === 0) {
      this.notificationDirective()?.notify(
        'An image is required for this product.',
        'warning'
      );
      return;
    }
    if (!this.form.valid) return;

    this.notificationDirective()?.notify(
      'Product added successfully.',
      'success'
    );
    const formValues = this.form.value;

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
          this.newProductEvent.emit(newProduct);
        },
        error: () =>
          this.notificationDirective()?.notify(
            'A server error has occurred',
            'error'
          ),
      });
  }
}
