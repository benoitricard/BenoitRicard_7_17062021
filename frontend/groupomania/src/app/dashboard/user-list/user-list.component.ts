import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  faEdit = faEdit;
  faTrash = faTrash;

  users: any[] = [];

  constructor(private http: HttpClient) {}

  onDeleteUser(userId: number | any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.http.delete(`http://localhost:3000/api/user/${userId}`).subscribe(
        () => {
          window.location.reload();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/user').subscribe(
      (res) => {
        this.users = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
