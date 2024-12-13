import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
    // Save preference to localStorage
    //localStorage.setItem('darkMode', element?.classList.contains('app-dark') ? 'true' : 'false');
  }
}
