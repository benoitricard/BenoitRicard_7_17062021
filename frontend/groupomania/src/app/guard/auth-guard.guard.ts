import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!sessionStorage.getItem('token')) {
      if (!localStorage.getItem('token')) {
        this.router.navigate(['access-denied']);
        return false;
      }
    }
    return true;
  }
}
