import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  user: any = {};

  onDeleteUser() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre profil ?')) {
      this.http
        .delete(`http://localhost:3000/api/user/${this.user['id']}`)
        .subscribe(
          () => {
            this.router.navigate(['login']);
            this.authService.logOut();
          },
          (err) => {
            console.error(err);
          }
        );
    }
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    let connectedUserId: any;

    if (localStorage.getItem('userId')) {
      connectedUserId = localStorage.getItem('userId');
    } else {
      connectedUserId = sessionStorage.getItem('userId');
    }

    this.http
      .get(`http://localhost:3000/api/user/${connectedUserId}`)
      .subscribe(
        (res: any) => {
          this.user = res;
          return res;
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
