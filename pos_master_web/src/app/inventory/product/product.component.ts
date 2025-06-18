import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { QtyTypesService } from '../qty-types/qty-types.service';
import { SupplierService } from '../supplier/supplier.service';
import { ISupplierDto } from '../../../models/supplier/supplier.dto';
import { ProductPrice } from '../../../models/product-price/product-price.model';
import { ProductPriceService } from '../product-price/product-price.service';
import { QtyService } from '../qty/qty.service';
import { CreateQtyDto } from '../../../models/create-qty.dto';
import { QtyType } from '../../../models/qty-type/qty-type';
import { SelectChangeEvent } from 'primeng/select';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [MessageService]
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  qtyTypes: QtyType[] = [];
  productPrices: ProductPrice[] = [];
  productRelatedPrices: ProductPrice[] = [];
  suppliers: ISupplierDto[] = [];
  displayModal = false;
  isEditMode = false;
  currentProduct: Product = this.getEmptyProduct();
  deleteId: number | null = null;
  @ViewChild('dt') dt: Table | undefined;
  visible: boolean = false;
  quantity: number = 0;
  qrAndBarcodeVisible: boolean = false;
  @ViewChild('barcode') barcodeElement!: ElementRef;
  @ViewChild('qrcode') qrCodeElement!: ElementRef;
  showDialogQRAndBarCode() {
    this.qrAndBarcodeVisible = true;
  }
  currentProductPrice: ProductPrice = {
    id: 0,
    wholeSalePrice: 0,
    broughtPrice: 0,
    primarySalePrice: 0,
    product: this.currentProduct as Product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private qtyTypesService: QtyTypesService,
    private supplierService: SupplierService,
    private productPriceService: ProductPriceService,
    private qtyService: QtyService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadQtyTypes();
    this.loadSuppliers();
    this.loadProductsPrices();
  }

  //#region Load Product Price
  loadProductsPrices() {
    this.productPriceService.getAll().subscribe({
      next: (data) => {
        this.productPrices = data;
      },
      error: () => this.showToast('Failed to load product prices', 'error')
    });
  }

  //#region Filter Prices only for Selected Product
  filterPricessByProductId(productId: number) {
    if (!productId) {
      this.productRelatedPrices = [];
      return;
    }
    this.productRelatedPrices = this.productPrices.filter(price => price.product.id === productId);
    console.log('Filtered Prices:', this.productRelatedPrices);
  }

  //#region Change Product Price Dropdown
  changeCurrentPrice(event: SelectChangeEvent) {
    console.log('Selected Price:', event.value);
    this.currentProduct.currentPrice = this.productPrices.find(price => price.id === event.value)?.primarySalePrice || 0;
  }

  //#region Load QtyTypes
  loadQtyTypes() {
    this.qtyTypesService.getQtyTypes().subscribe((response: QtyType[]) => {
      this.qtyTypes = response.map((item: QtyType) => ({
        id: item.id,
        name: item.name,
        primaryWeightTo: item.primaryWeightTo,
        mainQtyId: item.mainQtyId,
      }));
    });
  }

  //#region load Suppliers
  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe((response: ISupplierDto[]) => {
      this.suppliers = response.map((item: ISupplierDto) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    });
  }

  //#region Load Product
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: () => this.showToast('Failed to load products', 'error')
    });
  }

  //#region Show Add Modal
  showAddModal() {
    this.isEditMode = false;
    this.currentProduct = this.getEmptyProduct();
    this.displayModal = true;
  }

  //#region Edit Product
  editProduct(product: Product) {
    this.isEditMode = true;
    this.currentProduct = {
      ...product
      ,
      supplierId: product.supplier?.id || 0, // Handle optional supplier
      qtyTypeId: product.qtyType?.id || 0,
      productPriceId: product.productPriceId || 0 // Handle optional product price
    };
    this.filterPricessByProductId(this.currentProduct.id!);
    this.displayModal = true;
    console.log('Editing product:', this.currentProduct);
  }

  //#region Close Modal
  closeModal() {
    this.displayModal = false;
  }

  //#region ValidateSaveProduct
  validateSaveProduct(): boolean {
    //add whole retail price validations
    const missingFields: string[] = [];
    if (!this.currentProduct.name) missingFields.push('Name');
    if (!this.currentProduct.category) missingFields.push('Category');
    if (!this.currentProduct.supplierId) missingFields.push('Supplier');
    if (!this.currentProduct.qtyTypeId) missingFields.push('Quantity Type');
    if (missingFields.length > 0) {
      const message = `Please fill the following fields: ${missingFields.join(', ')}`;
      this.showToast(message, 'error', 10000);
      return false;
    }
    else {
      return true
    }
  }

  //#region EditProduct API
  editProductAPICall(product: Product) {
    this.productService.updateProduct(product.id.toString(), product).subscribe({
      next: () => {
        this.loadProducts();
        this.showToast('Product updated successfully', 'success');
      },
      error: (e) => {
        this.showToast('Failed to update product', 'error')
        console.error('Error updating product:', e);
      }
    });
  }

  AddProductAPICAll(newProduct: Product) {
    this.productService.addProduct(newProduct).subscribe({
      next: (product: Product) => {
        this.showToast('Product added successfully', 'success');
        this.currentProduct = product;
        //#region call save Product Price
        this.saveProductPrice({
          ...this.currentProductPrice,
          product: product
        });

        this.loadProducts();
        this.displayModal = false;
      },
      error: () => this.showToast('Failed to add product', 'error')
    });
  }

  //#region Save Prouduct
  saveProduct() {
    //validations
    if (this.validateSaveProduct()) {
      if (this.isEditMode && this.currentProduct.id) {
        this.editProduct(this.currentProduct);
      } else {
        this.AddProductAPICAll(this.currentProduct);
      }
    }
  }

  //#region Save Qty
  saveQty(qty: CreateQtyDto) {
    if (this.currentProduct.id) {
      this.qtyService.createQuantity({
        productId: qty.productId, // ID of the associated product
        qtyTypeId: qty.qtyTypeId, // ID of the associated QtyType
        qty: qty.qty
      }).subscribe({
        next: () => {
          this.showToast('Quantity saved successfully', 'success');
          this.quantity = 0; // Reset quantity after saving
          this.emptyProductPrice()
        },
        error: () => this.showToast('Failed to save quantity', 'error')
      });
    } else {
      this.showToast('Please select a product first', 'error');
    }
  }

  //#region SAVE PRODUCT PRICE
  private saveProductPrice(productPrice: ProductPrice) {
    //if(product)
    this.productPriceService.create(productPrice).subscribe({
      next: (productPrice: ProductPrice) => {
        this.showToast('Product price added successfully' + productPrice.product.name, 'success');
        productPrice.product.productPriceId = productPrice.id;
        productPrice.product.currentPrice = productPrice.primarySalePrice;
        this.editProductAPICall(productPrice.product);
        // this.emptyProductPrice();
        this.saveQty({
          productId: productPrice.product.id!,
          qtyTypeId: productPrice.product.qtyType?.id!,
          qty: this.quantity
        })

      },
      error: () => this.showToast('Failed to add product price', 'error')
    });
  }

  //#region EMPTY PRODUCT PRICE
  emptyProductPrice() {
    this.currentProductPrice = {
      id: 0,
      wholeSalePrice: 0,
      broughtPrice: 0,
      primarySalePrice: 0,
      product: this.currentProduct as Product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  //#region Delete Product Confirm Dialog
  confirmDeleteProduct(product: Product) {
    this.deleteId = product.id!;
    this.messageService.clear('confirm');
    this.messageService.add({
      key: 'confirm',
      sticky: true,
      severity: 'warn',
      summary: `Are you sure you want to delete product "${product.name}"?`
    });
  }

  onConfirmDelete() {
    if (this.deleteId) {
      this.productService.deleteProduct(this.deleteId).subscribe({
        next: () => {
          this.showToast('Product deleted', 'success');
          this.loadProducts();
        },
        error: () => this.showToast('Failed to delete product', 'error')
      });
      this.deleteId = null;
      this.messageService.clear('confirm');
    }
  }


  onRejectDelete() {
    this.messageService.clear('confirm');
    this.visible = false;
  }

  showToast(message: string, severity: 'success' | 'error', life?: number) {
    this.messageService.add({ severity, summary: message, life: life ?? 3000 });
  }

  //#region Get Empty Product
  getEmptyProduct(): Product {
    return {
      id: 0,
      name: '',
      description: '',
      barCode: '',
      qrCode: '',
      category: '',
      subcategory: '',
      currentPrice: 0,
      warranty: 0,
      supplierId: 0,
      qtyTypeId: 0
    };
  }
  //#region Table Filters
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  isBarcodeTaken: boolean = false;

  //#region Check BarCode Unquieness
  checkBarcodeUniqueness(event: Event) {

    const exists = this.products.some(p =>
      p.barCode === this.currentProduct.barCode && p.id !== this.currentProduct.id
    );
    this.isBarcodeTaken = exists;
    this.showToast(
      exists ? 'Barcode already exists' : 'Barcode is unique',
      exists ? 'error' : 'success'
    );
    if (exists) {
      (event.target as HTMLInputElement).value = ''; // Clear the input if barcode is taken
    }
  }

  //#region Dowenload Barcode
  downloadBarcode() {
    const svg = this.barcodeElement.nativeElement.querySelector('svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    this.triggerDownload(url, `${this.currentProduct.name}.barcode.svg`);

  }

  // QRCode download
  downloadQRCode() {
    const canvas = this.qrCodeElement.nativeElement.querySelector('canvas');
    if (!canvas) return;

    canvas.toBlob((blob: Blob | MediaSource) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      this.triggerDownload(url, `${this.currentProduct.name}.qrcode.svg`);
    });
  }

  private triggerDownload(url: string, filename: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }


}