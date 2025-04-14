import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddItemComponent } from "./inventory/add-item/add-item.component";

export const routes: Routes = [
    { path: 'add-item', component: AddItemComponent }, // Default route // About route
    { path: '**', redirectTo: '', pathMatch: 'full' }, // Wildcard route for unknown paths
  
  ];
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  