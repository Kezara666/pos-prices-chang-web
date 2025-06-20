import { IShop } from "../shop/shop.dto";
import { IUser } from "../user/create-user.dto";

export interface ISupplierDto {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  shop?: IShop;
  shopId: number;
  createdById: number;
  createdBy?:IUser
}