export interface Product {
  id?: number;
  name: string;
  description?: string;
  barCode?: string;
  qrCode?: string;
  category: string;
  subcategory?: string;
  currentPrice: number;
  warranty: number;
  supplierId: number;
  qtyTypeId: number;
  createdAt?: string;
  updatedAt?: string;
}