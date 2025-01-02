export enum ProductDiscountType {
  NONE = 'None',
  BLACK_FRIDAY = 'Black Friday Discount',
  CHRISTMAS = 'Christmas Discount',
  THANKSGIVING = 'Thanksgiving Discount',
  NEW_YEAR = 'New Year Discount',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  discount: number;
  discountType: ProductDiscountType;
}
