export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  discount: number;
  discountType?: string;
  category?: string;
}
