import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
@Injectable()
export class LoginComponent implements OnInit {
  onLogin(form: any) {
    this.authService.logUser(form);
  }

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('auth') || sessionStorage.getItem('auth')) {
      this.router.navigate(['dashboard/posts']);
    }
  }
}
