import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

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
    public userService: UserService
  ) {}

  // Icônes FontAwesome
  faSignOutAlt = faSignOutAlt;

  // Variables et constantes //
  // ID de l'user actuellement connecté
  userIdConnected: number | any = 0;

  // Bouton 'se déconnecter' de la navbar
  onLogOut() {
    this.authService.logOut();
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
      this.router.url == `/dashboard/my-profile/${this.userIdConnected}`
    ) {
      return 'profile';
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
