import { Routes } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';

export const appRoutes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'post-list', component: LoginComponent },
  { path: 'user-list', component: LoginComponent },
  { path: 'my-profile', component: LoginComponent },
  { path: 'post/:id', component: LoginComponent },
  { path: 'user/:id', component: LoginComponent },
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];
