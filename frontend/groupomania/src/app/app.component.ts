import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    public router: Router,
    public authService: AuthService,
    public http: HttpClient
  ) {}

  userIdConnected: any = 0;

  navbarUser() {
    if (this.router.url == '/signup' || this.router.url == '/login') {
      return true;
    } else {
      return false;
    }
  }

  navbarDashboard() {
    if (
      this.router.url == '/signup' ||
      this.router.url == '/login' ||
      this.router.url == '/not-found' ||
      this.router.url == '/access-denied'
    ) {
      return false;
    } else {
      return true;
    }
  }

  onLogOut() {
    this.authService.logOut();
  }

  ngOnInit(): void {
    setInterval(() => {
      this.userIdConnected = this.authService.getUserIdConnected();
    }, 1000);
  }
}
