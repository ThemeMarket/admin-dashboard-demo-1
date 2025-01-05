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
import { Product } from '../../../shared/models/product';
import { hasErrorForm } from '../../../shared/utils/has-error-form';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'tm-edit-product-modal',
  imports: [ReactiveFormsModule, ToastComponent],
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['../../../shared/styles/forms.css'],
})
export class EditProductModalComponent {
  private readonly productService = inject(ProductService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly imageService = inject(ImageService);
  private readonly closeBtn =
    viewChild.required<ElementRef<HTMLButtonElement>>('closeBtn');
  private readonly toastComponent =
    viewChild.required<ToastComponent>('editModalToast');

  protected product?: Product;
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

  onSubmit() {
    if (!this.form.valid) return;
    if (this.images().length === 0) {
      this.toastComponent().open({
        message: 'An image is required for this product.',
        type: 'warning',
      });
      return;
    }

    const formValues = this.form.value;

    if (this.discountType() && !Number(formValues.discount)) {
      this.toastComponent().open({
        message:
          'Product with a discount type must have a discount greater than 0.',
        type: 'warning',
      });
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
            this.closeBtn().nativeElement.click();
            this.toastComponent().open({
              message: 'Product updated successfully.',
              type: 'success',
            });
          },
          error: () =>
            this.toastComponent().open({
              message: 'A server error has occurred',
              type: 'error',
            }),
        });
    }
  }
}
