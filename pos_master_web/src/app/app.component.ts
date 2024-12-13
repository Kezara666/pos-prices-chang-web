import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ThemeService } from './services/theme.service';
import { providePrimeNG } from 'primeng/config';
import { CustomTheme } from './theme.config';
import { MessageService } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { Toast } from 'primeng/toast';
import { ViewChild } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';

import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { Drawer } from 'primeng/drawer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ButtonModule, FloatLabelModule, InputTextModule, FormsModule, Ripple, Toast,DrawerModule, ButtonModule, Ripple, AvatarModule, StyleClass],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('drawerRef') drawerRef!: Drawer;

    closeCallback(e: Event): void {
        this.drawerRef.close(e);
    }

    visible: boolean = false;

  constructor(public themeService: ThemeService, private messageService: MessageService) { }
  show() {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
  }
}
