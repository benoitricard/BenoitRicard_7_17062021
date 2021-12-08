import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-likes-from-user',
  templateUrl: './likes-from-user.component.html',
  styleUrls: ['./likes-from-user.component.scss'],
})
export class LikesFromUserComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  likesFromConnected: any = [];
  likesFromUser: any = [];

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

    this.http.get(`http://localhost:3000/api/user/${userId}/like`).subscribe(
      (res: any) => {
        this.likesFromUser = res;
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
          this.likesFromConnected = res;
          return res;
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
