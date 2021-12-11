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

@Component({
  selector: 'app-posts-from-user',
  templateUrl: './posts-from-user.component.html',
  styleUrls: ['./posts-from-user.component.scss'],
})
export class PostsFromUserComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  // Icônes FontAwesome
  faEdit = faEdit;
  faTrash = faTrash;
  faHeart = faHeart;
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faCrown = faCrown;

  // Variables
  posts: any = [];
  likesFromUser: any = [];
  userReqId: any;
  userConnected: any = {};
  userConnectedId: any;

  // Fonctions
  pairOuImpair(postId: any) {
    if (postId % 2 == 0) {
      return 'pair';
    } else {
      return 'impair';
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

  onCreateComment(form: any, postId: any) {
    this.http
      .post(`http://localhost:3000/api/comment/${postId}`, form)
      .subscribe(
        () => {
          window.location.reload();
        },
        (err) => {
          console.error(err);
        }
      );
  }

  onDeletePost(postId: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      this.http.delete(`http://localhost:3000/api/post/${postId}`).subscribe(
        () => {
          window.location.reload();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  onLikePost(postId: any) {
    this.http.post(`http://localhost:3000/api/like/${postId}`, null).subscribe(
      () => {
        window.location.reload();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnInit(): void {
    let userId: number = this.route.snapshot.params.id;
    this.userReqId = userId;
    let connectedUserId: any;

    if (localStorage.getItem('userId')) {
      connectedUserId = localStorage.getItem('userId');
    } else {
      connectedUserId = sessionStorage.getItem('userId');
    }

    this.userConnectedId = connectedUserId;

    if (this.router.url == '/dashboard/my-profile') {
      this.http
        .get(`http://localhost:3000/api/user/${connectedUserId}/post`)
        .subscribe(
          (res: any) => {
            this.posts = res;
          },
          (err) => {
            console.error(err);
          }
        );
    } else {
      this.http.get(`http://localhost:3000/api/user/${userId}/post`).subscribe(
        (res: any) => {
          this.posts = res;
        },
        (err) => {
          console.error(err);
        }
      );
    }

    this.http
      .get(`http://localhost:3000/api/user/${connectedUserId}/like`)
      .subscribe(
        (res: any) => {
          this.likesFromUser = res;
          return res;
        },
        (err) => {
          console.error(err);
        }
      );

    this.http
      .get(`http://localhost:3000/api/user/${connectedUserId}`)
      .subscribe(
        (res: any) => {
          this.userConnected = res;
          return res;
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
