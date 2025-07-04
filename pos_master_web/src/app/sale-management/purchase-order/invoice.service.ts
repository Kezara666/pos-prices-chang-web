// services/invoice.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoiceDto } from '../../../models/purchase-order/purchase-order.dto';
import { environment } from '../../../environments/environment.prod';


@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private apiUrl = `${environment.backendUrl}/invoice`;
  invoices: InvoiceDto[] = [];

  constructor(private http: HttpClient) {
    
  }

  createInvoice(invoice: InvoiceDto) {
    this.invoices.push(invoice);
    return this.http.post(`${this.apiUrl}`, invoice);
  }

  getInvoices() {
    return this.http.get<InvoiceDto[]>(this.apiUrl);
  }

   printBill(invoice: InvoiceDto) {
    return this.http.post(`${environment.localBillUrl}/invoice/bill`, invoice);
  }

}
