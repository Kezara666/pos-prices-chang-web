import { Component, OnInit, ViewChild } from '@angular/core';
import { SupplierService } from './supplier.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import { ISupplierDto } from '../../../models/supplier/supplier.dto';
import { CreateSupplierDto } from '../../../models/supplier/create-supplier.dto';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
  providers: [MessageService],
})
export class SupplierComponent implements OnInit {

  //#region Properties
  suppliers: ISupplierDto[] = [];
  displayModal: boolean = false;
  @ViewChild('dt') dt: Table | undefined;

  // For add/edit modal
  currentSupplier: ISupplierDto = {
    id: 0,
    name: '',
    createdAt: undefined,
    updatedAt: undefined,
    shopId: 0,
    createdById: 0
  };

  selectedSupplierFromTable: ISupplierDto = {
    id: 0,
    name: '',
    createdAt: undefined,
    updatedAt: undefined,
    shopId: 0,
    createdById: 0
  };

  isEditMode: boolean = false;
  visible: boolean = false;
  //#endregion

  //#region Constructor
  constructor(
    private supplierService: SupplierService,
    private messageService: MessageService,
    private loginService: LoginService
  ) { }
  //#endregion

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.loadSuppliers();
  }
  //#endregion

  //#region Data Loading
  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe((response: ISupplierDto[]) => {
      this.suppliers = response;
      console.log('Suppliers loaded:', this.suppliers);
    });
  }
  //#endregion

  //#region Edit Supplier
  editSupplier(supplier: ISupplierDto): void {
    this.currentSupplier = { ...supplier };
    this.isEditMode = true;
    this.displayModal = true;
  }
  //#endregion

  //#region Delete Supplier
  confirmDeleteSupplier(supplier: ISupplierDto): void {
    this.showConfirmDelete(supplier.name ?? '');
    this.selectedSupplierFromTable = {...supplier};
    console.log('Selected Supplier for deletion:', this.selectedSupplierFromTable);
  }

  showConfirmDelete(name: string) {
    if (!this.visible) {
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'error', summary: 'Do you need delete? ' + name });
      this.visible = true;
    }
  }

  onConfirmDelete() {
    this.messageService.clear('confirm');
    this.completeDeleteSupplier();
    this.visible = false;
  }

  completeDeleteSupplier() {
    this.supplierService.deleteSupplier(this.selectedSupplierFromTable.id ?? 9999).subscribe({
      next: () => {        
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier deleted successfully' });
        this.loadSuppliers();
      },
      error: (err: any) => {
        //console.error('Error deleting Supplier:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (err.error || '') + ' Failed to delete Supplier' });
      }
    });
  }

  onRejectDelete() {
    this.messageService.clear('confirm');
    this.visible = false;
  }
  //#endregion

  //#region Add/Edit Modal
  showAddModal(): void {
    this.currentSupplier = {
      id: 0,
      name: '',
      createdAt: undefined,
      updatedAt: undefined,
      shopId: 0,
      createdById: 0
    };
    this.isEditMode = false;
    this.displayModal = true;
  }

  saveSupplier(): void {
    if (!this.currentSupplier.name || this.currentSupplier.name.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter supplier name' });
      return;
    }

    if (this.isEditMode && this.currentSupplier.id && this.currentSupplier.id !== 0) {
      // Update
      this.supplierService.updateSupplier(this.currentSupplier.id, this.currentSupplier).subscribe({
        next: () => {
          this.loadSuppliers();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier updated successfully' });
          this.closeModal();
        },
        error: (err) => {
          //console.error('Error updating supplier:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: (err.error || '') + ' Error updating supplier' });
        }
      });
    } else {
      // Add
      const newSupplier: CreateSupplierDto = { name: this.currentSupplier.name, shopId: this.loginService.shopId, createdById: this.loginService.userId };
      this.supplierService.createSupplier(newSupplier).subscribe({
        next: (addedSupplier: ISupplierDto) => {
          this.suppliers.push(addedSupplier);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier added successfully' });
          this.closeModal();
          this.loadSuppliers();
        },
        error: (err) => {
          //console.error('Error adding supplier:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: (err.error || '') + ' Error adding supplier' });
        }
      });
    }
  }

  closeModal(): void {
    this.displayModal = false;
  }
  //#endregion

  //#region Table Filter
  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  //#endregion

  //#region Export to Excel
  exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.suppliers);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "suppliers");
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer, { type: EXCEL_TYPE }]);
    saveAs(data, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`);
  }
  //#endregion
}