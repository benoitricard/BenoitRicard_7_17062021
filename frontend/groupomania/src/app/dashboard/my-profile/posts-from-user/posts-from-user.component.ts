import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faComment,
  faCrown,
  faEdit,
  faHeart,
  faPaperPlane,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { PostClass } from 'src/app/models/post-class.model';
import { UserClass } from 'src/app/models/user-class.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-posts-from-user',
  templateUrl: './posts-from-user.component.html',
  styleUrls: ['./posts-from-user.component.scss'],
})
export class PostsFromUserComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    public authService: AuthService
  ) {}

  // Icônes FontAwesome
  faEdit = faEdit;
  faTrash = faTrash;
  faHeart = faHeart;
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faCrown = faCrown;

  // Variables
  posts: PostClass[] = [];
  authLikes: any = [];
  userReqId: number | any;
  authObject: any = {};
  authId: number | any;
  commentedWithSuccess: boolean = false;

  // Fonctions
  // Remonter la page
  onActivate(event: any) {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 5);
  }

  // Vérifier si un post est liké par l'user authentifié
  isThisPostLiked(postId: any) {
    for (let i = 0; i < this.authLikes.length; i++) {
      if (this.authLikes[i].post_id === postId) {
        return true;
      }
    }
    return false;
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
          this.getPosts();
        },
        (err) => {
          console.error(err);
        }
      );
  }

  // Supprimer un post
  onDeletePost(postId: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      this.http.delete(`http://localhost:3000/api/post/${postId}`).subscribe(
        () => {
          this.getPosts();
        },
        () => {
          window.location.reload();
        }
      );
    }
  }

  // Liker un post
  onLikePost(postId: any) {
    this.http.post(`http://localhost:3000/api/like/${postId}`, null).subscribe(
      () => {
        this.getPosts();
        this.getLikes();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Récupérer les posts
  getPosts() {
    let reqId: number = this.route.snapshot.params.id;
    this.http.get(`http://localhost:3000/api/user/${reqId}/post`).subscribe(
      (res: any) => {
        this.posts = res;
      },
      (err) => {
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

  ngOnInit(): void {
    this.authId = this.authService.getUserIdConnected();

    this.getPosts();
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
