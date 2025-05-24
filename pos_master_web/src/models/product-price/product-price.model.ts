export interface Product {
  id: number;
  name: string;
  // Add other fields as needed
}

export interface ProductPrice {
  id: number;
  wholeSalePrice: number;
  broughtPrice: number;
  primarySalePrice: number;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
}