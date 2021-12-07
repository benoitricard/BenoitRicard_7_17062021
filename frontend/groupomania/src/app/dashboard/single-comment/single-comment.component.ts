import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-comment',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss'],
})
export class SingleCommentComponent implements OnInit {
  comment: any = {};
  connectedUserInfo: any = {};

  onDeleteComment() {
    this.http
      .delete(`http://localhost:3000/api/comment/${this.comment['id']}`)
      .subscribe(
        () => {
          this.router.navigate(['dashboard/posts']);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
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

    let commentId: number = this.route.snapshot.params.id;

    this.http.get(`http://localhost:3000/api/comment/${commentId}`).subscribe(
      (res) => {
        this.comment = res;
        console.log(this.comment);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
