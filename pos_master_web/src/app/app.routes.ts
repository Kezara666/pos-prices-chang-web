import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QtyTypesComponent } from "./inventory/qty-types/qty-types.component";
import { QtyComponent } from "./inventory/qty/qty.component";
import { SupplierComponent } from "./inventory/supplier/supplier.component";
import { ProductPriceComponent } from "./inventory/product-price/product-price.component";
import { ProductComponent } from "./inventory/product/product.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AppLayout } from "./dashboard/layout/component/app.layout";
import { PurchaseOrderComponent } from "./sale-management/purchase-order/purchase-order.component";
import { OldPurchaseOrdersComponent } from "./sale-management/old-purchase-orders/old-purchase-orders.component";
import { StatManagementComponent } from "./stat-management/stat-management/stat-management.component";
import { LoginComponent } from "./login/login.component";


export const routes: Routes = [
  {
    path: 'dashboard',
    component: AppLayout,
    // canActivate: [AuthGuard], // Protect all dashboard routes
    children: [
      { path: '', component: DashboardComponent }, // /dashboard
      { path: 'add-item', component: ProductComponent }, // /dashboard/add-item
      { path: 'prices', component: ProductPriceComponent }, // /dashboard/prices
      { path: 'supplier', component: SupplierComponent }, // /dashboard/supplier
      { path: 'qty', component: QtyComponent }, // /dashboard/qty
      { path: 'qty-type', component: QtyTypesComponent }, // /dashboard/qty-type
      { path: 'purchase-order', component: PurchaseOrderComponent },
      { path: 'old-purchase-order', component: OldPurchaseOrdersComponent },
      { path: 'stat', component: StatManagementComponent }, // /dashboard/logout
    ],
  },
  // { path: 'auth', component: LoginComponent }, // /auth for login
  { path: 'login', component: LoginComponent }, // /logout for logout
  { path: 'add-item', redirectTo: 'auth', pathMatch: 'full' }, // Redirect /add-item to /auth
  { path: '', redirectTo: 'auth', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: 'auth', pathMatch: 'full' }, // Wildcard route
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
