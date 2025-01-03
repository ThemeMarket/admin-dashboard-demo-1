import { Directive, inject, ViewContainerRef } from '@angular/core';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Directive({
  selector: '[tmNotification]',
  exportAs: 'tmNotification',
})
export class NotificationDirective {
  viewContainerRef = inject(ViewContainerRef);

  notify(message: string, type: 'error' | 'success' | 'warning') {
    const componentRef = this.viewContainerRef.createComponent(ToastComponent);
    componentRef.setInput('message', message);
    componentRef.setInput('type', type);

    componentRef.instance.show();

    setTimeout(() => {
      componentRef.destroy();
    }, 10000);
  }
}
