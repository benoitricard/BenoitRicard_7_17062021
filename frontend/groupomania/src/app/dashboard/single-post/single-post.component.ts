import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faComment,
  faEdit,
  faHeart,
  faPaperPlane,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
})
export class SinglePostComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    private location: Location,
    public authService: AuthService
  ) {}

  // Icônes FontAwesome
  faEdit = faEdit;
  faTrash = faTrash;
  faHeart = faHeart;
  faComment = faComment;
  faPaperPlane = faPaperPlane;

  // Variables
  post: {} | any;
  authObject: {} | any;
  authId: number | any;
  authLikes: [] | any;
  commentedWithSuccess: boolean = false;
  commentInput: any;

  // Fonctions
  // Supprimer un post
  onDeletePost() {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      this.http
        .delete(`http://localhost:3000/api/post/${this.post['id']}`)
        .subscribe(
          () => {
            this.location.back();
          },
          (err) => {
            console.error(err);
          }
        );
    }
  }

  // Supprimer un commentaire
  onDeleteComment(commentId: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.http
        .delete(`http://localhost:3000/api/comment/${commentId}`)
        .subscribe(
          () => {
            this.getPost();
          },
          (err) => {
            console.error(err);
          }
        );
    }
  }

  // Vérifier si ce post est liké par l'user authentifié
  isThisPostLiked(postId: any) {
    for (let i = 0; i < this.authLikes.length; i++) {
      if (this.authLikes[i].post_id === postId) {
        return true;
      }
    }
    return false;
  }

  // Liker un post
  onLikePost(postId: any) {
    this.http.post(`http://localhost:3000/api/like/${postId}`, null).subscribe(
      () => {
        this.getPost();
        this.getLikes();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Récupérer les infos du post
  getPost() {
    let postId: number = this.route.snapshot.params.id;
    this.http.get(`http://localhost:3000/api/post/${postId}`).subscribe(
      (res) => {
        this.post = res;
      },
      (err) => {
        this.router.navigate(['not-found']);
        console.error(err);
      }
    );
  }

  // Récupérer les likes de l'user authentifié
  getLikes() {
    this.http
      .get(`http://localhost:3000/api/user/${this.authId}/like`)
      .subscribe(
        (res: any) => {
          this.authLikes = res;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  // Créer un commentaire
  onCreateComment(form: any, postId: any) {
    this.http
      .post(`http://localhost:3000/api/comment/${postId}`, form)
      .subscribe(
        () => {
          this.commentedWithSuccess = true;
          setTimeout(() => {
            this.commentedWithSuccess = false;
          }, 600);
          this.getPost();
          this.commentInput = '';
        },
        (err) => {
          console.error(err);
        }
      );
  }

  ngOnInit(): void {
    this.authId = this.authService.getUserIdConnected();

    this.getPost();
    this.getLikes();

    this.http.get(`http://localhost:3000/api/user/${this.authId}`).subscribe(
      (res: any) => {
        this.authObject = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
