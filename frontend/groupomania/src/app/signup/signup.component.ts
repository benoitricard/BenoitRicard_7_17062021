import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
@Injectable()
export class SignupComponent implements OnInit {
  onSignup(form: any) {
    this.httpClient
      .post('http://localhost:3000/api/user/signup', form)
      .subscribe(
        () => {
          console.log('User registered');
          return true;
        },
        (error) => {
          console.log('Erreur : ' + error);
        }
      );
  }

  onVerifyErrors() {
    return true;
  }

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}
}
