import { Component, signal } from '@angular/core';
import { ToastData } from './toast.interface';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'tm-toast',
  imports: [],
  templateUrl: './toast.component.html',
  animations: [
    trigger('slideInOut', [
      state(
        'slideIn',
        style({
          right: '32px',
          opacity: 1,
        })
      ),
      state(
        'slideOut',
        style({
          visibility: 'hidden',
          right: '-100%',
        })
      ),
      transition('slideIn <=> slideOut', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class ToastComponent {
  protected data = signal<ToastData>({
    message: 'Default message',
    type: 'success',
    show: false,
  });

  open(toastData: ToastData) {
    this.data.set({ ...toastData, show: true });

    setTimeout(() => {
      this.hide();
    }, 5000);
  }

  hide() {
    this.data.update((value) => ({ ...value, show: false }));
  }
}
