import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public router: Router, public authService: AuthService) {}

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
}
