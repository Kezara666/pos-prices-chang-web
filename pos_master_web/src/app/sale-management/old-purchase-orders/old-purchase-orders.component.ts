import { Component, OnInit } from '@angular/core';
 // Import or create a PurchaseOrderService
import { InvoiceService } from '../purchase-order/invoice.service';
import { InvoiceDto } from '../../../models/purchase-order/purchase-order.dto';

@Component({
  selector: 'app-old-purchase-orders',
  templateUrl: './old-purchase-orders.component.html',
  styleUrls: ['./old-purchase-orders.component.scss']
})
export class OldPurchaseOrdersComponent implements OnInit {
  purchaseOrders: InvoiceDto[] = []; 

  constructor(private invoiceService:InvoiceService) { }

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.invoiceService.getInvoices().subscribe( // Assuming you have a getInvoices method in your servicePurchaseOrders method in your service
      (data) => {
        this.purchaseOrders = data;
        console.log(data)
      },
      (error) => {
        console.error('Failed to load purchase orders', error);
      }
    );
  }
}