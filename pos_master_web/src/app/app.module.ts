import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MessageService, ConfirmationService } from "primeng/api";
import { AvatarModule } from "primeng/avatar";
import { Button } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { Toast } from "primeng/toast";
import { IftaLabelModule } from 'primeng/iftalabel';
import { AddItemComponent } from "./inventory/add-item/add-item.component";

@NgModule({
  declarations: [
    AddItemComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    Button,
    Toast,
    InputTextModule,
    AvatarModule,
    FormsModule, InputTextModule, IftaLabelModule
  ],
  providers: [MessageService,ConfirmationService,],
})
export class AppModule { }