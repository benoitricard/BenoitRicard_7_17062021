import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faUser,
  faSignature,
  faEnvelope,
  faLock,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
@Injectable()
export class SignupComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  // Icônes FontAwesome
  faUser = faUser;
  faSignature = faSignature;
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

  onSignup(form: any) {
    this.http.post('http://localhost:3000/api/user/signup', form).subscribe(
      () => {
        this.router.navigate(['login']);
      },
      (err: any) => {
        console.error(err);
        this.statusError = err.status;
      }
    );
  }

  ngOnInit(): void {}
}
