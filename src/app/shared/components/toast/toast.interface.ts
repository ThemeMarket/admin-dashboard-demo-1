export interface ToastData {
  message: string;
  type: 'error' | 'warning' | 'success';
  show?: boolean;
}
