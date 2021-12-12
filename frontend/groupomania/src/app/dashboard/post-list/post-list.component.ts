import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import {
  faComment,
  faCrown,
  faEdit,
  faHeart,
  faPaperPlane,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private userService: UserService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  // Icônes FontAwesome
  faEdit = faEdit;
  faTrash = faTrash;
  faHeart = faHeart;
  faComment = faComment;
  faPaperPlane = faPaperPlane;
  faCrown = faCrown;

  // Variables
  posts: any = [];
  likesFromUser: any = [];
  userConnected: any = {};
  userConnectedId: any;
  order: any;
  emptyContent: string = '';
  postedWithSuccess: boolean = false;
  commentedWithSuccess: boolean = false;

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
      .get(`http://localhost:3000/api/user/${this.userConnectedId}/like`)
      .subscribe(
        (res: any) => {
          this.likesFromUser = res;
          return res;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  whichOrder() {
    if (this.order == 'recents') {
      return '';
    } else if (this.order == 'olds') {
      return '/olds';
    } else if (this.order == 'liked') {
      return '/liked';
    } else if (this.order == 'unliked') {
      return '/unliked';
    } else {
      return '';
    }
  }

  // Clic du bouton de tri
  onChangeOrder(orderChanged: any) {
    this.order = orderChanged;
    this.getPosts();
  }

  isThisPostLiked(postId: any) {
    for (let i = 0; i < this.likesFromUser.length; i++) {
      if (this.likesFromUser[i].post_id === postId) {
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
    let connectedUserId: any;

    if (localStorage.getItem('userId')) {
      connectedUserId = localStorage.getItem('userId');
    } else {
      connectedUserId = sessionStorage.getItem('userId');
    }

    this.userConnectedId = connectedUserId;

    this.getPosts();
    this.getLikes();

    this.http
      .get(`http://localhost:3000/api/user/${connectedUserId}`)
      .subscribe(
        (res: any) => {
          this.userConnected = res;
          return res;
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
