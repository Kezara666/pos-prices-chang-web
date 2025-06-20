import { IShop } from "../shop/shop.dto";
import { IUser } from "../user/create-user.dto";

export interface QtyType {
  id?: number;
  name: string;
  primaryWeightTo: number;
  mainQtyId: number;
  mainQty?: QtyType;
  shopId: number;
  createdById: number;
  updatedById?: number;
  updatedBy?: IUser;
  createdBy?:IUser
  shop?: IShop
}

export class CreateQtyTypeDto implements QtyType {
  name!: string;
  mainQtyId!: number;
  primaryWeightTo!: number;
  createdById!: number;
  updatedById!: number;
  updatedBy?: IUser;
  shopId!:number;
  shop?: IShop;
}
