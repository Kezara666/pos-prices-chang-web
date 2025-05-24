import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { Button } from "primeng/button";
import { Toast } from "primeng/toast";
import { IftaLabelModule } from 'primeng/iftalabel';
import { AddItemComponent } from "./inventory/add-item/add-item.component";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FloatLabel } from 'primeng/floatlabel';
import {AutoCompleteModule } from 'primeng/autocomplete';
import { QtyTypesComponent } from './inventory/qty-types/qty-types.component';
import { QtyComponent } from './inventory/qty/qty.component';
import { Select } from 'primeng/select';
import { SupplierComponent } from './inventory/supplier/supplier.component';
import { ProductPriceComponent } from './inventory/product-price/product-price.component';
import { ProductComponent } from './inventory/product/product.component';
@NgModule({
  declarations: [
    AddItemComponent,
    QtyTypesComponent,
    QtyComponent,
    SupplierComponent,
    ProductPriceComponent,
    ProductComponent
  ],
  imports: [
    Select,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CommonModule,
    Dialog,
    Button,
    Toast,
    DropdownModule,
    ToggleButtonModule,
    InputTextModule,
    AvatarModule,
    AvatarGroupModule,
    InputNumberModule,
    DatePickerModule,
    FloatLabel,
    AutoCompleteModule,
    IftaLabelModule,
    AutoCompleteModule,

  ],
  providers: [MessageService,ConfirmationService,],
})
export class AppModule { }