import {QtyType } from "../../../models/qty-type/qty-type";
import { ISupplierDto } from "../../../models/supplier/supplier.dto";

export interface Product {
  id: number ;
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
  qtyType?: QtyType;
  supplier?: ISupplierDto;
  createdAt?: string;
  updatedAt?: string;
  productPriceId?: number; 
}