import { Product } from "../../app/inventory/product/product.model";

export interface ProductPrice {
  id: number;
  wholeSalePrice: number;
  broughtPrice: number;
  primarySalePrice: number;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
}


