import { Injectable } from '@angular/core';
import { InvoiceDto, ItemSellDto } from '../../../models/purchase-order/purchase-order.dto';
import { Qty } from '../../../models/qty/qty.dto';
import { QtyService } from '../../inventory/qty/qty.service';
import { Product } from '../../inventory/product/product.model';
import { LoginService } from '../../login/login.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  quantities: Qty[] = [];


  order!: InvoiceDto;

  constructor(private qtyService: QtyService, private loginService: LoginService, private http: HttpClient) {
    this.order = {
      customerId: undefined,
      total: 0,
      discount: 0,
      netTotal: 0,
      itemsSelled: [],
      pendingdAmount: 0,
      shopId: loginService.shopId,
      createdById: loginService.userId,
      updatedById: loginService.userId
    }
    this.loadQuantities()

  }

  loadQuantities() {
    this.qtyService.getAllQuantities().subscribe({
      next: (data) => {
        console.log(data);
        (this.quantities = data)
      },
      error: () => { }
    });
  }

  checkProductAvible(product: Product): number {
    return product.qty
  }

  clearOrder() {
    this.order = {
      customerId: undefined,
      total: 0,
      discount: 0,
      netTotal: 0,
      itemsSelled: [],
      pendingdAmount: 0,
      shopId: this.loginService.shopId,
      createdById: this.loginService.userId,
      updatedById: this.loginService.userId

    }
  }

 
}
