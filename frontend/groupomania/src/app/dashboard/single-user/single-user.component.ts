import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  faBirthdayCake,
  faBriefcase,
  faCrown,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss'],
})
export class SingleUserComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // Icônes FontAwesome
  faBirthdayCake = faBirthdayCake;
  faBriefcase = faBriefcase;
  faCrown = faCrown;

  // Variables
  user: any = {};
  connectedUserInfo: any = {};

  // Fonctions
  userUpdateForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    biography: new FormControl(''),
    jobTitle: new FormControl(''),
    birthday: new FormControl(''),
    attachment: new FormControl(''),
    attachmentSource: new FormControl(''),
  });

  get f() {
    return this.userUpdateForm.controls;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const attachment = event.target.files[0];
      this.userUpdateForm.patchValue({
        attachmentSource: attachment,
      });
    }
  }

  onUserUpdate() {
    const formData = new FormData();
    formData.append(
      'attachment',
      this.userUpdateForm.get('attachmentSource')?.value
    );
    formData.append('firstName', this.userUpdateForm.get('firstName')?.value);
    formData.append('lastName', this.userUpdateForm.get('lastName')?.value);
    formData.append('biography', this.userUpdateForm.get('biography')?.value);
    formData.append('jobTitle', this.userUpdateForm.get('jobTitle')?.value);
    formData.append('birthday', this.userUpdateForm.get('birthday')?.value);

    this.http
      .put(`http://localhost:3000/api/user/${this.user.id}`, formData)
      .subscribe(() => {
        window.location.reload();
      });
  }

  onDeleteUser() {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
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
  }

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
        this.router.navigate(['not-found']);
        console.error(err);
      }
    );
  }
}
