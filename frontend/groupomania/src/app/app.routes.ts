import { Routes } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guard/auth-guard.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { PostListComponent } from './dashboard/post-list/post-list.component';
import { UserListComponent } from './dashboard/user-list/user-list.component';
import { SinglePostComponent } from './dashboard/single-post/single-post.component';
import { SingleUserComponent } from './dashboard/single-user/single-user.component';
import { MyProfileComponent } from './dashboard/my-profile/my-profile.component';

export const appRoutes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    children: [
      { path: 'posts', component: PostListComponent },
      { path: 'users', component: UserListComponent },
    ],
  },
  {
    path: 'dashboard/users',
    canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  {
    path: 'dashboard/my-profile',
    canActivate: [AuthGuard],
    component: MyProfileComponent,
  },
  {
    path: 'dashboard/posts/:id',
    canActivate: [AuthGuard],
    component: SinglePostComponent,
  },
  {
    path: 'dashboard/users/:id',
    canActivate: [AuthGuard],
    component: SingleUserComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', redirectTo: 'not-found' },
];