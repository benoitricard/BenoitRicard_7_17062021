import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modify-post',
  templateUrl: './modify-post.component.html',
  styleUrls: ['./modify-post.component.scss'],
})
export class ModifyPostComponent implements OnInit {
  post: any = {};
  connectedUserInfo: any = {};

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

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

    let postId: number = this.route.snapshot.params.id;

    this.http.get(`http://localhost:3000/api/post/${postId}`).subscribe(
      (res) => {
        this.post = res;
        console.log(this.post);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
