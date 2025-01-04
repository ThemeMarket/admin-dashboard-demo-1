import { Component, ElementRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'tm-toast',
  imports: [],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  message = input.required<string>();
  type = input.required<'success' | 'error' | 'warning'>();

  private readonly toastEl =
    viewChild.required<ElementRef<HTMLDivElement>>('toastEl');

  show() {
    this.toastEl().nativeElement.classList.add('opacity-100');
    this.toastEl().nativeElement.classList.remove('opacity-0');

    setTimeout(() => {
      this.hide();
    }, 5000);
  }

  hide() {
    this.toastEl().nativeElement.classList.remove('opacity-100');
    this.toastEl().nativeElement.classList.add('opacity-0');
  }
}
