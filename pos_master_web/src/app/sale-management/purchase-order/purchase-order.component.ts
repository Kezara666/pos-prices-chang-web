import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InvoiceComponent } from '../invoice/invoice.component';
import { Product } from '../../inventory/product/product.model';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../inventory/product/product.service';
import { InvoiceService } from './invoice.service';
import { InvoiceDto, ItemSellDto, } from '../../../models/purchase-order/purchase-order.dto';
import { PurchaseOrderService } from './purchase-order.service';
import { BrowserMultiFormatReader } from '@zxing/library';
import { BarcodeFormat } from '@zxing/library';
import { QtyService } from '../../inventory/qty/qty.service';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss',
  providers: [MessageService]
})
export class PurchaseOrderComponent implements OnInit {
  @ViewChild('invoiceComponent') invoiceComponent!: InvoiceComponent;

  constructor(private messageService: MessageService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    public puchaseOrderService: PurchaseOrderService,
    private qtyService: QtyService,
    private changeDetectorRef: ChangeDetectorRef,
    private loginService: LoginService
  ) { }

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
  multipleMatches: Product[] = []; // Add this line
  displayProductSelection: boolean = false; // Add this line

  customerGivingPrice = 0;
  customerAllBounsePrice = 0;

  //#region Quantity Management
  /**
   * Handles the quantity change event.
   * @param event The item sell DTO.
   */
  onQtyChange(event: ItemSellDto) {
    if (event.product) {
      this.checkIsAvaibleProductAndSetMaxiumCanGet(event, event.qty)
      this.calculateEachItemTotal();
      this.calculateTotal();
    }
  }
  //#endregion Quantity Management

  //#region Order Item Creation
  /**
   * Gets the order sell item from the selected product.
   * @returns The item sell DTO.
   */
  getOrderSellItemFromSelectedProduct(): ItemSellDto {
    return {
      productId: this.selectedProduct!.id,
      productPriceId: this.selectedProduct!.productPrice?.id ?? 0,
      productPrice: this.selectedProduct!.productPrice,
      product: this.selectedProduct,
      qtyTypeId: 1,
      qty: this.quantity,
      qntPrice: this.selectedProduct!.currentPrice,
      status: 1,
      pendingdAmount: 0,
      completedItemSell: true,
      shopId: this.loginService.shopId ?? 0,
      createdById: this.loginService.userId ?? 0,
      updatedById: this.loginService.userId ?? 0
    }
  }
  //#endregion Order Item Creation

  //#region Dialog Management
  /**
   * Shows the dialog.
   */
  showDialog() {
    this.visible = true;
  }

  /**
   * Calls the print method from the invoice component.
   */
  printInvoice() {
    if (this.invoiceComponent) {
      this.invoiceComponent.print();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invoice component not available'
      });
    }
  }
  //#endregion Dialog Management

  //#region Lifecycle Hook
  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.loadProducts();
  }
  //#endregion Lifecycle Hook

  //#region Barcode/QR Code Filtering
  /**
   * Filters products by barcode or QR code.
   * @param barCode The barcode or QR code to filter by.
   */
  filterProductsByBarCodeOrQR(barCode: string) {
    // if (!(barCode.length <= 1)) {
    // this.filteredProducts = this.products;
    // return;
    // }

    const matched = this.products.find(product =>
      product.barCode?.toLowerCase() === barCode.toLowerCase() ||
      product.qrCode?.toLowerCase() === barCode.toLowerCase() ||
      product.barCode?.toLowerCase() === (barCode.toLowerCase()) ||
      product.qrCode?.toLowerCase() === (barCode.toLowerCase())
    );

    if (matched) {
      this.selectedProduct = matched;
      this.addItemToOrder(matched)
    }
    this.scannedCode = '';

  }
  //#endregion Barcode/QR Code Filtering

  //#region Load Product
  /**
   * Loads the products from the product service.
   */
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data
        this.filteredProducts = data; // Initialize filtered products with all products
      },
      error: () => this.showToast('Failed to load products', 'error')
    });
  }
  //#endregion Load Product

  //#region Add Item To Order List
  /**
   * Adds an item to the order list.
   * @param $event The event that triggered the function.
   */
  addItemToOrder($event: any) {
    console.log('Item added to order:', $event);
    // Prevent default form submission
    if (this.selectedProduct) {
      if (this.puchaseOrderService.order.itemsSelled.find(item => item.productId === this.selectedProduct?.id)) {
        this.increaseQuantity();
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Product already in order and qty added' });
      } else {
        //if not exists, add to order
        //console.log('Adding to order:', this.selectedProduct);
        const orderItem = this.getOrderSellItemFromSelectedProduct();
        if (this.checkIsAvaibleProductAndSetMaxiumCanGet(orderItem, orderItem.qty)) {
          this.puchaseOrderService.order.itemsSelled.push(orderItem);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `${this.selectedProduct.name} added to order` });
        }
      }
    }
    this.calculateEachItemTotal();
  }
  //#endregion Add Item To Order List

  //#region Product Filtering
  /**
   * Filters the products based on the search query.
   * @param event The event that triggered the filter.
   */
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
  //#endregion Product Filtering

  /**
   * Saves the order.
   */

  //#region Save Order
  saveOrder() {
    if (this.puchaseOrderService.order.itemsSelled.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No items in order' });
      return;
    }

    this.invoiceService.createInvoice(this.puchaseOrderService.order).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order saved successfully!' });
        console.log(response);
        this.puchaseOrderService.order.id = response.id;
        //this.puchaseOrderService.order = response;
        //this.puchaseOrderService.clearOrder();
        //call localhost bill print service
        console.log(response.id);
        if (response.id > 0) {
          this.showDialog();
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to print order' });
        }
      }
      
    });
  }
  //#region Order Clear
  /**

   * Cancels the order.
   */
  cancelOrder() {
    this.puchaseOrderService.clearOrder();
    this.visible = false;
    this.messageService.add({ severity: 'info', summary: 'Order Cleared', detail: 'Order has been cancelled.' });
    this.changeDetectorRef.markForCheck(); // Ensure the view updates
  }

  /**
   * Prints the order.
   */
  printOrder() {
    this.invoiceService.printBill(this.puchaseOrderService.order).subscribe({
      next: () => {
        this.messageService.add({ severity: 'info', summary: 'Print', detail: 'Bill printed successfully!' });
      },
      error: (err) => {
        console.error('Print error:', err);
        const errorMessage =
          err?.error?.message || // NestJS-style message
          err?.message ||        // Generic JS error
          'Failed to print bill'; // Fallback message

        this.messageService.add({
          severity: 'error',
          summary: 'Print Error',
          detail: `Failed to print bill: ${errorMessage}`
        });
      }
    });
  }


  //#endregion Order Management

  //#region Calculation
  /**
   * Calculates the total for each item in the order.
   */
  calculateEachItemTotal() {
    this.puchaseOrderService.order.itemsSelled.forEach(item => {
      item.qntPrice = (item.product?.currentPrice ?? 0) * item.qty;
      console.log('Item:', item.product?.name, 'Qty:', item.qty, 'Price:', item.qntPrice);
    });
  }
  //#endregion Calculation

  //#region Draft Management
  /**
   * Saves the order as a draft.
   */
  saveDraft() {
    this.printOrder()
    if (!this.selectedProduct && this.quantity <= 0) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No items to save as draft' });
      return;
    }
    this.messageService.add({ severity: 'info', summary: 'Draft Saved', detail: 'Order is saved as draft.' });
  }
  //#endregion Draft Management

  //#region Toast Management
  /**
   * Shows a toast message.
   * @param message The message to show.
   * @param severity The severity of the message.
   */
  showToast(message: string, severity: 'success' | 'error') {
    this.messageService.add({ severity, summary: message, life: 3000 });
  }
  //#endregion Toast Management

  //#region Item Removal
  /**
   * Removes an item from the order.
   * @param item The item to remove.
   */
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
  //#endregion Item Removal

  //#region Total Calculation
  /**
   * Calculates the total amount of the order.
   */
  calculateTotal() {
    let total = 0;
    this.puchaseOrderService.order.itemsSelled.forEach(item => {
      total += item.qntPrice;   
    });
    console.log('Total:', total);
    this.puchaseOrderService.order.total = total;
    this.puchaseOrderService.order.netTotal = total - this.puchaseOrderService.order.discount;
    // console.log('Net Total:', this.puchaseOrderService.order.netTotal);
    // this.messageService.add({ severity: 'info', summary: 'Total Calculated', detail: `Total: ${this.puchaseOrderService.order.total}, Net Total: ${this.puchaseOrderService.order.netTotal}` });
    //this.onQtyChange
  }
  //#endregion Total Calculation

  //#region Scanner Management
  /**
   * Toggles the visibility of the scanner.
   */
  toggleScanner() {
    this.showScanner = !this.showScanner;
    if (!this.showScanner) {
      this.codeReader.reset(); // Stop camera when hiding scanner
    }
  }

  /**
   * Handles the scanned barcode/QR code.
   * @param result The scanned result.
   */
  onScanSuccess(result: string) {
    this.scannedCode = result;
    this.filterProductsByBarCodeOrQR(result);
    this.messageService.add({ severity: 'success', summary: 'Scan Success', detail: `Scanned: ${result}` });
    this.showScanner = false; // Hide scanner after successful scan
    this.codeReader.reset(); // Stop camera
  }

  /**
   * Handles the camera device change.
   * @param event The device change event.
   */
  onDeviceChange(event: any) {
    this.selectedDevice = event.value;
  }
  //#endregion Scanner Management

  //#region Availability Check
  /**
   * Checks if a product is available and sets the maximum quantity that can be added to the order.
   * @param selectedOrder The selected order item.
   * @param reqQty The requested quantity.
   * @returns True if the product is available, false otherwise.
   */
  checkIsAvaibleProductAndSetMaxiumCanGet(selectedOrder: ItemSellDto, reqQty: number) {
    const qty = this.puchaseOrderService.checkProductAvible(selectedOrder.product!)
    console.log(qty)
    if (qty > reqQty) {
      this.showToast(`Available ${qty - reqQty} ${selectedOrder?.product?.qtyType?.name ?? ''}`, 'success');
      return true;
    }
    else {
      this.puchaseOrderService.order.itemsSelled = this.puchaseOrderService.order.itemsSelled.map(
        item => (item === selectedOrder ? { ...item, qty: qty } : item)
      );
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: `Only ${qty} available for ${selectedOrder.product?.name}` });
      this.changeDetectorRef.markForCheck();
      return false
    }
  }
  //#endregion Availability Check

  //#region Quantity Increase
  /**
   * Increases the quantity of an item in the order.
   */
  increaseQuantity() {
    if (!this.selectedProduct?.id || !this.selectedProduct?.qtyType?.id) return;

    const item = this.puchaseOrderService.order.itemsSelled.find(
      item => item.productId === this.selectedProduct?.id
    );

    if (item) {
      const availableQty = this.puchaseOrderService.checkProductAvible(item.product!);
      const newQty = item.qty + 1;

      if (availableQty >= newQty) {
        // Safe to increase
        this.puchaseOrderService.order.itemsSelled = this.puchaseOrderService.order.itemsSelled.map(
          i => (i.productId === item.productId && i.qtyTypeId === item.qtyTypeId ? { ...i, qty: newQty } : i)
        );
      } else {
        this.showToast('Not enough stock', 'error');
        // Cap to max available
        this.puchaseOrderService.order.itemsSelled = this.puchaseOrderService.order.itemsSelled.map(
          i => (i.productId === item.productId && i.qtyTypeId === item.qtyTypeId ? { ...i, qty: availableQty } : i)
        );
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: `Only ${availableQty} available for ${item.product?.name}`
        });
      }
      this.changeDetectorRef.markForCheck();
    }
  }
  //#endregion Quantity Increase

  downloadExe() {
    const currentUser = this.loginService.currentUser();

    if (!currentUser) {
      this.showToast('User not logged in', 'error');
      return;
    }

    const fileName = `${currentUser.shopId}.exe`;
    const downloadUrl = `https://pos-kesara.nimbuscode.online/${fileName}`;

    this.showToast(`Downloading for ${currentUser.name}`, 'success');

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName); // Optional: sets the name of the downloaded file
    link.style.display = 'none'; // Prevents flicker
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
