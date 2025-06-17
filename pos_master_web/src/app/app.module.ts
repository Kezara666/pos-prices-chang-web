import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { Button, ButtonModule } from "primeng/button";
import { Toast } from "primeng/toast";
import { IftaLabelModule } from 'primeng/iftalabel';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FloatLabel } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { QtyTypesComponent } from './inventory/qty-types/qty-types.component';
import { QtyComponent } from './inventory/qty/qty.component';
import { Select } from 'primeng/select';
import { SupplierComponent } from './inventory/supplier/supplier.component';
import { ProductPriceComponent } from './inventory/product-price/product-price.component';
import { ProductComponent } from './inventory/product/product.component';
import { AppTopbar } from './dashboard/layout/component/app.topbar';
import { AppSidebar } from './dashboard/layout/component/app.sidebar';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AppConfigurator } from './dashboard/layout/component/app.configurator';
import { AppMenu } from './dashboard/layout/component/app.menu';
import { AppMenuitem } from './dashboard/layout/component/app.menuitem';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppLayout } from './dashboard/layout/component/app.layout';
import { AppFooter } from './dashboard/layout/component/app.footer';
import { LayoutService } from './dashboard/layout/service/layout.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PurchaseOrderComponent } from './sale-management/purchase-order/purchase-order.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { InvoiceComponent } from './sale-management/invoice/invoice.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  declarations: [
    QtyTypesComponent,
    QtyComponent,
    SupplierComponent,
    ProductPriceComponent,
    ProductComponent,
    AppTopbar,
    AppSidebar,
    AppConfigurator,
    AppMenu,
    AppMenuitem,
    AppTopbar,
    AppSidebar,
    AppMenu,
    DashboardComponent,
    AppLayout,
    AppFooter,
    PurchaseOrderComponent,
    InvoiceComponent
  ],
  imports:[
    Select,
    QRCodeModule,
    NgxBarcode6Module,
    ConfirmDialogModule,
    CommonModule, RouterModule, RippleModule,
    SelectButtonModule,
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
    SelectButtonModule, // Add this line
    ButtonModule,
     ZXingScannerModule
// Add this line


  ],
  providers: [MessageService, ConfirmationService,LayoutService,],
})
export class AppModule { }