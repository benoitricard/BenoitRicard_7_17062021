import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
@Injectable()
export class DashboardComponent implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Variables
  authId: number | any; // ID de l'user authentifié
  authObject: {} | any; // Infos de l'user authentifié

  ngOnInit(): void {
    this.authId = this.authService.getUserIdConnected();

    this.http.get(`http://localhost:3000/api/user/${this.authId}`).subscribe(
      (res: any) => {
        this.authObject = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
