import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-posts-from-user',
  templateUrl: './posts-from-user.component.html',
  styleUrls: ['./posts-from-user.component.scss'],
})
export class PostsFromUserComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  posts: any = [];
  likesFromUser: any = [];

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
    let userId: number = this.route.snapshot.params.id;
    let connectedUserId: any;

    if (localStorage.getItem('userId')) {
      connectedUserId = localStorage.getItem('userId');
    } else {
      connectedUserId = sessionStorage.getItem('userId');
    }

    this.http.get(`http://localhost:3000/api/user/${userId}/post`).subscribe(
      (res: any) => {
        this.posts = res;
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
