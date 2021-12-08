import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  signUser(form: any) {
    this.http.post('http://localhost:3000/api/user/signup', form).subscribe(
      () => {
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
          localStorage.setItem('userId', res['userId']);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('auth');
          sessionStorage.removeItem('userId');
        } else {
          sessionStorage.setItem('token', res['token']);
          sessionStorage.setItem('auth', 'true');
          sessionStorage.setItem('userId', res['userId']);
          localStorage.removeItem('token');
          localStorage.removeItem('auth');
          localStorage.removeItem('userId');
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
    localStorage.removeItem('userId');
    sessionStorage.removeItem('userId');
  }

  getToken() {
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    } else {
      return sessionStorage.getItem('token');
    }
  }

  getUserIdConnected() {
    if (localStorage.getItem('userId')) {
      return localStorage.getItem('userId');
    } else {
      return sessionStorage.getItem('userId');
    }
  }
}
