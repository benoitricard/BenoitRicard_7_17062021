import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  signUser(form: any) {
    this.http.post('http://localhost:3000/api/user/signup', form).subscribe(
      (res) => {
        this.router.navigate(['login']);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  logUser(form: any) {
    this.http.post('http://localhost:3000/api/user/login', form).subscribe(
      (res: any) => {
        if (form['checkbox'] == true) {
          localStorage.setItem('token', res['token']);
          localStorage.setItem('auth', 'true');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('auth');
        } else {
          sessionStorage.setItem('token', res['token']);
          sessionStorage.setItem('auth', 'true');
          localStorage.removeItem('token');
          localStorage.removeItem('auth');
        }
        this.router.navigate(['dashboard/posts']);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  logOut() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
  }

  getToken() {
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    } else {
      return sessionStorage.getItem('token');
    }
  }
}
