export class CreateProductPriceDto {
    wholeSalePrice!: number;
    broughtPrice!: number;
    primarySalePrice!: number;
    productId!: number; // ID of the associated product
}