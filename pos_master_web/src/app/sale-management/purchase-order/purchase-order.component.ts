import { Component, OnInit } from '@angular/core';
import { Product } from '../../inventory/product/product.model';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../inventory/product/product.service';
import { InvoiceService } from './invoice.service';
import { InvoiceDto, ItemSellDto } from '../../../models/purchase-order/purchase-order.dto';


@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss',
  providers: [MessageService]
})
export class PurchaseOrderComponent implements OnInit {


  constructor(private messageService: MessageService, private productService: ProductService, private invoiceService: InvoiceService) { }

  products: Product[] = [];
  orderItems: ItemSellDto[] = [];

  selectedProduct?: Product;
  quantity: number = 1;
  filteredProducts: Product[] = [];

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
      //const existing = this.orderItems.find(p => p.id === matched.id);

      // if (existing) {
      //   existing.quantity = (existing.quantity ?? 1) + 1;
      // } else {
      //this.orderItems.push({ ...matched });
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
      if (this.orderItems.find(item => item.productId === this.selectedProduct?.id)) {
        this.orderItems.find(item => item.productId === this.selectedProduct?.id)!.qty += 1;
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Product already in order and qty added' });
      } else {
        //if not exists, add to order
        //console.log('Adding to order:', this.selectedProduct);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `${this.selectedProduct.name} added to order` });
        this.orderItems.push({
          productId: this.selectedProduct.id,
          product: this.selectedProduct,
          qtyTypeId: 1,
          qty: this.quantity,
          qntPrice: this.selectedProduct.currentPrice
        });
      }
    }
    this.calculateTotal();
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
    if (this.orderItems.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No items in order' });
      return;
    }

    const invoice: InvoiceDto = {
      total: 0,
      discount: 0,
      netTotal: 0,
      itemsSelled: this.orderItems
    };

    this.invoiceService.createInvoice(invoice).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order saved successfully!' });
        this.orderItems = [];
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save order' });
      }
    });
  }

  calculateTotal() {
    this.orderItems.forEach(item => {
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

  removeItem(item: Product) {
    //this.orderItems = this.orderItems.filter(p => p.id !== item.id);
  }

}

