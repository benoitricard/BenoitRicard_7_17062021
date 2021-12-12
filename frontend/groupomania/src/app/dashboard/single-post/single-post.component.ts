import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ɵwhenRendered } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  faComment,
  faEdit,
  faHeart,
  faPaperPlane,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';

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
    private location: Location
  ) {}

  // Icônes FontAwesome
  faEdit = faEdit;
  faTrash = faTrash;
  faHeart = faHeart;
  faComment = faComment;
  faPaperPlane = faPaperPlane;

  // Variables
  post: any = {};
  connectedUserInfo: any = {};
  userConnectedId: any;
  likesFromUser: any = [];
  commentedWithSuccess: boolean = false;
  commentInput: any;

  onDeletePost() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
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

  isThisPostLiked(postId: any) {
    for (let i = 0; i < this.likesFromUser.length; i++) {
      if (this.likesFromUser[i].post_id === postId) {
        return true;
      }
    }
    return false;
  }

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

  getLikes() {
    this.http
      .get(`http://localhost:3000/api/user/${this.userConnectedId}/like`)
      .subscribe(
        (res: any) => {
          this.likesFromUser = res;
        },
        (err) => {
          console.error(err);
        }
      );
  }

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
    let connectedUserId: any;

    if (localStorage.getItem('userId')) {
      connectedUserId = localStorage.getItem('userId');
    } else {
      connectedUserId = sessionStorage.getItem('userId');
    }

    this.userConnectedId = connectedUserId;

    this.getPost();
    this.getLikes();

    this.http
      .get(`http://localhost:3000/api/user/${connectedUserId}`)
      .subscribe(
        (res: any) => {
          this.connectedUserInfo = res;
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
