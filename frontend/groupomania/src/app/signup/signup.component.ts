import { Component, Injectable, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
@Injectable()
export class SignupComponent implements OnInit {
  onSignup(form: any) {
    this.authService.signUser(form);
  }

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
