import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss'],
})
export class SingleUserComponent implements OnInit {
  user: any = {};
  connectedUserInfo: any = {};

  onDeleteUser() {
    this.http
      .delete(`http://localhost:3000/api/user/${this.user['id']}`)
      .subscribe(
        () => {
          this.router.navigate(['dashboard/users']);
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

    let userId: number = this.route.snapshot.params.id;

    this.http.get(`http://localhost:3000/api/user/${userId}`).subscribe(
      (res) => {
        this.user = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
