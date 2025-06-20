import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../purchase-order/invoice.service';
import { InvoiceDto } from '../../../models/purchase-order/purchase-order.dto';

@Component({
  selector: 'app-old-purchase-orders',
  templateUrl: './old-purchase-orders.component.html',
  styleUrls: ['./old-purchase-orders.component.scss']
})
export class OldPurchaseOrdersComponent implements OnInit {
  purchaseOrders: InvoiceDto[] = [];
  displayInvoiceDetailsDialog: boolean = false;
  selectedInvoice: InvoiceDto | null = null;

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.invoiceService.getInvoices().subscribe(
      (data) => {
        this.purchaseOrders = data;
        console.log(data);
      },
      (error) => {
        console.error('Failed to load purchase orders', error);
      }
    );
  }

  // This method will be called when a table row is clicked
  showInvoiceDetails(invoice: InvoiceDto): void {
    this.selectedInvoice = invoice;
    this.displayInvoiceDetailsDialog = true;
  }

  // This method will be called to close the dialog
  hideInvoiceDetails(): void {
    this.displayInvoiceDetailsDialog = false;
    this.selectedInvoice = null;
  }
}