import { Component } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  password: string = '';
  userName: string = '';
  constructor(private loginService: LoginService) { }
  visible: boolean = true;

  showDialog() {
    this.visible = true;
  }

  SignIn() {
    if (this.password == 'admin' && this.userName == 'admin') {
      this.loginService.setTrue()
      this.visible = false;
    }
    else {
      this.loginService.setFalse
    }

  }
}
