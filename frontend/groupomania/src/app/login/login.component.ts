import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
@Injectable()
export class LoginComponent implements OnInit {
  onLogin(form: any) {
    this.httpClient
      .post('http://localhost:3000/api/user/login', form)
      .subscribe(
        () => {
          console.log('User connected');
        },
        (error) => {
          console.log('Erreur : ' + error);
        }
      );
  }

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}
}
