import { FormBuilder, Validators } from '@angular/forms';

export function buildProductForm() {
  const formBuilder = new FormBuilder();
  const form = formBuilder.group({
    name: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(50)]],
    price: ['', [Validators.required, Validators.min(1)]],
    stock: [
      '',
      [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
    ],
    discount: ['', Validators.max(100)],
  });

  return form;
}
