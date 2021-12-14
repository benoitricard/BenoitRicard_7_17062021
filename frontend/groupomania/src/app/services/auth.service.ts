import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  logOut() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  getToken() {
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    } else {
      return sessionStorage.getItem('token');
    }
  }

  getUserIdConnected() {
    if (localStorage.getItem('token')) {
      let token: any = localStorage.getItem('token');
      let decode: any = jwt_decode(token);
      return decode.userId;
    } else {
      let token: any = sessionStorage.getItem('token');
      let decode: any = jwt_decode(token);
      return decode.userId;
    }
  }
}
