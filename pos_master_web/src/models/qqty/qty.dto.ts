import { Product } from "../../app/inventory/product/product.model";
import { QtyType } from "../qty-type/qty-type";

export interface Qty {
    id: number; // Unique identifier for the quantity
    productId: number | Product; // ID of the associated product
    qtyTypeId: number | QtyType; // ID of the associated QtyType
    qty: number;
}
