import { Injectable, signal } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, finalize, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingSpinnerService } from '../loading-spinner.service';
import { AuthService } from './authservice';
import { LoginService } from './login/login.service';


@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private loadingSpinnerService: LoadingSpinnerService, private loginService: LoginService, private router: Router, private authService:AuthService) { }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (!(this.loginService.isAuthenticated)) {
      console.log(this.loginService.isAuthenticated)
      this.router.navigate(['/login']);
    }

    this.loadingSpinnerService.show();

    return next.handle(request).pipe(
      // Hide spinner after request is completed
      finalize(() => this.loadingSpinnerService.hide()),
      catchError((error) => {
        // Optionally handle error
        this.loadingSpinnerService.hide();
        throw error;
      })
    );
  }


}
