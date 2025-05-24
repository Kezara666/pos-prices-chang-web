export interface QtyType {
  id?: number;
  name: string;
  primaryWeightTo: number;
  mainQtyId: number;
}

export class CreateQtyTypeDto implements QtyType {
  
    name!: string;
    mainQtyId!: number; // ID of the parent QtyType (if any)
    primaryWeightTo!: number;
}
