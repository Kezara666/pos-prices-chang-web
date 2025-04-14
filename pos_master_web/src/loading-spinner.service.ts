import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {

  // Create a BehaviorSubject to hold the loading state (true or false)
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observable that components can subscribe to
  loading$ = this.loadingSubject.asObservable();

  // Method to show the spinner
  show(): void {
    this.loadingSubject.next(true);
  }

  // Method to hide the spinner
  hide(): void {
    this.loadingSubject.next(false);
  }
}
