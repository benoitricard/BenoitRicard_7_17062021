import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
@Injectable()
export class DashboardComponent implements OnInit {
  onCreatePost(form: any) {
    this.httpClient.post('http://localhost:3000/api/post', form).subscribe(
      () => {
        window.location.reload();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}
}
