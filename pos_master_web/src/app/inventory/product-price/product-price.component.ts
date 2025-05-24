import { Component, OnInit } from '@angular/core';
import { ProductPriceService } from './product-price.service';
import { ProductPrice, Product } from '../../../models/product-price/product-price.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-price',
  templateUrl: './product-price.component.html',
  styleUrls: ['./product-price.component.scss'],
  providers: [MessageService]
})
export class ProductPriceComponent implements OnInit {
  productPrices: ProductPrice[] = [];
  products: Product[] = []; // For product selection
  displayModal = false;
  isEditMode = false;
  currentProductPrice: any = {};
  deleteId: number | null = null;

  constructor(
    private productPriceService: ProductPriceService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProductPrices();
    this.loadProducts();
  }

  loadProductPrices() {
    this.productPriceService.getAll().subscribe({
      next: (data) => this.productPrices = data,
      error: () => this.messageService.add({severity:'error', summary:'Failed to load product prices'})
    });
  }

  loadProducts() {
    // TODO: Replace with actual ProductService call
    // this.productService.getAll().subscribe(data => this.products = data);
    // For now, mock:
    this.products = [
      { id: 1, name: 'Product A' },
      { id: 2, name: 'Product B' }
    ];
  }

  showAddModal() {
    this.isEditMode = false;
    this.currentProductPrice = {};
    this.displayModal = true;
  }

  editProductPrice(pp: ProductPrice) {
    this.isEditMode = true;
    this.currentProductPrice = { ...pp, productId: pp.product.id };
    this.displayModal = true;
  }

  saveProductPrice() {
    if (this.isEditMode) {
      this.productPriceService.update(this.currentProductPrice.id, {
        ...this.currentProductPrice,
        productId: this.currentProductPrice.productId
      }).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Product price updated'});
          this.displayModal = false;
          this.loadProductPrices();
        },
        error: () => this.messageService.add({severity:'error', summary:'Update failed'})
      });
    } else {
      this.productPriceService.create({
        ...this.currentProductPrice,
        productId: this.currentProductPrice.productId
      }).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Product price added'});
          this.displayModal = false;
          this.loadProductPrices();
        },
        error: () => this.messageService.add({severity:'error', summary:'Create failed'})
      });
    }
  }

  confirmDeleteProductPrice(pp: ProductPrice) {
    this.deleteId = pp.id;
    this.messageService.clear('confirm');
    this.messageService.add({
      key: 'confirm',
      severity: 'warn',
      summary: 'Are you sure you want to delete?',
      detail: '',
      sticky: true
    });
  }

  onConfirmDelete() {
    if (this.deleteId !== null) {
      this.productPriceService.delete(this.deleteId).subscribe({
        next: () => {
          this.messageService.add({severity:'success', summary:'Deleted'});
          this.loadProductPrices();
        },
        error: () => this.messageService.add({severity:'error', summary:'Delete failed'})
      });
      this.deleteId = null;
      this.messageService.clear('confirm');
    }
  }

  onRejectDelete() {
    this.deleteId = null;
    this.messageService.clear('confirm');
  }

  closeModal() {
    this.displayModal = false;
  }

  // Filtering for table
  applyFilterGlobal($event: any, stringVal: string) {
    // Implement as needed for your table/filtering library
  }

  exportExcel() {
    // Implement export logic as needed
  }
}