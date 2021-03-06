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
import { Observable } from 'rxjs';
import { UserClass } from 'src/app/models/user-class.model';
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
    public authService: AuthService,
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
  whichOne: string | any = 'posts';
  authId: number | any;
  authObject: any = {};
  posts: any = [];
  likes: any = [];
  postsBtnDisabled: boolean = true;
  likesBtnDisabled: boolean = true;

  // Fonctions
  // Toggle entre afficher les posts ou les likes du profil
  postsOrLikes(value: any) {
    if (value == 'posts') {
      this.whichOne = 'posts';
      return 'posts';
    } else {
      this.whichOne = 'likes';
      return 'likes';
    }
  }

  // Récupérer les posts du profil
  getPosts() {
    let reqId: number = this.route.snapshot.params.id;
    this.http.get(`http://localhost:3000/api/user/${reqId}/post`).subscribe(
      (res: any) => {
        this.posts = res;
        this.postsBtnDisabled = false;
      },
      () => {
        this.postsBtnDisabled = true;
      }
    );
  }

  // Récupérer les posts likés du profil
  getLikes() {
    let userId: number = this.route.snapshot.params.id;
    this.http.get(`http://localhost:3000/api/user/${userId}/like`).subscribe(
      (res: any) => {
        this.likes = res;
        this.likesBtnDisabled = false;
      },
      () => {
        this.likesBtnDisabled = true;
      }
    );
  }

  // Supprimer un profil
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

  // Récupérer les infos de l'user
  getUser() {
    let userId: number = this.route.snapshot.params.id;
    this.http.get(`http://localhost:3000/api/user/${userId}`).subscribe(
      (res: any) => {
        this.user = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnInit(): void {
    this.authId = this.authService.getUserIdConnected();

    this.getUser();
    this.router.events.subscribe(() => {
      window.location.reload();
    });

    // Récupération des infos sur l'user connecté
    this.http.get(`http://localhost:3000/api/user/${this.authId}`).subscribe(
      (res: any) => {
        this.authObject = res;
      },
      (err) => {
        console.error(err);
      }
    );

    this.getPosts();
    this.getLikes();

    setInterval(() => {
      if (this.route.snapshot.params.id == 0) {
        this.router.navigate([`dashboard/profile/${this.authId}`]);
      }
    }, 1000);
  }
}
