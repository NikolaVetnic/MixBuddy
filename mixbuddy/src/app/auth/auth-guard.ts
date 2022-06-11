import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // this observable returns user object, not boolean
    return this.authService.user.pipe(
      take(1), // take 1 value from observable and unsubscribe

      map((user) => {
        // if user is logged in set isAuth to true - returns boolean
        const isAuth = !!user;
        if (isAuth) return true;

        // if user is not logged in redirect to login page - returns a UrlTree
        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}
