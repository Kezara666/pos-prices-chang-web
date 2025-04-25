import { Component } from '@angular/core';
import { CreateQtyTypeDto } from '../../../models/create-qty-type.dto';
import { CreateProductDto } from '../../../models/create-product.dto';

@Component({
  selector: 'app-qty',
  templateUrl: './qty.component.html',
  styleUrl: './qty.component.scss'
})
export class QtyComponent {

  productList: CreateProductDto[] = [];
  qtyType: CreateQtyTypeDto[] = []

}
