import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddItemComponent } from "./inventory/add-item/add-item.component";
import { QtyTypesComponent } from "./inventory/qty-types/qty-types.component";
import { QtyComponent } from "./inventory/qty/qty.component";
import { SupplierComponent } from "./inventory/supplier/supplier.component";
import { ProductPriceComponent } from "./inventory/product-price/product-price.component";
import { ProductComponent } from "./inventory/product/product.component";

export const routes: Routes = [
  { path: 'add-item', component: ProductComponent },
  { path: 'prices', component: ProductPriceComponent },
  { path: 'supplier', component: SupplierComponent },
  {path:'qty',component:QtyComponent},
  { path: 'qty-type', component: QtyTypesComponent }, // Default route // About route
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Wildcard route for unknown paths

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
