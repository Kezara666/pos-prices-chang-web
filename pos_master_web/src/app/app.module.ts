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
@NgModule({
  declarations: [
    AddItemComponent
  ],
  imports: [
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
  ],
  providers: [MessageService,ConfirmationService,],
})
export class AppModule { }