import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductPriceService } from './product-price.service';
import { ProductPrice, } from '../../../models/product-price/product-price.model';
import { MessageService } from 'primeng/api';
import { Product } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-product-price',
    templateUrl: './product-price.component.html',
    styleUrls: ['./product-price.component.scss',],
    providers: [MessageService]
})
export class ProductPriceComponent implements OnInit {

    //#region Properties
    productPrices: ProductPrice[] = [];
    products: Product[] = []; // For product selection
    displayModal = false;
    isEditMode = false;
    currentProductPrice: any = {};
    deleteId: number | null = null;
    @ViewChild('dt') dt: Table | undefined;
    //#endregion

    //#region Constructor
    constructor(
        private productPriceService: ProductPriceService,
        private messageService: MessageService,
        private productService: ProductService
    ) { }
    //#endregion

    //#region Lifecycle Hooks
    ngOnInit(): void {
        this.loadProductPrices();
        this.loadProducts();
    }
    //#endregion

    //#region Data Loading
    loadProductPrices() {
        this.productPriceService.getAll().subscribe({
            next: (data) => this.productPrices = data,
            error: () => this.messageService.add({ severity: 'error', summary: 'Failed to load product prices' })
        });
    }

    loadProducts() {
        this.productService.getProducts().subscribe({
            next: (data) => (this.products = data),
            error: (e) => this.messageService.add({ severity: 'error', summary: 'fetch failed' + e.toString() })
        });
    }
    //#endregion

    //#region Add/Edit Modal
    showAddModal() {
        this.isEditMode = false;
        this.currentProductPrice = {};
        this.displayModal = true;
    }

    editProductPrice(pp: ProductPrice) {
        this.isEditMode = true;
        this.currentProductPrice = {
            ...pp,
            productId: pp.product?.id
        };
        this.displayModal = true;
        //console.log('Editing product price:', this.currentProductPrice);
    }
    //#endregion

    //#region Save Product Price
    saveProductPrice() {
        if (this.isEditMode) {
            this.productPriceService.update(this.currentProductPrice.id, {
                ...this.currentProductPrice,
                productId: this.currentProductPrice.productId
            }).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Product price updated' });
                    this.displayModal = false;
                    this.loadProductPrices();
                    this.updateProductPrimaryPrice(this.currentProductPrice.productId, this.currentProductPrice.id)
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Update failed' })
            });
        } else {
            this.productPriceService.create({
                ...this.currentProductPrice,
                productId: this.currentProductPrice.productId
            }).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Product price added' });
                    this.displayModal = false;
                    this.loadProductPrices();
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Create failed' })
            });
        }
    }
    //#endregion

    //#region Update Product Primary Price
    updateProductPrimaryPrice(productId: number, primaryPriceId: number) {
        this.productService.setProductCurrentPrice(productId, primaryPriceId).subscribe({
            next: () => console.log('Product price updated'),
            error: (err) => console.error('Failed to update price:', err),
        });
    }
    //#endregion

    //#region Delete Product Price
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
                    this.messageService.add({ severity: 'success', summary: 'Deleted' });
                    this.loadProductPrices();
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Delete failed' })
            });
            this.deleteId = null;
            this.messageService.clear('confirm');
        }
    }

    onRejectDelete() {
        this.deleteId = null;
        this.messageService.clear('confirm');
    }
    //#endregion

    //#region Modal Management
    closeModal() {
        this.displayModal = false;
    }
    //#endregion

    //#region Table Filtering
    applyFilterGlobal($event: any, stringVal: string) {
        this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }
    //#endregion

    //#region Export to Excel
    exportExcel() {
        // Implement export logic as needed
    }
    //#endregion
}