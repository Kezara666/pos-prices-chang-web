import { ProductPrice } from "../../../models/product-price/product-price.model";
import { QtyType } from "../../../models/qty-type/qty-type";
import { IShop } from "../../../models/shop/shop.dto";
import { ISupplierDto } from "../../../models/supplier/supplier.dto";
import { IUser } from "../../../models/user/create-user.dto";

export interface Product {
  id: number;
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
  productPrice?: ProductPrice;
  qty: number
  shop?: IShop;
  shopId: number;
  createdById: number;
  updatedById: number;
  createdBy?: IUser
}

// frontend/src/models/create-product-with-dependencies.dto.ts

export interface CreateProductWithDependenciesDto {
  // Product fields
  name: string;
  description?: string; // Assuming description can be optional
  barCode?: string; // Assuming barCode can be optional
  qrCode?: string; // Assuming qrCode can be optional
  category: string;
  subcategory?: string; // Assuming subcategory can be optional
  currentPrice: number; // This will likely be overwritten by primarySalePrice from productPrice during backend processing
  warranty: number;
  supplierId: number;
  qtyTypeId: number;
  qty: number; // This is the initial quantity for the product
  shopId: number;
  createdById: number;
  updatedById: number;

  // ProductPrice nested object
  productPrice: {
    wholeSalePrice: number;
    broughtPrice: number;
    primarySalePrice: number;
    shopId: number;
    createdById: number;
    updatedById: number;
  };

  // Quantity data nested object (you named it qtyData)
  qtyData: {
    qty: number; // Redundant with top-level 'qty' if it's the same, but kept as per your request structure
    qtyTypeId: number; // Redundant with top-level 'qtyTypeId' if it's the same, but kept as per your request structure
    shopId: number;
    createdById: number;
    updatedById: number;
  };
}