import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

import { MessageService } from 'primeng/api';
//import { SidebarComponent } from './sidebar/sidebar.component';
import { MenubarModule } from 'primeng/menubar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerService } from './loading-spinner.service';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { definePreset } from '@primeng/themes';
import { BehaviorSubject } from 'rxjs';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import { updatePreset } from '@primeng/themes';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToastModule } from 'primeng/toast';
import { SpeedDialModule } from 'primeng/speeddial';

import { AppModule } from './app/app.module';
import { LoginService } from './app/login.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, SpeedDialModule, AppModule, MenubarModule, CommonModule, MatProgressSpinnerModule, ToggleButtonModule, FormsModule, ColorPickerModule],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent implements OnInit {

  color: string | undefined;
  toggleTheme() {
    const htmlElement = document.documentElement;
    if (this.isDarkTheme) {
      htmlElement.classList.add('my-app-dark');
    } else {
      htmlElement.classList.remove('my-app-dark');
    }
  }

  title = 'payroll-mng-frontend';

  items = [
    {
      label: 'Company Management',
      icon: 'pi pi-users',
      routerLink: '/service-companay'
      // Route for Company Management
    },
    {
      label: 'Employees Management',
      icon: 'pi pi-user-edit',
      items: [
        {
          label: 'Designation',
          icon: 'pi pi-discord',
          routerLink: '/designation' // Route for Designation
        },
        {
          label: 'Employee',
          icon: 'pi pi-user',
          routerLink: '/employee' // Route for Employee
        }
      ]
    },
    {
      label: 'Salary Management',
      icon: 'pi pi-dollar',
      items: [
        {
          label: 'Attendance',
          icon: 'pi pi-file-check',
          routerLink: '/attendance' // Route for Attendance
        },
        {
          label: 'Salary Ratio',
          icon: 'pi pi-dollar',
          routerLink: '/salary-ratio' // Route for Salary Ratio
        },
        {
          label: 'Salary Advance',
          icon: 'pi pi-bitcoin',
          routerLink: '/salary-advance' // Route for Salary Advance
        },
        {
          label: 'Company Employee Basics',
          icon: 'pi pi-credit-card',
          routerLink: '/service-companay-employee' // Route for Company Employee Basics
        }
      ]
    },
    {
      label: 'Contact',
      icon: 'pi pi-envelope',
      routerLink: '/contact' // Route for Contact
    },
  ];
  isDarkTheme = true;

  buttonItems = [
    { title: 'noir', color: 'var(--text-color)', action: () => this.setColor('pink') },
    { title: 'emerald', color: 'rgb(16, 185, 129)', action: () => this.setColor('emerald') },
    { title: 'green', color: 'rgb(34, 197, 94)', action: () => this.setColor('green') },
    { title: 'lime', color: 'rgb(132, 204, 22)', action: () => this.setColor('lime') },
    { title: 'orange', color: 'rgb(249, 115, 22)', action: () => this.setColor('orange') },
    { title: 'amber', color: 'rgb(245, 158, 11)', action: () => this.setColor('amber') },
    { title: 'yellow', color: 'rgb(234, 179, 8)', action: () => this.setColor('yellow') },
    { title: 'teal', color: 'rgb(20, 184, 166)', action: () => this.setColor('teal') },
    { title: 'cyan', color: 'rgb(6, 182, 212)', action: () => this.setColor('cyan') },
    { title: 'sky', color: 'rgb(14, 165, 233)', action: () => this.setColor('sky') },
    { title: 'blue', color: 'rgb(59, 130, 246)', action: () => this.setColor('blue') },
    { title: 'indigo', color: 'rgb(99, 102, 241)', action: () => this.setColor('indigo') },
    { title: 'violet', color: 'rgb(139, 92, 246)', action: () => this.setColor('violet') },
    { title: 'purple', color: 'rgb(168, 85, 247)', action: () => this.setColor('purple') },
    { title: 'fuchsia', color: 'rgb(217, 70, 239)', action: () => this.setColor('fuchsia') },
    { title: 'pink', color: 'rgb(236, 72, 153)', action: () => this.setColor('pink') },
    { title: 'rose', color: 'rgb(244, 63, 94)', action: () => this.setColor('rose') },
  ];

  constructor(public loadingSpinnerService: LoadingSpinnerService, private cdr: ChangeDetectorRef, public loginService: LoginService) { }



  ngOnInit() {
    // Subscribe to the loading state and assign it to the local property
    this.loadingSpinnerService.loading$.subscribe((loading: boolean) => {
      // Manually trigger change detection after the value is updated
      this.cdr.detectChanges();
    });

  }

  changePrimaryColor() {
    updatePreset({
      semantic: {
        primary: {
          50: '{indigo.50}',
          100: '{indigo.100}',
          200: '{indigo.200}',
          300: '{indigo.300}',
          400: '{indigo.400}',
          500: '{indigo.500}',
          600: '{indigo.600}',
          700: '{indigo.700}',
          800: '{indigo.800}',
          900: '{indigo.900}',
          950: '{indigo.950}'
        }
      }
    })
  }

  setColor(baseColor: string) {
    console.log(baseColor)
    // Use the baseColor object to apply lightening adjustments
    updatePreset({
      semantic: {
        primary: {
          50: `{${baseColor}.50}`,
          100: `{${baseColor}.100}`,
          200: `{${baseColor}.200}`,
          300: `{${baseColor}.300}`,
          400: `{${baseColor}.400}`,
          500: `{${baseColor}.500}`,
          600: `{${baseColor}.600}`,
          700: `{${baseColor}.700}`,
          800: `{${baseColor}.800}`,
          900: `{${baseColor}.900}`,
          950: `{${baseColor}.950}`
        }
      }
    });
  }

  isVisible = false;

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }


}
