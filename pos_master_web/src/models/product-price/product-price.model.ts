import { Product } from "../../app/inventory/product/product.model";
import { IShop } from "../shop/shop.dto";
import { IUser } from "../user/create-user.dto";

export interface ProductPrice {
  id: number;
  wholeSalePrice: number;
  broughtPrice: number;
  primarySalePrice: number;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
  shop?: IShop;
  shopId: number;
  createdById: number;
  updatedById: number;
  createdBy?: IUser
}


