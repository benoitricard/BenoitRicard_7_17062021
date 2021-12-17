import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr');

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { appRoutes } from './app.routes';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostListComponent } from './dashboard/post-list/post-list.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guard/auth-guard.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { FileUploadService } from './services/file-upload.service';
import { SinglePostComponent } from './dashboard/single-post/single-post.component';
import { SingleUserComponent } from './dashboard/single-user/single-user.component';
import { UserListComponent } from './dashboard/user-list/user-list.component';
import { ModifyPostComponent } from './dashboard/modify-post/modify-post.component';
import { SingleCommentComponent } from './dashboard/single-comment/single-comment.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { PostsFromUserComponent } from './dashboard/my-profile/posts-from-user/posts-from-user.component';
import { LikesFromUserComponent } from './dashboard/my-profile/likes-from-user/likes-from-user.component';
import { UserService } from './services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MyProfileComponent } from './dashboard/my-profile/my-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    NotFoundComponent,
    LoginComponent,
    DashboardComponent,
    PostListComponent,
    AccessDeniedComponent,
    UserListComponent,
    SinglePostComponent,
    SingleUserComponent,
    MyProfileComponent,
    ModifyPostComponent,
    SingleCommentComponent,
    TimeAgoPipe,
    PostsFromUserComponent,
    LikesFromUserComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    AuthService,
    AuthGuard,
    FileUploadService,
    UserService,
    {
      provide: LOCALE_ID,
      useValue: 'fr',
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
