import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
@Injectable()
export class DashboardComponent implements OnInit {
  userTitle() {
    if (this.router.url == '/dashboard/users') {
      return true;
    } else {
      return false;
    }
  }

  constructor(private router: Router) {}

  ngOnInit(): void {}
}
