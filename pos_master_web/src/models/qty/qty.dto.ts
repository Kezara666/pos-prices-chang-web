import { Product } from "../../app/inventory/product/product.model";
import { QtyType } from "../qty-type/qty-type";
import { IShop } from "../shop/shop.dto";
import { IUser } from "../user/create-user.dto";

export interface Qty {
    id: number; // Unique identifier for the quantity
    productId: number | Product; // ID of the associated product
    product?: Product
    qtyTypeId: number | QtyType; // ID of the associated QtyType
    qtyType?: QtyType
    qty: number;
    shopId: number;
    shop?: IShop
    createdById: number;
    updatedById: number;
    updatedBy?: IUser;
}
