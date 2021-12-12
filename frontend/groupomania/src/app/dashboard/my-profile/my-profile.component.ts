import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faBirthdayCake,
  faPencilAlt,
  faBriefcase,
  faEdit,
  faTrash,
  faCrown,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  // Icônes FontAwesome
  faPencilAlt = faPencilAlt;
  faBirthdayCake = faBirthdayCake;
  faBriefcase = faBriefcase;
  faEdit = faEdit;
  faTrash = faTrash;
  faCrown = faCrown;

  // Variables
  user: any = {};
  whichOne: any = 'posts';
  connectedUserId: number | any;
  userConnected: any = {};

  // Fonctions
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

  ngOnInit(): void {
    let userId: number = this.route.snapshot.params.id;

    if (localStorage.getItem('userId')) {
      this.connectedUserId = localStorage.getItem('userId');
    } else {
      this.connectedUserId = sessionStorage.getItem('userId');
    }

    // Récupération des infos sur l'user connecté
    this.http
      .get(`http://localhost:3000/api/user/${this.connectedUserId}`)
      .subscribe(
        (res: any) => {
          this.userConnected = res;
        },
        (err) => {
          console.error(err);
        }
      );

    // Récupération du profil affiché
    if (this.router.url == '/dashboard/my-profile/user') {
      this.http
        .get(`http://localhost:3000/api/user/${this.connectedUserId}`)
        .subscribe(
          (res: any) => {
            this.user = res;
          },
          (err) => {
            console.error(err);
          }
        );
    } else {
      this.http.get(`http://localhost:3000/api/user/${userId}`).subscribe(
        (res: any) => {
          this.user = res;
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }
}
