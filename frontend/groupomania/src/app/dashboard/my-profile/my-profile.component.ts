import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  user: any = {};
  whichOne: any = 'posts';
  connectedUserId: any;

  postsOrLikes(value: any) {
    if (value == 'posts') {
      this.whichOne = 'posts';
      return 'posts';
    } else {
      this.whichOne = 'likes';
      return 'likes';
    }
  }

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
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let userId: number = this.route.snapshot.params.id;

    if (localStorage.getItem('userId')) {
      this.connectedUserId = localStorage.getItem('userId');
    } else {
      this.connectedUserId = sessionStorage.getItem('userId');
    }

    this.http
      .get(`http://localhost:3000/api/user/${this.connectedUserId}`)
      .subscribe(
        (res: any) => {
          this.connectedUserId = res;
          return res;
        },
        (err) => {
          console.error(err);
        }
      );

    this.http.get(`http://localhost:3000/api/user/${userId}`).subscribe(
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
