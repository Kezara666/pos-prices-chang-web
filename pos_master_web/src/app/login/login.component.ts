import { Component, OnInit } from '@angular/core';

import { MessageService } from 'primeng/api';
import { LoginService } from './login.service';
import { IUser } from '../../models/user/create-user.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  password: string = '';
  userName: string = '';
  constructor(private loginService: LoginService, private messageService: MessageService, private router: Router) { }
  visible: boolean = true;

  showDialog() {
    this.visible = true;
  }

  ngOnInit(): void {
    // Check if user is already logged in
    
  }

  SignIn() {
    this.loginService.login(this.userName, this.password).subscribe({
      next: (user: IUser) => {
        this.loginService.setUser(user)
        this.visible = false;
        this.messageService.add({ severity: 'success', summary: 'Login Success' });
        this.router.navigate(['/dashboard/stat']);
      },
      error: (err: any) => {
        this.loginService.setFalse;
        this.messageService.add({ severity: 'error', summary: 'Failed to load product prices' })
        //user send to this url https://pos-kesara.nimbuscode.online
        window.location.href = 'https://pos-kesara.nimbuscode.online';
      },
    });
  }
}
