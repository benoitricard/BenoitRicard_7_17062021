import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faArrowCircleLeft,
  faArrowCircleUp,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    public router: Router,
    public authService: AuthService,
    public http: HttpClient,
    public userService: UserService,
    private location: Location
  ) {}

  // Icônes FontAwesome
  faSignOutAlt = faSignOutAlt;
  faArrowCircleUp = faArrowCircleUp;
  faArrowCircleLeft = faArrowCircleLeft;

  // Variables et constantes //
  // ID de l'user actuellement connecté
  userIdConnected: number | any = 0;

  // Bouton 'se déconnecter' de la navbar
  onLogOut() {
    this.authService.logOut();
  }

  // Retour arrière Header
  onArrowBack() {
    this.location.back();
  }

  onArrowUp() {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 4);
  }

  onActivate(event: any) {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 4);
  }

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

  // Style des boutons de navigation en fonction du chemin
  whichPath() {
    if (this.router.url == '/login') {
      return 'login';
    } else if (this.router.url == '/signup') {
      return 'signup';
    } else if (this.router.url == '/dashboard/posts') {
      return 'posts';
    } else if (this.router.url == '/dashboard/users') {
      return 'users';
    } else if (
      this.router.url == `/dashboard/profile/${this.userIdConnected}`
    ) {
      return 'my-profile';
    } else {
      return null;
    }
  }

  ngOnInit(): void {
    // Actualisation de l'ID de l'user connecté, toutes les secondes, pour éviter les bugs
    setInterval(() => {
      this.userIdConnected = this.authService.getUserIdConnected();
    }, 1000);
  }
}
