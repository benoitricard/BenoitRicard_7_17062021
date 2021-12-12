import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  faBirthdayCake,
  faBriefcase,
  faCrown,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss'],
})
export class SingleUserComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  // Icônes FontAwesome
  faPencilAlt = faPencilAlt;
  faBirthdayCake = faBirthdayCake;
  faBriefcase = faBriefcase;
  faCrown = faCrown;

  // Variables
  user: any = {};
  whichOne: any = 'posts';
  connectedUserId: number | any;
  userConnected: any = {};
  userUpdatedWithSuccess: boolean = false;

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
        if (this.router.url == 'dashboard/my-profile/user/modify') {
          this.router.navigate(['dashboard/my-profile/user']);
        } else {
          this.router.navigate([`dashboard/profile/${this.user.id}`]);
        }
      });
  }

  getUser() {
    let userId: number = this.route.snapshot.params.id;
    if (this.router.url == '/dashboard/my-profile/user/modify') {
      this.http
        .get(`http://localhost:3000/api/user/${this.connectedUserId}`)
        .subscribe(
          (res: any) => {
            this.user = res;
          },
          (err) => {
            console.error(err);
          }
        );
    } else {
      this.http.get(`http://localhost:3000/api/user/${userId}`).subscribe(
        (res: any) => {
          this.user = res;
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('userId')) {
      this.connectedUserId = localStorage.getItem('userId');
    } else {
      this.connectedUserId = sessionStorage.getItem('userId');
    }

    this.getUser();

    // Récupération des infos sur l'user connecté
    this.http
      .get(`http://localhost:3000/api/user/${this.connectedUserId}`)
      .subscribe(
        (res: any) => {
          this.userConnected = res;
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
