import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1), // take 1 value from observable and unsubscribe

      // exhaustMap waits for the first observable (user) to complete
      exhaustMap((user) => {
        // if no user logged in (such as on first visit), return the original request
        if (!user) return next.handle(req);

        // if user is logged in, add the token to the request
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token),
        });

        // return the modified request
        return next.handle(modifiedReq);
      })
    );
  }
}
