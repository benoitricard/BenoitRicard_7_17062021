import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { NotFoundComponent } from './not-found/not-found.component';

/* import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: '', component: SignupComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
]; */

@NgModule({
  declarations: [AppComponent, SignupComponent, NotFoundComponent],
  imports: [BrowserModule /* RouterModule.forRoot(appRoutes) */],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
