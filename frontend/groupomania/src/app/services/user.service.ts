import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  constructor(private router: Router) {}

  // Fonctions
  // Navbar sur les pages LOGIN et SIGNUP
  navbarUser() {
    if (this.router.url == '/signup' || this.router.url == '/login') {
      return true;
    }
    return false;
  }

  // Navbar sur le DASHBOARD
  navbarDashboard() {
    if (
      this.router.url == '/signup' ||
      this.router.url == '/login' ||
      this.router.url == '/not-found' ||
      this.router.url == '/access-denied'
    ) {
      return false;
    }
    return true;
  }
}
