import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  navbarDashboard() {
    if (this.router.url == '/signup' || this.router.url == '/login') {
      return false;
    } else {
      return true;
    }
  }

  navbarUser() {
    if (this.router.url == '/signup' || this.router.url == '/login') {
      return true;
    } else {
      return false;
    }
  }

  constructor(private router: Router) {}
}
