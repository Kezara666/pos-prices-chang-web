
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { QtyTypesService } from './qty-types.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";
import { QtyType, CreateQtyTypeDto } from '../../../models/qty-type/qty-type';
import { LoginService } from '../../login/login.service';


@Component({
  selector: 'app-qty-types',
  templateUrl: './qty-types.component.html',
  styleUrls: ['./qty-types.component.scss'],
  providers: [MessageService],
})
export class QtyTypesComponent implements OnInit {
  qtyTypes: QtyType[] = [];
  displayModal: boolean = false;
  @ViewChild('dt') dt: Table | undefined;

  // For add/edit modal
  currentQtyType: QtyType = {
    id: 0,
    name: '',
    primaryWeightTo: 0,
    mainQtyId: 0,
    shopId: 0,
    createdById: 0,
    updatedById: 0
  };
  selectedQtyTypeFromTable: QtyType = {
    id: 0,
    name: '',
    primaryWeightTo: 0,
    mainQtyId: 0,
    shopId: 0,
    createdById: 0,
    updatedById: 0
    
  };

  isEditMode: boolean = false;
  visible: boolean = false;

  // For majorWeight dropdown (assuming you have a list of weights)
  items: any[] = [];

  constructor(
    private qtyTypesService: QtyTypesService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private loginService:LoginService
  ) { }

  ngOnInit(): void {
    this.loadQtyTypes();
    this.loadMajorWeights();
  }

  loadQtyTypes() {
    this.qtyTypesService.getQtyTypes().subscribe((response: QtyType[]) => {
      console.log('Editing quantity type:', response),
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
      this.cdr.detectChanges();
    });
  }

  loadMajorWeights() {
    // Replace with your actual service call if needed
    // Example: this.qtyTypesService.getMajorWeights().subscribe(items => this.items = items);
    this.items = [
      { id: 1, name: 'Kilogram' },
      { id: 2, name: 'Gram' },
      { id: 3, name: 'Pound' }
    ];
  }

  editQtyType(qtyType: QtyType): void {

    this.currentQtyType = {
      ...qtyType,
      mainQtyId: qtyType.mainQtyId ?? qtyType.mainQty?.id ?? 0, // Ensure mainQtyId is set, // handles both object or number
      updatedById:this.loginService.userId
    };
    this.isEditMode = true;
    this.displayModal = true;
    console.log('Editing quantity type:', this.currentQtyType);
  }

  confirmDeleteQtyType(qtyType: QtyType): void {
    this.showConfirmDelete(qtyType.name ?? '');
    this.selectedQtyTypeFromTable = qtyType;
  }

  showConfirmDelete(name: string) {
    if (!this.visible) {
      this.messageService.add({ key: 'confirm', sticky: true, severity: 'error', summary: 'Do you need delete? ' + name });
      this.visible = true;
    }
  }

  onConfirmDelete() {
    this.messageService.clear('confirm');
    this.completeDeleteQtyType(this.selectedQtyTypeFromTable);
    this.visible = false;
  }

  completeDeleteQtyType(selectedQtyTypeFromTable: QtyType) {
    this.qtyTypesService.deleteQtyType(selectedQtyTypeFromTable.id ?? 0).subscribe({
      next: () => {
        this.loadQtyTypes();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quantity Type deleted successfully' });
      },
      error: (err: any) => {
        //console.error('Error deleting Quantity Type:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (err.error || '') + ' Failed to delete Quantity Type' });
      }
    });
  }

  onRejectDelete() {
    this.messageService.clear('confirm');
    this.visible = false;
  }

  showAddModal(): void {
    this.currentQtyType = {
      id: 0,
      name: '',
      primaryWeightTo: 0,
      mainQtyId: 0,
      shopId: this.loginService.shopId,
      createdById: this.loginService.userId,
      updatedById: this.loginService.userId
    };
    this.isEditMode = false;
    this.displayModal = true;
  }

  saveQtyType(): void {
    if (!this.currentQtyType.name || this.currentQtyType.name.trim() === '') {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter quantity type name' });
      return;
    }

    if (this.isEditMode && this.currentQtyType.id && this.currentQtyType.id !== 0) {
      // Update
      this.qtyTypesService.updateQtyType(this.currentQtyType.id, this.currentQtyType).subscribe({
        next: () => {
          this.loadQtyTypes();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quantity Type updated successfully' });
          this.closeModal();
        },
        error: (err) => {
          //console.error('Error updating quantity type:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: (err.error || '') + ' Error updating quantity type' });
        }
      });
    } else {
      // Add
      const newQtyType: CreateQtyTypeDto = {
        name: this.currentQtyType.name,
        primaryWeightTo: this.currentQtyType.primaryWeightTo,
        mainQtyId: this.currentQtyType.mainQtyId,
        createdById: this.loginService.userId,
        updatedById: this.loginService.userId,
        shopId: this.loginService.shopId,
      };
      this.qtyTypesService.createQtyType(newQtyType).subscribe({
        next: (addedQtyType: QtyType) => {
          this.qtyTypes.push(addedQtyType);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quantity Type added successfully' });
          this.closeModal();
          this.loadQtyTypes();
        },
        error: (err) => {
          //console.error('Error adding quantity type:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: (err.error || '') + ' Error adding quantity type' });
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
    const worksheet = XLSX.utils.json_to_sheet(this.qtyTypes);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "qty_types");
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`);
  }

  getMajorWeightName(qtyType: QtyType): string {
  const found = this.qtyTypes.find(item => item.id === qtyType.mainQtyId);
  return found ? found.name : '';
}

}
