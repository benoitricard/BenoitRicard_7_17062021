import { HttpClient } from '@angular/common/http';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
@Injectable()
export class DashboardComponent implements OnInit {
  public connectedUserInfo: any = {};

  userTitle() {
    if (this.router.url == '/dashboard/users') {
      return true;
    } else {
      return false;
    }
  }

  constructor(private router: Router, private http: HttpClient) {}

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
  }
}
