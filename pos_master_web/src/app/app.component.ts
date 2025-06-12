import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { AppModule } from './app.module';
import { MessageService } from 'primeng/api';
//import { SidebarComponent } from './sidebar/sidebar.component';
import { MenubarModule } from 'primeng/menubar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ToggleButtonModule } from 'primeng/togglebutton';
import { definePreset } from '@primeng/themes';
import { BehaviorSubject } from 'rxjs';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import { updatePreset } from '@primeng/themes';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToastModule } from 'primeng/toast';
import { SpeedDialModule } from 'primeng/speeddial';
import { ThemeService } from './services/theme.service';
import { LoadingSpinnerService } from '../loading-spinner.service';
import { LoginService } from './login/login.service';
import { AppSidebar } from './dashboard/layout/component/app.sidebar';
import { AppTopbar } from './dashboard/layout/component/app.topbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StyleClassModule } from 'primeng/styleclass';
import { DashboardComponent } from './dashboard/dashboard.component';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,

  imports: [RouterOutlet,
    ToastModule, SpeedDialModule,
    AppModule, MenubarModule,
    CommonModule, MatProgressSpinnerModule,
    ToggleButtonModule, FormsModule,
    ColorPickerModule,
    SelectButtonModule, RouterModule, StyleClassModule],
  providers: [MessageService, LoginService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Inject platformId
  constructor(public loadingSpinnerService: LoadingSpinnerService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  color: string | undefined;
  isDarkTheme = true;
  toggleTheme() {
    const htmlElement = document.documentElement;
    if (this.isDarkTheme) {
      htmlElement.classList.add('app-dark');
    } else {
      htmlElement.classList.remove('app-dark');
    }
    this.setCookie('darkTheme', this.isDarkTheme.toString(), 365); // Save to cookie
  }

  // Function to set a cookie
  setCookie(name: string, value: string, days: number) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  ngOnInit() {
    // Check for the theme in cookies when the component initializes
    // Subscribe to the loading state and assign it to the local property
    this.loadingSpinnerService.loading$.subscribe((loading: boolean) => {
      // Manually trigger change detection after the value is updated
      this.cdr.detectChanges();
    });

  }

  // Function to get a cookie
  getCookie(name: string): string {

    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) == 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    console.log(cookieName);
    return cookieName;

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
    //console.log(baseColor)
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

}
