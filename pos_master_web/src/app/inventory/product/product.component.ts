import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductService } from './product.service';
import { CreateProductWithDependenciesDto, Product } from './product.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { QtyTypesService } from '../qty-types/qty-types.service';
import { SupplierService } from '../supplier/supplier.service';
import { ISupplierDto } from '../../../models/supplier/supplier.dto';
import { ProductPrice } from '../../../models/product-price/product-price.model';
import { ProductPriceService } from '../product-price/product-price.service';
import { QtyService } from '../qty/qty.service';
import { QtyType } from '../../../models/qty-type/qty-type';
import { SelectChangeEvent } from 'primeng/select';
import { LoginService } from '../../login/login.service';
import { IUser } from '../../../models/user/create-user.dto';

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
  categories: string[] = [];
  displayModal = false;
  isEditMode = false;
  currentProduct: Product = this.getEmptyProduct();
  deleteId: number | null = null;
  @ViewChild('dt') dt: Table | undefined;
  visible: boolean = false;
  qrAndBarcodeVisible: boolean = false;
  @ViewChild('barcode') barcodeElement!: ElementRef;
  @ViewChild('qrcode') qrCodeElement!: ElementRef;


  currentProductPrice!: ProductPrice
  user: IUser | null = null;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private qtyTypesService: QtyTypesService,
    private supplierService: SupplierService,
    private productPriceService: ProductPriceService,
    private qtyService: QtyService,
    private cd: ChangeDetectorRef,
    public loginService: LoginService
  ) {
    this.currentProductPrice = {
      id: 0,
      wholeSalePrice: 0,
      broughtPrice: 0,
      primarySalePrice: 0,
      product: this.currentProduct as Product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shopId: loginService.shopId,
      createdById: loginService.userId,
      updatedById: loginService.userId
    };
  }

  ngOnInit(): void {
    this.loadAllEntities()
    this.user = this.loginService.currentUser();
  }

  loadAllEntities() {
    this.loadProducts();
    this.loadQtyTypes();
    this.loadSuppliers();
    this.loadProductsPrices();
  }

  //#region Load Categories
  loadCategories() {
    // Extract unique categories from existing products
    const uniqueCategories = [...new Set(this.products
      .map(product => product.category)
      .filter(category => category && category.trim() !== '')
    )];
    this.categories = uniqueCategories.sort();
  }

  //#region Handle Category Selection from Dropdown
  onCategoryDropdownSelect(selectedCategory: string) {
    this.currentProduct.category = selectedCategory;
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

    // Filter prices by product ID
    this.productRelatedPrices = this.productPrices.filter(
      price => price.product.id === productId || price.product?.id === productId
    );

    console.log('Filtered Prices:', this.productRelatedPrices);

    // Ensure types match before setting value
    const currentPriceId = this.currentProduct.productPriceId;
    // Optional: Auto-select existing productPriceId if it exists in filtered list
    if (currentPriceId && this.productRelatedPrices.some(p => p.id === currentPriceId)) {
      // Force Angular to re-bind value if needed
      this.currentProduct.productPriceId = currentPriceId;
    } else if (this.productRelatedPrices.length > 0) {
      // Optionally select first item as fallback
      this.currentProduct.productPriceId = this.productRelatedPrices[0].id;
    } else {
      this.currentProduct.productPriceId = null!;
    }

    // Trigger change detection manually
    this.cd.markForCheck();
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
        mainQtyId: item.mainQty?.id ?? 0,
        mainQty: item.mainQty,
        shop: item.shop,
        createdById: item.createdById,
        updatedById: item.updatedById,
        updatedBy: item.updatedBy,
        shopId: item.shop?.id ?? 0

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
        updatedAt: item.updatedAt,
        shopId: item.shopId,
        createdById: item.createdById
      }));
    });
  }

  //#region Load Product
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data
        console.log(data)
        this.loadCategories(); // Load categories after products are loaded
        this.showToast(`Products loaded successfully ${this.user?.name}`, 'success',);
      },
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
    this.currentProduct = {
      ...product,
      supplierId: product.supplier?.id || 0, // Handle optional supplier
      qtyTypeId: product.qtyType?.id || 0,
      productPriceId: product.productPriceId || 0 // Handle optional product price
    };
    this.filterPricessByProductId(this.currentProduct.id!);
    //this.cd.markForCheck();
    this.displayModal = true;
    this.isEditMode = true;
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
    if (!this.currentProduct.barCode) missingFields.push('Must Generate BarCode');
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
        this.displayModal = false;
        this.isEditMode = false;
      },
      error: (e) => {
        this.showToast('Failed to update product', 'error')
        console.error('Error updating product:', e);
      }
    });
  }

  AddProductAPICAll() {
    const productDto: CreateProductWithDependenciesDto = {
      name: this.currentProduct.name,
      description: this.currentProduct.description,
      category: this.currentProduct.category,
      subcategory: this.currentProduct.subcategory,
      currentPrice: this.currentProductPrice.primarySalePrice,
      warranty: this.currentProduct.warranty,
      supplierId: this.currentProduct.supplierId,
      qtyTypeId: this.currentProduct.qtyTypeId,
      qty: this.currentProduct.qty,
      shopId: this.loginService.shopId,
      createdById: this.loginService.userId,
      updatedById: this.loginService.userId,
      barCode: this.currentProduct.barCode || '',
      qrCode: this.currentProduct.qrCode || '',
      // Include price data
      productPrice: {
        wholeSalePrice: this.currentProductPrice.wholeSalePrice,
        broughtPrice: this.currentProductPrice.broughtPrice,
        primarySalePrice: this.currentProductPrice.primarySalePrice,
        shopId: this.loginService.shopId,
        createdById: this.loginService.userId,
        updatedById: this.loginService.userId
      },
      // Include quantity data
      qtyData: {
        qty: this.currentProduct.qty,
        qtyTypeId: this.currentProduct.qtyTypeId,
        shopId: this.loginService.shopId,
        createdById: this.loginService.userId,
        updatedById: this.loginService.userId
      }
    };
    this.productService.createProductWithDependencies(productDto).subscribe({
      next: (response) => {
        this.showToast('Product and its dependencies added successfully', 'success');
        this.loadAllEntities()
        this.loadCategories(); // Refresh categories after adding new product
        this.displayModal = false;
        this.emptyProductPrice(); // Reset form state
        this.currentProduct = this.getEmptyProduct(); // Reset product form
      },
      error: (e) => {
        this.showToast('Failed to add product with dependencies', 'error');
        console.error('Error creating product with dependencies:', e);
      }
    });
  }


  //#region Save Prouduct
  saveProduct() {
    //validations
    if (this.validateSaveProduct()) {
      if (this.isEditMode && this.currentProduct.id) {
        this.editProductAPICall(this.currentProduct)
      } else {
        this.currentProduct.createdById = this.loginService.userId
        this.currentProduct.updatedById = this.loginService.userId
        this.currentProduct.shopId = this.loginService.shopId
        this.AddProductAPICAll();
      }
    }
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
      updatedById: this.loginService.userId,
      createdById: this.loginService.userId,
      shopId: this.loginService.shopId
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
    this.messageService.add({ severity, summary: message, life: life ?? 10000 });
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
      qtyTypeId: 0,
      qty: 0,
      shopId: 0,
      createdById: 0,
      updatedById: 0
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

  //#region Gen Barcode
  generateRandomBarCode() {
    if(this.currentProduct.barCode && this.currentProduct.barCode.trim() !== '') {
      this.showToast('Barcode already exists, cannot generate a new one.', 'error');
      return;
    }
    else {
      const randomCode = Math.floor(100000000 + Math.random() * 900000000).toString();
      this.currentProduct.barCode = randomCode;
      this.isBarcodeTaken = false;
    }
  }

  downloadBarcode() {
    const svg = this.barcodeElement.nativeElement.querySelector('svg');
    if (!svg) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Barcode SVG not found' });
      return;
    }

    // Set desired dimensions for thermal printer (e.g., 300px width, 100px height for 80mm printer)
    const targetWidth = 300; // Fits within 80mm (~576px at 203 DPI)
    const targetHeight = 100; // Standard height for scannable barcode

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    // Create image from SVG
    const img = new Image();
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Canvas context not available' });
        return;
      }

      // Draw the image with specified dimensions
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate barcode image' });
          return;
        }
        const cleanName = this.getCleanFileName(this.currentProduct.name);
        this.triggerDownload(URL.createObjectURL(blob), `${cleanName}.barcode.png`);
      }, 'image/png');
    };

    img.src = url;
  }

  private getCleanFileName(name: string): string {
    const justFile = name.split(/[/\\]/).pop() || name;
    return justFile.replace(/\.[^/.]+$/, '');
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

  showDialogQRAndBarCode() {
    this.qrAndBarcodeVisible = true;
  }


}
