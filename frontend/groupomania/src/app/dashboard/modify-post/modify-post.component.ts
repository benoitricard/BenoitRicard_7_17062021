import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-modify-post',
  templateUrl: './modify-post.component.html',
  styleUrls: ['./modify-post.component.scss'],
})
export class ModifyPostComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location,
    public authService: AuthService
  ) {}

  // Variables
  post: any = { User: [] };
  authObject: any = {};
  authId: number | any;
  attachmentChanged: boolean = false;

  // Fonctions
  // Update d'un post
  postUpdateForm = new FormGroup({
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    attachment: new FormControl(''),
    attachmentSource: new FormControl(''),
  });

  get f() {
    return this.postUpdateForm.controls;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const attachment = event.target.files[0];
      this.postUpdateForm.patchValue({
        attachmentSource: attachment,
      });
      this.attachmentChanged = true;
    }
  }

  onDeleteAttachment() {
    this.post.attachment = '';
  }

  onPostUpdate() {
    const formData = new FormData();
    if (this.attachmentChanged) {
      formData.append(
        'attachment',
        this.postUpdateForm.get('attachmentSource')?.value
      );
    } else {
      formData.append('attachment', this.post.attachment);
    }
    formData.append('content', this.postUpdateForm.get('content')?.value);

    this.http
      .put(`http://localhost:3000/api/post/${this.post.id}`, formData)
      .subscribe(() => {
        this.location.back();
      });
  }

  getPost() {
    let postId: number = this.route.snapshot.params.id;

    this.http.get(`http://localhost:3000/api/post/${postId}`).subscribe(
      (res) => {
        this.post = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnInit(): void {
    this.authId = this.authService.getUserIdConnected();

    this.getPost();

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
