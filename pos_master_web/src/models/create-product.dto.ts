
export class CreateProductDto{
  name!: string;
  description?: string;
  category?: string;
  subcategory?: string;
  currentPrice!: number;
  warranty: number = 0;
  supplierId: number = 0;
  qtyTypeId!: number;
}