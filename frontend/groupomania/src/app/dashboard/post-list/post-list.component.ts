import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts: any[] = [];

  constructor(private httpClient: HttpClient) {
    this.httpClient.get<any[]>('http://localhost:3000/api/post').subscribe(
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
