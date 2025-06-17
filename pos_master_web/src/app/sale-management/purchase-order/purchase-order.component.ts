import { Component, OnInit } from '@angular/core';
import { Product } from '../../inventory/product/product.model';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../inventory/product/product.service';
import { InvoiceService } from './invoice.service';
import { InvoiceDto, ItemSellDto, } from '../../../models/purchase-order/purchase-order.dto';
import { PurchaseOrderService } from './purchase-order.service';
import { BrowserMultiFormatReader, Result } from '@zxing/library';
import { BarcodeFormat } from '@zxing/library';


@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss',
  providers: [MessageService]
})
export class PurchaseOrderComponent implements OnInit {


  constructor(private messageService: MessageService, private productService: ProductService, private invoiceService: InvoiceService, public puchaseOrderService: PurchaseOrderService) { }

  products: Product[] = [];

  selectedProduct?: Product;
  quantity: number = 1;
  filteredProducts: Product[] = [];
  showScanner: boolean = false;
  scannedCode: string = '';
  availableDevices: MediaDeviceInfo[] = [];
   selectedDevice: MediaDeviceInfo | undefined = undefined; // Changed from null to undefined

  visible: boolean = false;
  private codeReader = new BrowserMultiFormatReader();
  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/];


  showDialog() {
    this.visible = true;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  filterProductsByBarCodeOrQR(barCode: string) {
    if (!(barCode.length > 1)) {
      this.filteredProducts = this.products;
      return;
    }

    const matched = this.products.find(product =>
      product.barCode?.toLowerCase() === barCode.toLowerCase() ||
      product.qrCode?.toLowerCase() === barCode.toLowerCase()
    );

    if (matched) {
      //const existing = this.puchaseOrderService.order.itemsSelled.find(p => p.id === matched.id);

      // if (existing) {
      //   existing.quantity = (existing.quantity ?? 1) + 1;
      // } else {
      //this.puchaseOrderService.order.itemsSelled.push({ ...matched });
      // }
    }

    this.filteredProducts = this.products.filter(product =>
      product.barCode?.toLowerCase().includes(barCode.toLowerCase()) ||
      product.qrCode?.toLowerCase().includes(barCode.toLowerCase())
    );
  }


  //loadProducts
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data
        this.filteredProducts = data; // Initialize filtered products with all products
      },
      error: () => this.showToast('Failed to load products', 'error')
    });
  }

  addItemToOrder($event: any) {
    // Prevent default form submission
    if (this.selectedProduct) {
      // console.log('Selected Product:', this.selectedProduct);
      //if alredy exists in order
      if (this.puchaseOrderService.order.itemsSelled.find(item => item.productId === this.selectedProduct?.id)) {
        this.puchaseOrderService.order.itemsSelled.find(item => item.productId === this.selectedProduct?.id)!.qty += 1;
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Product already in order and qty added' });
      } else {
        //if not exists, add to order
        //console.log('Adding to order:', this.selectedProduct);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `${this.selectedProduct.name} added to order` });
        this.puchaseOrderService.order.itemsSelled.push({
          productId: this.selectedProduct.id,
          product: this.selectedProduct,
          qtyTypeId: 1,
          qty: this.quantity,
          qntPrice: this.selectedProduct.currentPrice
        });
      }
    }
    this.calculateEachItemTotal();
  }

  // Filter products by name or barcode
  filterProducts(event: any) {
    if (!event || !event.filter) {
      this.filteredProducts = this.products; // Reset to all products if no filter
      return;
    }
    const query = event.filter.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.subcategory?.toLowerCase().includes(query) ||
      product.name?.includes(event.filter)
    );
    console.log('query:', query, this.filteredProducts);
    if (query == '') {
      this.filteredProducts = this.products; // Reset to all products if query is empty
    }
  }

  // Save Order
  saveOrder() {
    if (this.puchaseOrderService.order.itemsSelled.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No items in order' });
      return;
    }

    const invoice: InvoiceDto = {
      total: 0,
      discount: 0,
      netTotal: 0,
      itemsSelled: this.puchaseOrderService.order.itemsSelled
    };

    this.invoiceService.createInvoice(invoice).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order saved successfully!' });
        this.puchaseOrderService.order.itemsSelled = [];
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save order' });
      }
    });
  }

  calculateEachItemTotal() {

    this.puchaseOrderService.order.itemsSelled.forEach(item => {
      item.qntPrice = (item.product?.currentPrice ?? 0) * item.qty;
      console.log('Item:', item.product?.name, 'Qty:', item.qty, 'Price:', item.qntPrice);
    });
  }


  // Save Draft
  saveDraft() {
    if (!this.selectedProduct && this.quantity <= 0) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No items to save as draft' });
      return;
    }
    this.messageService.add({ severity: 'info', summary: 'Draft Saved', detail: 'Order is saved as draft.' });
  }

  showToast(message: string, severity: 'success' | 'error') {
    this.messageService.add({ severity, summary: message, life: 3000 });
  }

  removeItem(item: any) {
    console.log("removeItem called with item:", item);
    if (!item || !item.product) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid item to remove' });
      return;
    }
    console.log('Removing item:', item.product.name, 'from order');
    // Remove the item from the orderItems array
    //this.puchaseOrderService.order.itemsSelled = this.puchaseOrderService.order.itemsSelled.filter(p => p.id !== item.id);
    // Show a message indicating the item was removed
    console.log('Item removed:', item.product.name);
    this.messageService.add({ severity: 'warn', summary: 'Item Removed', detail: `${item.product?.name} removed from order` });
    this.puchaseOrderService.order.itemsSelled = this.puchaseOrderService.order.itemsSelled.filter(p => p.productId !== item.product?.id);

  }

  calculateTotal() {
    let total = 0;
    this.puchaseOrderService.order.itemsSelled.forEach(item => {
      total += item.qntPrice * item.qty;
    });
    console.log('Total:', total);
    this.puchaseOrderService.order.total = total;
    // this.puchaseOrderService.order.netTotal = total - this.puchaseOrderService.order.discount;
    // console.log('Net Total:', this.puchaseOrderService.order.netTotal);
    // this.messageService.add({ severity: 'info', summary: 'Total Calculated', detail: `Total: ${this.puchaseOrderService.order.total}, Net Total: ${this.puchaseOrderService.order.netTotal}` });
  }

  // Toggle scanner visibility
  toggleScanner() {
    this.showScanner = !this.showScanner;
    if (!this.showScanner) {
      this.codeReader.reset(); // Stop camera when hiding scanner
    }
  }

  // Handle scanned barcode/QR code
  onScanSuccess(result: string) {
    this.scannedCode = result;
    this.filterProductsByBarCodeOrQR(result);
    this.messageService.add({ severity: 'success', summary: 'Scan Success', detail: `Scanned: ${result}` });
    this.showScanner = false; // Hide scanner after successful scan
    this.codeReader.reset(); // Stop camera
  }

  // Handle camera device change
  onDeviceChange(event: any) {
    this.selectedDevice = event.value;
  }

}

