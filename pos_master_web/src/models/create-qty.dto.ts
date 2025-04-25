export class CreateQtyDto {
    productId!: number; // ID of the associated product
    qtyTypeId!: number; // ID of the associated QtyType
    qty!: number;
}
