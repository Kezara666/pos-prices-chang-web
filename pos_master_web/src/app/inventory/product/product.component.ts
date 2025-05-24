import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { QtyType } from '../../../models/qty-type/qty-type';
import { QtyTypesService } from '../qty-types/qty-types.service';
import { SupplierService } from '../supplier/supplier.service';
import { ISupplierDto } from '../../../models/supplier/supplier.dto';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [MessageService]
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  qtyTypes: QtyType[] = [];
   suppliers: ISupplierDto[] = [];
  displayModal = false;
  isEditMode = false;
  currentProduct: Product = this.getEmptyProduct();
  deleteId: number | null = null;
  @ViewChild('dt') dt: Table | undefined;
  visible: boolean = false;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private qtyTypesService: QtyTypesService,
    private supplierService: SupplierService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadQtyTypes();
    this.loadSuppliers();
  }

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

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: () => this.showToast('Failed to load products', 'error')
    });
  }

  showAddModal() {
    this.isEditMode = false;
    this.currentProduct = this.getEmptyProduct();
    this.displayModal = true;
  }

  editProduct(product: Product) {
    this.isEditMode = true;
    this.currentProduct = { ...product };
    this.displayModal = true;
  }

  closeModal() {
    this.displayModal = false;
  }

  saveProduct() {
    if (this.isEditMode && this.currentProduct.id) {
      this.productService.updateProduct(this.currentProduct.id, this.currentProduct).subscribe({
        next: () => {
          this.showToast('Product updated successfully', 'success');
          this.displayModal = false;
          this.loadProducts();
        },
        error: () => this.showToast('Failed to update product', 'error')
      });
    } else {
      this.productService.addProduct(this.currentProduct).subscribe({
        next: () => {
          this.showToast('Product added successfully', 'success');
          this.displayModal = false;
          this.loadProducts();
        },
        error: () => this.showToast('Failed to add product', 'error')
      });
    }
  }

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

  showToast(message: string, severity: 'success' | 'error') {
    this.messageService.add({ severity, summary: message, life: 3000 });
  }

  getEmptyProduct(): Product {
    return {
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
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  onRejectDelete() {
    this.messageService.clear('confirm');
    this.visible = false;
  }


}