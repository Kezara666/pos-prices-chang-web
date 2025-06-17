import { Injectable } from '@angular/core';
import { InvoiceDto, ItemSellDto } from '../../../models/purchase-order/purchase-order.dto';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  order: InvoiceDto = {
    customerId: undefined,
    total: 0,
    discount: 0,
    netTotal: 0,
    itemsSelled: []
  }

  constructor() { }
}
