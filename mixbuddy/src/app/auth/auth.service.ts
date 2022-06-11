import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user.model';

// these properties are prescribed by Firebase API
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /*
   * The directives are classes that add additional behavior to elem-
   * Subject is an observable to which I can subscribe and get new d-
   * ata whenever it is emitted; BehaviorSubject behaves like Subjec-
   * t, but gives subscribers immediate access to previously emmitted
   * value (even if they weren't subscribed to that observable at the
   * time it was emitted). It has to be initialized with a value.
   */
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    // httpClient does nothing without someone subscribing to it - hence return an observable
    return this.http
      .post<AuthResponseData>(
        // URL specified by Firebase API using my 'key' parameter
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.firebaseAPIKey,
        {
          // three data pieces the API endpoint requires
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        // rxjs operator to forward error response to handleError method
        catchError(this.handleError),
        // allows to perform actions without changing the result of the observable
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            // + in front is the cast operator (string to number)
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        // URL specified by Firebase API using my 'key' parameter
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebaseAPIKey,
        {
          // three data pieces the API endpoint requires
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        // rxjs operator to forward error response to handleError method
        catchError(this.handleError),
        // allows to perform actions without changing the result of the observable
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            // + in front is the cast operator (string to number)
            +resData.expiresIn
          );
        })
      );
  }

  autoLogin() {
    // user data is stored in local storage, parse it from string back to object
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    // create new User type object from the user data
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    // if the token is valid, set the user data and auto logout expiration timer
    if (loadedUser.token) {
      this.user.next(loadedUser);

      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    // clear the user data from local storage
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    // clear the token expiration timer if it exists
    if (this.tokenExpirationTimer) clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);

    this.user.next(user);
    this.autoLogout(expiresIn * 1000);

    // store the user data in local storage to survive page reloads
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';

    // in some cases the error response may not be formatted as expected
    if (!errorRes.error || !errorRes.error.error) {
      // return throwError and wrap it into an observable
      return throwError(errorMessage);
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'Email already exists.';
        break;
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        errorMessage = 'Invalid email or password.';
        break;
    }

    return throwError(errorMessage);
  }
}
