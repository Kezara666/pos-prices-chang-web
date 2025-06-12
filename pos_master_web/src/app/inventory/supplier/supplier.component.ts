
import { Component, OnInit, ViewChild } from '@angular/core';
import { SupplierService } from './supplier.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import { ISupplierDto } from '../../../models/supplier/supplier.dto';
import { CreateSupplierDto } from '../../../models/supplier/create-supplier.dto';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
  providers: [MessageService],
})
export class SupplierComponent implements OnInit {
  suppliers: ISupplierDto[] = [];
  displayModal: boolean = false;
  @ViewChild('dt') dt: Table | undefined;

  // For add/edit modal
  currentSupplier: ISupplierDto = {
    id: 0,
    name: '',
    createdAt: undefined,
    updatedAt: undefined
  };
  selectedSupplierFromTable: ISupplierDto = {
    id: 0,
    name: '',
    createdAt: undefined,
    updatedAt: undefined
  };

  isEditMode: boolean = false;
  visible: boolean = false;

  constructor(
    private supplierService: SupplierService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
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

  editSupplier(supplier: ISupplierDto): void {
    this.currentSupplier = { ...supplier };
    this.isEditMode = true;
    this.displayModal = true;
  }

  confirmDeleteSupplier(supplier: ISupplierDto): void {
    this.showConfirmDelete(supplier.name ?? '');
    this.selectedSupplierFromTable = supplier;
  }

  showConfirmDelete(name: string) {
    if (!this.visible) {
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'error', summary: 'Do you need delete? ' + name });
      this.visible = true;
    }
  }

  onConfirmDelete() {
    this.messageService.clear('confirm');
    this.completeDeleteSupplier(this.selectedSupplierFromTable);
    this.visible = false;
  }

  completeDeleteSupplier(selectedSupplierFromTable: ISupplierDto) {
    this.supplierService.deleteSupplier(selectedSupplierFromTable.id ?? 0).subscribe({
      next: () => {
        this.loadSuppliers();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Supplier deleted successfully' });
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

  showAddModal(): void {
    this.currentSupplier = {
      id: 0,
      name: '',
      createdAt: undefined,
      updatedAt: undefined
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
      const newSupplier: CreateSupplierDto = { name: this.currentSupplier.name };
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

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.suppliers);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "suppliers");
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`);
  }
}
