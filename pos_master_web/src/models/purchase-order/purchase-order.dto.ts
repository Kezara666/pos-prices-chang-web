import { Product } from "../../app/inventory/product/product.model";
import { QtyType } from "../qty-type/qty-type";

export interface ItemSellDto {
  productId: number;
  product?:Product;
  qtyTypeId: number;
  qtyType?:QtyType;
  qty: number;
  qntPrice: number;
  status?: number;
  pendingdAmount?: number;
  completedItemSell?: boolean;
}

export interface InvoiceDto {
  customerId?: number;
  total: number;
  discount: number;
  netTotal: number;
  itemsSelled: ItemSellDto[];
  pendingdAmount?: number;
  completedItemSell?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

}
