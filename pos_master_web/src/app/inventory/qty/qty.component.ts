import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { QtyTypesService } from '../qty-types/qty-types.service';
import { QtyService } from './qty.service';
import { Product } from '../product/product.model';
import { Qty } from '../../../models/qty/qty.dto';
import { QtyType } from '../../../models/qty-type/qty-type';
import { CreateQtyDto } from '../../../models/create-qty.dto';


@Component({
    selector: 'app-qty',
    templateUrl: './qty.component.html',
    styleUrl: './qty.component.scss',
})
export class QtyComponent implements OnInit {

    productList: Product[] = [];
    qtyType: QtyType[] = [];
    quantities: Qty[] = [];
    selectedProduct?: Product;
    selectedQtyType?: QtyType;
    quantity = 0;

    // Modal and form state
    displayModal = false;
    isEditMode = false;
    currentQuantity: Qty = {
        id: 0,
        productId: 0,
        qtyTypeId: 0,
        qty: 0,
    };

    // For deletion
    quantityToDelete?: Qty;

    constructor(
        private productService: ProductService,
        private qtyTypesService: QtyTypesService,
        private qtyService: QtyService,
        // private messageService: MessageService // Uncomment if using PrimeNG messages
    ) { }

    ngOnInit(): void {
        this.loadAllEntiy()
    }

    loadAllEntiy() {
        this.loadProducts();
        this.loadQtyTypes();
        this.loadQuantities();
    }

    loadProducts() {
        this.productService.getProducts().subscribe({
            next: (data) => (this.productList = data),
            error: () => this.showToast('Failed to load products', 'error')
        });
    }

    loadQtyTypes() {
        this.qtyTypesService.getQtyTypes().subscribe({
            next: (data) => (this.qtyType = data),
            error: () => this.showToast('Failed to load quantity types', 'error')
        });
    }

    loadQuantities() {
        this.qtyService.getAllQuantities().subscribe({
            next: (data) => {
                console.log(data);
                (this.quantities = data)
            },
            error: () => this.showToast('Failed to load quantities', 'error')
        });
    }

    // Modal management
    showAddModal() {
        this.isEditMode = false;
        this.currentQuantity = {
            id: 0,
            productId: 0,
            qtyTypeId: 0,
            qty: 0,
        };
        this.displayModal = true;
    }

    editQuantity(qty: any) {
        this.isEditMode = true;

        this.currentQuantity = {
            ...qty,
            productId: qty.product?.id ?? qty.productId, // From nested object
            qtyTypeId: qty.qtyType?.id ?? qty.qtyTypeId, // From nested object
        };

        console.log('Editing quantity:', this.currentQuantity);
        this.displayModal = true;
    }




    saveQuantity() {
        if (this.isEditMode) {
            // Update existing quantity
            this.qtyService.updateQuantity(this.currentQuantity.id, this.currentQuantity).subscribe({
                next: (updated) => {
                    this.loadAllEntiy()
                },
                error: () => this.showToast('Failed to update quantity', 'error')
            });
        } else {
            // Add new quantity
            this.qtyService.createQuantity(this.currentQuantity as CreateQtyDto).subscribe({
                next: (created) => {
                    this.loadAllEntiy()
                },
                error: () => this.showToast('Failed to add quantity', 'error')
            });
        }
    }

    // Delete logic
    confirmDeleteQuantity(qty: Qty) {
        this.quantityToDelete = qty;
        // this.messageService.add({ key: 'confirm', sticky: true, summary: 'Are you sure you want to delete this quantity?' });
    }

    onConfirmDelete() {
        if (!this.quantityToDelete) return;
        this.qtyService.deleteQuantity(this.quantityToDelete.id).subscribe({
            next: () => {
                this.quantities = this.quantities.filter(q => q.id !== this.quantityToDelete!.id);
                this.showToast('Quantity deleted successfully', 'success');
                this.quantityToDelete = undefined;
            },
            error: () => this.showToast('Failed to delete quantity', 'error')
        });
        // this.messageService.clear('confirm');
    }

    onRejectDelete() {
        this.quantityToDelete = undefined;
        // this.messageService.clear('confirm');
    }

    showToast(message: string, severity: 'success' | 'error') {
        // Uncomment and implement if using PrimeNG Toast
        // this.messageService.add({ severity, summary: message, life: 3000 });
        console.log(`[${severity}] ${message}`);
    }

    getQtyTypeName(qtyTypeId: number | undefined): string {
        if (!qtyTypeId) return 'N/A';
        const type = this.qtyType.find(qt => qt.id === qtyTypeId);
        return type ? type.name : 'Unknown';
    }
}