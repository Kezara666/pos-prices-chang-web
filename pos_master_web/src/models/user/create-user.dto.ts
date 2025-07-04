import { IShop } from "../shop/shop.dto";

export interface IUser {
  id?:number;
  name: string;
  email?: string;
  phoneNumber?: string;
  idNumber?: string;
  role?: string;
  shopId: number;
  shop?:IShop;
}
