import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  posts: any[] = [];
  connectedUserInfo: any = {};
  likesFromUser: any = [];
  order: any;

  getPosts() {
    this.http
      .get<any[]>(`http://localhost:3000/api/post${this.whichOrder()}`)
      .subscribe(
        (res) => {
          this.posts = res;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  whichOrder() {
    if (this.order == 'recents') {
      return '';
    } else if (this.order == 'olds') {
      return '/olds';
    } else if (this.order == 'liked') {
      return '/liked';
    } else if (this.order == 'unliked') {
      return '/unliked';
    } else {
      return '';
    }
  }

  // Clic du bouton de tri
  onChangeOrder(orderChanged: any) {
    this.order = orderChanged;
    this.getPosts();
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
    this.http.get<any[]>('http://localhost:3000/api/post').subscribe(
      (res) => {
        this.posts = res;
      },
      (err) => {
        console.error(err);
      }
    );

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
          this.connectedUserInfo = res;
          return res;
        },
        (err) => {
          console.error(err);
        }
      );

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
  }
}
