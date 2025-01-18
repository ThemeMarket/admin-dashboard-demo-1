export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  PAYPAL = 'PayPal',
  BANK_TRANSFER = 'Bank Transfer',
}

export enum OrderStatus {
  SHIPPED = 'Shipped',
  PROCESSING = 'Processing',
  DELIVERED = 'Delivered',
  CANCELED = 'Canceled',
}

export interface Order {
  id: string;
  productName: string;
  date: string;
  price: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
}
