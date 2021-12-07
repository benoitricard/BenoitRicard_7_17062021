import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
})
export class SinglePostComponent implements OnInit {
  post: any = {};
  connectedUserInfo: any = {};

  onDeletePost() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      this.http
        .delete(`http://localhost:3000/api/post/${this.post['id']}`)
        .subscribe(
          () => {
            this.router.navigate(['dashboard/posts']);
          },
          (err) => {
            console.error(err);
          }
        );
    }
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

    let postId: number = this.route.snapshot.params.id;

    this.http.get(`http://localhost:3000/api/post/${postId}`).subscribe(
      (res) => {
        this.post = res;
        console.log(this.post);
      },
      (err) => {
        this.router.navigate(['not-found']);
        console.error(err);
      }
    );
  }
}
