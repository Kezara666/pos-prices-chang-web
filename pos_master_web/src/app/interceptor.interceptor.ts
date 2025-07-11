import { Injectable, signal } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, finalize, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingSpinnerService } from '../loading-spinner.service';
import { AuthService } from './authservice';
import { LoginService } from './login/login.service';


@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private loadingSpinnerService: LoadingSpinnerService, private loginService: LoginService, private router: Router, private authService: AuthService) { }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isLoginUrl = request.url.includes('/users/login') || request.url.includes('/users/refresh-token');
    const isLogin = this.loginService.isAuthenticated


    if (isLogin == false && !isLoginUrl && this.loginService.userId == 0) {
      console.log(this.loginService.isAuthenticated)
      console.log(this.loginService.currentUser)
      this.router.navigate(['/login']);
    }

    this.loadingSpinnerService.show();

    return next.handle(request).pipe(
      // Hide spinner after request is completed
      finalize(() => this.loadingSpinnerService.hide()),
      catchError((error) => {
        // Optionally handle error
        this.loadingSpinnerService.hide();
        //this.router.navigate(['/login']);
        throw error;
      })
    );
  }


}
