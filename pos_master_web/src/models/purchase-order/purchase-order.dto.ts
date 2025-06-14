import { Product } from "../../app/inventory/product/product.model";
import { QtyType } from "../qty-type/qty-type";

export interface ItemSellDto {
  productId: number;
  product?:Product;
  qtyTypeId: number;
  qtyType?:QtyType;
  qty: number;
  qntPrice: number;
}

export interface InvoiceDto {
  customerId?: number;
  total: number;
  discount: number;
  netTotal: number;
  itemsSelled: ItemSellDto[];
}
