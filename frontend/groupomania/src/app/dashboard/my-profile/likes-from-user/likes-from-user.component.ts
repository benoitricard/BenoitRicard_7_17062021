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
  selector: 'app-likes-from-user',
  templateUrl: './likes-from-user.component.html',
  styleUrls: ['./likes-from-user.component.scss'],
})
export class LikesFromUserComponent implements OnInit {
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
  likesFromConnected: any = [];
  likesFromUser: any = [];
  userReqId: any;
  userConnected: any = {};
  userConnectedId: any;
  commentedWithSuccess: boolean = false;

  isThisPostLiked(postId: any) {
    for (let i = 0; i < this.likesFromConnected['length']; i++) {
      if (this.likesFromConnected[i].post_id === postId) {
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

  onDeletePost(postId: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      this.http.delete(`http://localhost:3000/api/post/${postId}`).subscribe(
        () => {
          this.getPosts();
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
        this.getPosts();
        this.getLikes();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getPosts() {
    let userId: number = this.route.snapshot.params.id;
    if (this.router.url == '/dashboard/my-profile/user') {
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
    } else {
      this.http.get(`http://localhost:3000/api/user/${userId}/like`).subscribe(
        (res: any) => {
          this.likesFromUser = res;
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  getLikes() {
    this.http
      .get(`http://localhost:3000/api/user/${this.userConnectedId}/like`)
      .subscribe(
        (res: any) => {
          this.likesFromConnected = res;
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

    this.getPosts();
    this.getLikes();

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
