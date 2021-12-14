import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  faComment,
  faCrown,
  faEdit,
  faHeart,
  faPaperPlane,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  constructor(
    private http: HttpClient,
    public router: Router,
    public authService: AuthService
  ) {}

  // Icônes FontAwesome
  faEdit = faEdit;
  faTrash = faTrash;
  faHeart = faHeart;
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faCrown = faCrown;

  // Variables
  posts: [] | any;
  authLikes: [] | any;
  authObject: {} | any;
  authId: number | any;
  postOrder: string | any;
  emptyContent: string = '';
  postedWithSuccess: boolean = false;
  commentedWithSuccess: boolean = false;

  // Fonctions
  // Création d'un post
  postCreationForm = new FormGroup({
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    attachment: new FormControl(''),
    attachmentSource: new FormControl(''),
  });

  get f() {
    return this.postCreationForm.controls;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const attachment = event.target.files[0];
      this.postCreationForm.patchValue({
        attachmentSource: attachment,
      });
    }
  }

  onPostCreation() {
    const formData = new FormData();
    formData.append(
      'attachment',
      this.postCreationForm.get('attachmentSource')?.value
    );
    formData.append('content', this.postCreationForm.get('content')?.value);

    this.http.post('http://localhost:3000/api/post', formData).subscribe(() => {
      this.postedWithSuccess = true;
      setTimeout(() => {
        this.postedWithSuccess = false;
      }, 600);
      this.getPosts();
      this.postCreationForm.reset();
    });
  }

  getPosts() {
    this.http
      .get<any[]>(`http://localhost:3000/api/post${this.whichOrder()}`)
      .subscribe(
        (res) => {
          this.posts = res;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  getLikes() {
    this.http
      .get(`http://localhost:3000/api/user/${this.authId}/like`)
      .subscribe(
        (res: any) => {
          this.authLikes = res;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  whichOrder() {
    if (this.postOrder == 'recents') {
      return '';
    } else if (this.postOrder == 'olds') {
      return '/olds';
    } else if (this.postOrder == 'liked') {
      return '/liked';
    } else if (this.postOrder == 'unliked') {
      return '/unliked';
    } else {
      return '';
    }
  }

  // Clic du bouton de tri
  onChangeOrder(orderChanged: any) {
    this.postOrder = orderChanged;
    this.getPosts();
  }

  isThisPostLiked(postId: any) {
    for (let i = 0; i < this.authLikes.length; i++) {
      if (this.authLikes[i].post_id === postId) {
        return true;
      }
    }
    return false;
  }

  onCreateComment(form: any, postId: any) {
    this.http
      .post(`http://localhost:3000/api/comment/${postId}`, form)
      .subscribe(
        () => {
          this.commentedWithSuccess = true;
          setTimeout(() => {
            this.commentedWithSuccess = false;
          }, 600);
          this.getPosts();
        },
        (err) => {
          console.error(err);
        }
      );
  }

  onDeletePost(postId: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      this.http.delete(`http://localhost:3000/api/post/${postId}`).subscribe(
        () => {
          this.getPosts();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  onLikePost(postId: any) {
    this.http.post(`http://localhost:3000/api/like/${postId}`, null).subscribe(
      () => {
        this.getPosts();
        this.getLikes();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnInit(): void {
    this.authId = this.authService.getUserIdConnected();

    this.getPosts();
    this.getLikes();

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
