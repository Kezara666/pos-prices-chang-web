import { Component } from '@angular/core';
import { CreateProductDto } from '../../../models/create-product.dto';
import { CreateQtyTypeDto } from '../../../models/qty-type/qty-type';

@Component({
  selector: 'app-qty',
  templateUrl: './qty.component.html',
  styleUrl: './qty.component.scss'
})
export class QtyComponent {

  productList: CreateProductDto[] = [];
  qtyType: CreateQtyTypeDto[] = []

}
