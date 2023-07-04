import { Injectable, OnDestroy, Inject } from '@angular/core';  // do not remove Inject import!!
import { LoginRedirectOptions as LoginRedirectOptionsSPA } from "@first-line/firstline-spa-js";
import {
  of,
  from,
  Subject,
  Observable,
  ReplaySubject,
  throwError,
} from 'rxjs';
import {
  concatMap,
  tap,
  catchError
} from 'rxjs/operators';

import { Client, ClientService } from './client';  // do not remove ClientService import!!
import { AppState } from './config';
import { AuthState } from './state';

export interface LoginWithRedirectOptions extends LoginRedirectOptionsSPA { };

@Injectable({
  providedIn: 'root',
})
export class AuthService<TAppState extends AppState = AppState>
  implements OnDestroy {
  private appStateSubject$ = new ReplaySubject<TAppState>(1);

  // https://stackoverflow.com/a/41177163
  private ngUnsubscribe$ = new Subject<void>();
  /**
   * Emits boolean values indicating the loading state of the SDK.
   */
  readonly isLoading$ = this.authState.isLoading$;

  /**
   * Emits boolean values indicating the authentication state of the user. If `true`, it means a user has authenticated.
   * This depends on the value of `isLoading$`, so there is no need to manually check the loading state of the SDK.
   */
  readonly isAuthenticated$ = this.authState.isAuthenticated$;

  /**
   * Emits details about the authenticated user, or null if not authenticated.
   */
  readonly user$ = this.authState.user$;

  /**
   * Emits errors that occur during login, or when checking for an active session on startup.
   */
  readonly error$ = this.authState.error$;

  /**
   * Emits the value (if any) that was passed to the `loginWithRedirect` method call
   * but only **after** `handleRedirectCallback` is first called
   */
  readonly appState$ = this.appStateSubject$.asObservable();

  constructor(
    @Inject(ClientService) private client: Client,
    private authState: AuthState
  ) {
    this.client.getAccessToken()
      .then()
      .catch(e => undefined)
      .finally(() => this.authState.setIsLoading(false));
  }

  /**
   * Called when the service is destroyed
   */
  ngOnDestroy(): void {
    // https://stackoverflow.com/a/41177163
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * ```js
   * loginWithRedirect(options);
   * ```
   *
   * Performs a login via redirect
   */
  loginWithRedirect(
    options?: LoginWithRedirectOptions
  ): Observable<void> {
    return from(this.client.loginRedirect(options));
  }

  /**
   * ```js
   * logout();
   * ```
   *
   * Clears the application session and signes out the user.
   */

  logout(): Observable<void> {
    return from(this.client.logout());
  }

  /**
   * ```js
   * getAccessToken().subscribe(token => ...)
   * ```
   *
   * If there's a valid token stored, return it. Otherwise, opens an
   * iframe with the `/authorize` URL using the parameters provided
   * as arguments. Random and secure `state` and `nonce` parameters
   * will be auto-generated. If the response is successful, results
   * will be valid according to their expiration times.
   *
   */
  getAccessToken(): Observable<string | null> {
    return of(this.client).pipe(
      concatMap(client => client.getAccessToken()),
      tap((access_token) => {
        if (access_token)
          return this.authState.setAccessToken(access_token);
      }),
      catchError((error) => {
        this.authState.setError(error);
        this.authState.refresh();
        return throwError(error);
      })
    );
  }
}
