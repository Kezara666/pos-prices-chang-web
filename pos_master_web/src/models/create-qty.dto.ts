export class CreateQtyDto {
  productId!: number; // ID of the associated product
  qtyTypeId!: number; // ID of the associated QtyType
  qty!: number;
  shopId!: number;
  updatedById!: number;
  createdById!:number;
}


export class UpdateQtyDto {
  productId?: number;
  qtyTypeId?: number;
  qty?: number;
  shopId!: number;
  updatedById!: number;
}