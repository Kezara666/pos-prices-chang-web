import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-menu',
    template: `
        <ul class="layout-menu">
            <ng-container *ngFor="let item of model; let i = index">
                <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
                <li *ngIf="item.separator" class="menu-separator"></li>
            </ng-container>
        </ul>
    `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard/stat'] }]
            },
            {
                label: 'Inventory',
                items: [
                    { label: 'Add Item', icon: 'pi pi-fw pi-plus', routerLink: ['/dashboard/add-item'] },
                    { label: 'Prices', icon: 'pi pi-fw pi-tag', routerLink: ['/dashboard/prices'] },
                    { label: 'Supplier', icon: 'pi pi-fw pi-truck', routerLink: ['/dashboard/supplier'] },
                    { label: 'Quantity', icon: 'pi pi-fw pi-sort-amount-up', routerLink: ['/dashboard/qty'] },
                    { label: 'Quantity Types', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/qty-type'] }
                    
                ]
            },
            {
                label: 'Salse Management',
                items: [
                    { label: 'Purchase Order', icon: 'pi pi-fw pi-money-bill', routerLink: ['/dashboard/purchase-order'] },
                    { label: 'Purchase History', icon: 'pi pi-fw pi-sort-alpha-down', routerLink: ['/dashboard/old-purchase-order'] },
                    { label: 'Supplier', icon: 'pi pi-fw pi-truck', routerLink: ['/dashboard/supplier'] },
                    { label: 'Quantity', icon: 'pi pi-fw pi-sort-amount-up', routerLink: ['/dashboard/qty'] },
                    { label: 'Quantity Types', icon: 'pi pi-fw pi-list', routerLink: ['/dashboard/qty-type'] }
                ]
            }
        ];
    }
}