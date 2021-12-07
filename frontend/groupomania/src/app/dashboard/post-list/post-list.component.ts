import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts: any[] = [];

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

  constructor(private http: HttpClient) {
    this.http.get<any[]>('http://localhost:3000/api/post').subscribe(
      (res) => {
        this.posts = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnInit(): void {}
}
