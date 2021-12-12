import { Routes } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guard/auth-guard.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { PostListComponent } from './dashboard/post-list/post-list.component';
import { SinglePostComponent } from './dashboard/single-post/single-post.component';
import { MyProfileComponent } from './dashboard/my-profile/my-profile.component';
import { UserListComponent } from './dashboard/user-list/user-list.component';
import { ModifyPostComponent } from './dashboard/modify-post/modify-post.component';
import { SingleCommentComponent } from './dashboard/single-comment/single-comment.component';
import { SingleUserComponent } from './dashboard/single-user/single-user.component';

export const appRoutes: Routes = [
  // Routes Authentification
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  // Routes Dashboard principales
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    children: [
      { path: 'posts', component: PostListComponent },
      { path: 'users', component: UserListComponent },
    ],
  },
  // Routes User
  {
    path: 'dashboard/my-profile/user',
    canActivate: [AuthGuard],
    component: MyProfileComponent,
  },
  {
    path: 'dashboard/profile/:id',
    canActivate: [AuthGuard],
    component: MyProfileComponent,
  },
  {
    path: 'dashboard/my-profile/user/modify',
    canActivate: [AuthGuard],
    component: SingleUserComponent,
  },
  {
    path: 'dashboard/profile/:id/modify',
    canActivate: [AuthGuard],
    component: SingleUserComponent,
  },
  // Routes Post
  {
    path: 'dashboard/posts/:id',
    canActivate: [AuthGuard],
    component: SinglePostComponent,
  },
  {
    path: 'dashboard/posts/:id/modify',
    canActivate: [AuthGuard],
    component: ModifyPostComponent,
  },
  // Routes Comment
  {
    path: 'dashboard/comment/:id',
    canActivate: [AuthGuard],
    component: SingleCommentComponent,
  },
  // Redirections
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', redirectTo: 'not-found' },
];
