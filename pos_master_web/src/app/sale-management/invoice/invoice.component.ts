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

  paperSizes = [
    { label: '80mm (Receipt)', value: '80mm' },
    { label: 'A4', value: 'A4' }
  ];
  selectedPaperSize = '80mm';

  constructor(
    private messageService: MessageService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    public puchaseOrderService: PurchaseOrderService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void { 
    const shopName = localStorage.getItem('shopName') || 'Default Shop';
    this.nameOfShop = this.loginService.currentUser()?.shop?.name || shopName;
  }

  now = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  today = new Date();
  nameOfShop = '';

  print(): void {
    const printContents = this.receiptContent.nativeElement.innerHTML;
    const printWindow = window.open('', '_blank', 'width=600,height=400');

    if (printWindow) {
      const pageSize = this.selectedPaperSize === 'A4' ? 'A4' : '80mm auto';
      const bodyWidth = this.selectedPaperSize === 'A4' ? '210mm' : '80mm';
      const maxWidth = this.selectedPaperSize === 'A4' ? '190mm' : '80mm';
      const padding = this.selectedPaperSize === 'A4' ? '10mm' : '2mm';
      const fontSize = this.selectedPaperSize === 'A4' ? '14px' : '12px';
      const tableFontSize = this.selectedPaperSize === 'A4' ? '13px' : '11px';
      const tablePadding = this.selectedPaperSize === 'A4' ? '2mm' : '1mm';
      const margin = this.selectedPaperSize === 'A4' ? '5mm' : '1mm';
      const totalsMarginRight = this.selectedPaperSize === 'A4' ? '10mm' : '2mm';
      const bodyHeight = this.selectedPaperSize === 'A4' ? '297mm' : 'auto'; // A4 height is 297mm
      const displayStyle = this.selectedPaperSize === 'A4' ? 'flex' : 'block';
      const flexDirection = this.selectedPaperSize === 'A4' ? 'column' : 'none';
      const footerStyle = this.selectedPaperSize === 'A4' ? 'margin-top: auto;' : 'margin-top: 3mm;';

      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              @page {
                size: ${pageSize};
                margin: 0;
              }
              body {
                width: ${bodyWidth};
                height: ${bodyHeight};
                margin: 0;
                padding: ${padding};
                font-family: Arial, sans-serif;
                font-size: ${fontSize};
                line-height: 1.2;
                display: ${displayStyle};
                flex-direction: ${flexDirection};
              }
              .receipt {
                width: 100%;
                max-width: ${maxWidth};
                padding: 0;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                min-height: ${this.selectedPaperSize === 'A4' ? '100%' : 'auto'};
              }
              .text-center {
                text-align: center;
              }
              .table {
                width: 100%;
                border-collapse: collapse;
                margin: ${margin} 0;
              }
              .table th, .table td {
                border: none;
                padding: ${tablePadding};
                text-align: left;
                font-size: ${tableFontSize};
              }
              .table th {
                font-weight: bold;
              }
              hr {
                border: 0;
                border-top: 1px dashed #000;
                margin: ${margin} 0;
              }
              p {
                margin: ${margin} 0;
              }
              .totals-right {
                text-align: right;
                margin-right: ${totalsMarginRight};
              }
              .mt-3.text-center {
                ${footerStyle}
              }
              @media print {
                body {
                  width: ${bodyWidth};
                  height: ${bodyHeight};
                  padding: ${padding};
                  display: ${displayStyle};
                  flex-direction: ${flexDirection};
                }
                .receipt {
                  max-width: ${maxWidth};
                  min-height: ${this.selectedPaperSize === 'A4' ? '100%' : 'auto'};
                  display: flex;
                  flex-direction: column;
                }
                .mt-3.text-center {
                  ${footerStyle}
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
        detail: `Select ${this.selectedPaperSize} paper size in the print dialog for best results.`
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to open print window' });
    }
  }
}