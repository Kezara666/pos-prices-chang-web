import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import { ThemeService } from './services/theme.service';
import { CustomTheme } from './theme.config';



export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: CustomTheme,
        options: {
          darkModeSelector: '.my-app-dark',
        }
      }
    }),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    ThemeService // Add ThemeService to providers
  ]
};

// Now, you'll need to dynamically update the `darkModeSelector` based on the user preference, like in your root component.
