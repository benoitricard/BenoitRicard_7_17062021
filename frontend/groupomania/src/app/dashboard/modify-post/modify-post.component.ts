import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modify-post',
  templateUrl: './modify-post.component.html',
  styleUrls: ['./modify-post.component.scss'],
})
export class ModifyPostComponent implements OnInit {
  post: any = {};
  connectedUserInfo: any = {};

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
    }
  }

  onPostUpdate() {
    const formData = new FormData();
    formData.append(
      'attachment',
      this.postUpdateForm.get('attachmentSource')?.value
    );
    formData.append('content', this.postUpdateForm.get('content')?.value);

    this.http
      .put(`http://localhost:3000/api/post/${this.post.id}`, formData)
      .subscribe(() => {
        this.router.navigate([`dashboard/posts/${this.post.id}`]);
      });
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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

    let postId: number = this.route.snapshot.params.id;

    this.http.get(`http://localhost:3000/api/post/${postId}`).subscribe(
      (res) => {
        this.post = res;
        console.log(this.post);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
