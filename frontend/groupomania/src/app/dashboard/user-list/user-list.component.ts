import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCrown, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  // Icônes FontAwesome
  faEdit = faEdit;
  faTrash = faTrash;
  faCrown = faCrown;

  // Variables
  users: any[] = [];
  connectedUser: any;
  order: any = '';

  // Récupérer les posts triés
  getUsers() {
    this.http
      .get<any[]>(`http://localhost:3000/api/user${this.whichOrder()}`)
      .subscribe(
        (res) => {
          this.users = res;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  // Style des boutons de tri en fonction du choix
  whichOrder() {
    if (this.order == 'recentscreation') {
      return '';
    } else if (this.order == 'oldscreation') {
      return '/oldscreation';
    } else if (this.order == 'recentsconnexion') {
      return '/recentsconnexion';
    } else if (this.order == 'oldsconnexion') {
      return '/oldsconnexion';
    } else {
      return '';
    }
  }

  // Clic du bouton de tri
  onChangeOrder(orderChanged: any) {
    this.order = orderChanged;
    this.getUsers();
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
    this.getUsers();

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
          this.connectedUser = res;
          return res;
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
