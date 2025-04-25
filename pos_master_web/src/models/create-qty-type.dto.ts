export class CreateQtyTypeDto {
    name!: string;
    mainQtyId?: number; // ID of the parent QtyType (if any)
    primaryWeightTo!: number;
}
