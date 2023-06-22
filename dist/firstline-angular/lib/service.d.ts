import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from './client';
import { AppState } from './config';
import { AuthState } from './state';
import * as i0 from "@angular/core";
export declare class AuthService<TAppState extends AppState = AppState> implements OnDestroy {
    private client;
    private authState;
    private appStateSubject$;
    private ngUnsubscribe$;
    /**
     * Emits boolean values indicating the loading state of the SDK.
     */
    readonly isLoading$: Observable<boolean>;
    /**
     * Emits boolean values indicating the authentication state of the user. If `true`, it means a user has authenticated.
     * This depends on the value of `isLoading$`, so there is no need to manually check the loading state of the SDK.
     */
    readonly isAuthenticated$: Observable<boolean>;
    /**
     * Emits details about the authenticated user, or null if not authenticated.
     */
    readonly user$: Observable<any>;
    /**
     * Emits errors that occur during login, or when checking for an active session on startup.
     */
    readonly error$: Observable<Error>;
    /**
     * Emits the value (if any) that was passed to the `loginRedirect` method call
     * but only **after** `handleRedirectCallback` is first called
     */
    readonly appState$: Observable<TAppState>;
    constructor(client: Client, authState: AuthState);
    /**
     * Called when the service is destroyed
     */
    ngOnDestroy(): void;
    /**
     * ```js
     * loginRedirect();
     * ```
     *
     * Performs a redirect
     */
    loginRedirect(): Observable<void>;
    /**
     * ```js
     * logout();
     * ```
     *
     * Clears the application session and signes out the user.
     */
    logout(): Observable<void>;
    /**
     * ```js
     * getAccessTokenSilently().subscribe(token => ...)
     * ```
     *
     * If there's a valid token stored, return it. Otherwise, opens an
     * iframe with the `/authorize` URL using the parameters provided
     * as arguments. Random and secure `state` and `nonce` parameters
     * will be auto-generated. If the response is successful, results
     * will be valid according to their expiration times.
     *
     */
    getAccessTokenSilently(): Observable<string | null>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthService<any>>;
}
