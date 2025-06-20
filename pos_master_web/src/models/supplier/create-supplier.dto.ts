import { ISupplierDto } from "./supplier.dto";

export class CreateSupplierDto implements ISupplierDto {
    id?: number | undefined;
    name!: string;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    shopId!: number;
    createdById!: number
}
