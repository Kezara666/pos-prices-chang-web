import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../inventory/product/product.service';
import { InvoiceService } from '../purchase-order/invoice.service';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  @ViewChild('receiptContent') receiptContent!: ElementRef;

  constructor(
    private messageService: MessageService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    public puchaseOrderService: PurchaseOrderService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void { 
    const shopName = localStorage.getItem('shopName') || 'Default Shop';
    this.nameOfShop =  this.loginService.currentUser()?.shop?.name || shopName; // Use shop name from the current user or fallback to localStorage 
  }

  now = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  today = new Date();
  nameOfShop = '';

  print(): void {
    const printContents = this.receiptContent.nativeElement.innerHTML;
    const printWindow = window.open('', '_blank', 'width=600,height=400');

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              @page {
                size: 80mm auto; /* 80mm width, dynamic height */
                margin: 0;
              }
              body {
                width: 80mm;
                margin: 0;
                padding: 2mm;
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.2;
              }
              .receipt {
                width: 100%;
                padding: 0;
                box-sizing: border-box;
              }
              .text-center {
                text-align: center;
              }
              .table {
                width: 100%;
                border-collapse: collapse;
                margin: 2mm 0;
              }
              .table th, .table td {
                border: none;
                padding: 1mm;
                text-align: left;
                font-size: 11px;
              }
              .table th {
                font-weight: bold;
              }
              hr {
                border: 0;
                border-top: 1px dashed #000;
                margin: 1mm 0;
              }
              p {
                margin: 1mm 0;
              }
              .totals-right {
                text-align: right;
                margin-right: 2mm; /* Adjusted for 80mm width */
              }
              @media print {
                body {
                  width: 80mm;
                  padding: 2mm;
                }
                .receipt {
                  max-width: 80mm;
                }
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              ${printContents}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      this.messageService.add({
        severity: 'info',
        summary: 'Print Instructions',
        detail: 'Select 80mm paper size or "Receipt" in the print dialog for best results.'
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to open print window' });
    }
  }
}