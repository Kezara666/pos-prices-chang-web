import { IShop } from "./shop/shop.dto";
import { IUser } from "./user/create-user.dto";

export class CreateProductPriceDto {
    wholeSalePrice!: number;
    broughtPrice!: number;
    primarySalePrice!: number;
    productId!: number; // ID of the associated product
    shop?: IShop;
    shopId!: number;
    createdById!: number;
    updatedById!: number;
    createdBy?: IUser
}