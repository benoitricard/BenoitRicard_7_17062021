import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-single-comment',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss'],
})
export class SingleCommentComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    public authService: AuthService
  ) {}

  // Variables
  authId: number | any; // ID de l'user authentifié
  authObject: any = {}; // Infos de l'user authentifié
  comment: any = { User: [] };

  // Fonctions
  // Update du commentaire
  onCommentUpdate(form: any) {
    this.http
      .put(`http://localhost:3000/api/comment/${this.comment.id}`, form)
      .subscribe(
        () => {
          this.location.back();
        },
        (err) => {
          console.error(err);
        }
      );
  }

  // Suppression du commentaire
  onDeleteComment() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      this.http
        .delete(`http://localhost:3000/api/comment/${this.comment['id']}`)
        .subscribe(
          () => {
            this.location.back();
          },
          (err) => {
            console.error(err);
          }
        );
    }
  }

  getComment() {
    let commentId: number = this.route.snapshot.params.id;

    this.http.get(`http://localhost:3000/api/comment/${commentId}`).subscribe(
      (res) => {
        this.comment = res;
      },
      (err) => {
        this.router.navigate(['not-found']);
        console.error(err);
      }
    );
  }

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

    this.getComment();
  }
}
