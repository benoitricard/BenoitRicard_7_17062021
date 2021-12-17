import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { faCrown, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  constructor(private http: HttpClient, public authService: AuthService) {}

  // Icônes FontAwesome
  faEdit = faEdit;
  faTrash = faTrash;
  faCrown = faCrown;

  // Variables
  users: any = [];
  authId: number | any;
  authUser: any = {};

  // Récupérer les posts triés
  getUsers() {
    this.http.get('http://localhost:3000/api/user').subscribe(
      (res) => {
        this.users = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Supprimer un utilisateur
  onDeleteUser(userId: number | any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.http.delete(`http://localhost:3000/api/user/${userId}`).subscribe(
        () => {
          this.getUsers();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  ngOnInit(): void {
    // Récupération de l'id de l'user authentifié
    this.authId = this.authService.getUserIdConnected();

    // Récupération du profil de l'user authentifié
    this.http.get(`http://localhost:3000/api/user/${this.authId}`).subscribe(
      (res: any) => {
        this.authUser = res;
      },
      (err) => {
        console.error(err);
      }
    );

    this.getUsers();
  }
}
