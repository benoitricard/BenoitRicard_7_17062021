import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEnvelope, faEye, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
@Injectable()
export class LoginComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  // Icônes FontAwesome
  faEnvelope = faEnvelope;
  faLock = faLock;
  faEye = faEye;

  // Variables
  isVisible: boolean = false;
  statusError: number | any;

  onToggleVisibility() {
    let password: any = document.getElementById('password');

    if (this.isVisible == false) {
      password.type = 'text';
      this.isVisible = true;
    } else {
      password.type = 'password';
      this.isVisible = false;
    }
  }

  onLogin(form: any) {
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
        this.statusError = err.status;
      }
    );
  }

  ngOnInit(): void {
    if (localStorage.getItem('auth') || sessionStorage.getItem('auth')) {
      this.router.navigate(['dashboard/posts']);
    }
  }
}
