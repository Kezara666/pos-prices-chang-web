import { Product } from "../../app/inventory/product/product.model";
import { QtyType } from "../qty-type/qty-type";
import { IShop } from "../shop/shop.dto";
import { IUser } from "../user/create-user.dto";

export interface ItemSellDto {
  id?: number,
  productId: number;
  product?: Product;
  qtyTypeId: number;
  qtyType?: QtyType;
  qty: number;
  qntPrice: number;
  status?: number;
  pendingdAmount?: number;
  completedItemSell?: boolean;
  shop?: IShop;
  shopId: number;
  createdById: number;
  updatedById: number;
  createdBy?: IUser
}

export interface InvoiceDto {
  id?: number,
  customerId?: number;
  total: number;
  discount: number;
  netTotal: number;
  itemsSelled: ItemSellDto[];
  pendingdAmount?: number;
  completedItemSell?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  shop?: IShop;
  shopId: number;
  createdById: number;
  updatedById: number;
  createdBy?: IUser

}
