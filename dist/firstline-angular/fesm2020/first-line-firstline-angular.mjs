import * as i0 from '@angular/core';
import { InjectionToken, Injectable, Inject, Optional, NgModule, inject } from '@angular/core';
import { BehaviorSubject, Subject, ReplaySubject, merge, defer, of, from, throwError, iif } from 'rxjs';
import { scan, filter, distinctUntilChanged, switchMap, mergeMap, shareReplay, concatMap, tap, catchError, take, first, mapTo, pluck } from 'rxjs/operators';
import { FirstlineClient } from '@first-line/firstline-spa-js';

class Client extends FirstlineClient {
    constructor(options) {
        super(options);
        this.tokens = null;
    }
    async getTokens() {
        if (!this.tokens) {
            this.tokens = await this.doExchangeOrRefresh();
        }
        return this.tokens;
    }
    async getAccessToken() {
        const tokens = await this.getTokens();
        return tokens ? tokens.access_token : null;
    }
    async getUser() {
        const tokens = await this.getTokens();
        return super.getUser(tokens);
    }
    async isAuthenticated() {
        const user = await this.getUser();
        return Boolean(user);
    }
}
;
class ClientFactory {
    static createClient(configFactory) {
        const config = configFactory.get();
        if (!config) {
            throw new Error('Configuration must be specified either through AuthModule.forRoot or through AuthClientConfig.set');
        }
        return new Client(config);
    }
}
const ClientService = new InjectionToken('firstline.client');

/**
 * Tracks the Authentication State for the SDK
 */
class AuthState {
    constructor(client) {
        this.client = client;
        this.isLoadingSubject$ = new BehaviorSubject(true);
        this.refresh$ = new Subject();
        this.accessToken$ = new ReplaySubject(1);
        this.errorSubject$ = new ReplaySubject(1);
        /**
         * Emits boolean values indicating the loading state of the SDK.
         */
        this.isLoading$ = this.isLoadingSubject$.asObservable();
        /**
         * Trigger used to pull User information from the Client.
         * Triggers when the access token has changed.
         */
        this.accessTokenTrigger$ = this.accessToken$.pipe(scan((acc, current) => ({
            previous: acc.current,
            current,
        }), { current: null, previous: null }), filter(({ previous, current }) => previous !== current));
        /**
         * Trigger used to pull User information from the Client.
         * Triggers when an event occurs that needs to retrigger the User Profile information.
         * Events: Login, Access Token change and Logout
         */
        this.isAuthenticatedTrigger$ = this.isLoading$.pipe(filter((loading) => !loading), distinctUntilChanged(), switchMap(() => 
        // To track the value of isAuthenticated over time, we need to merge:
        //  - the current value
        //  - the value whenever the access token changes. (this should always be true of there is an access token
        //    but it is safer to pass this through this.client.isAuthenticated() nevertheless)
        //  - the value whenever refreshState$ emits
        merge(defer(() => this.client.isAuthenticated()), this.accessTokenTrigger$.pipe(mergeMap(() => this.client.isAuthenticated())), this.refresh$.pipe(mergeMap(() => this.client.isAuthenticated())))));
        /**
         * Emits boolean values indicating the authentication state of the user. If `true`, it means a user has authenticated.
         * This depends on the value of `isLoading$`, so there is no need to manually check the loading state of the SDK.
         */
        this.isAuthenticated$ = this.isAuthenticatedTrigger$.pipe(distinctUntilChanged(), shareReplay(1));
        /**
         * Emits details about the authenticated user, or null if not authenticated.
         */
        this.user$ = this.isAuthenticatedTrigger$.pipe(concatMap((authenticated) => authenticated ? this.client.getUser() : of(null)), distinctUntilChanged());
        /**
         * Emits errors that occur.
         */
        this.error$ = this.errorSubject$.asObservable();
    }
    /**
     * Update the isLoading state using the provided value
     *
     * @param isLoading The new value for isLoading
     */
    setIsLoading(isLoading) {
        this.isLoadingSubject$.next(isLoading);
    }
    /**
     * Refresh the state to ensure the `isAuthenticated` and `user$`
     * reflect the most up-to-date values from  Client.
     */
    refresh() {
        this.refresh$.next();
    }
    /**
     * Update the access token, doing so will also refresh the state.
     *
     * @param accessToken The new Access Token
     */
    setAccessToken(accessToken) {
        this.accessToken$.next(accessToken);
    }
    /**
     * Emits the error in the `error$` observable.
     *
     * @param error The new error
     */
    setError(error) {
        this.errorSubject$.next(error);
    }
}
AuthState.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthState, deps: [{ token: ClientService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthState.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthState, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthState, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: Client, decorators: [{
                    type: Inject,
                    args: [ClientService]
                }] }]; } });

;
class AuthService {
    constructor(client, authState) {
        this.client = client;
        this.authState = authState;
        this.appStateSubject$ = new ReplaySubject(1);
        // https://stackoverflow.com/a/41177163
        this.ngUnsubscribe$ = new Subject();
        /**
         * Emits boolean values indicating the loading state of the SDK.
         */
        this.isLoading$ = this.authState.isLoading$;
        /**
         * Emits boolean values indicating the authentication state of the user. If `true`, it means a user has authenticated.
         * This depends on the value of `isLoading$`, so there is no need to manually check the loading state of the SDK.
         */
        this.isAuthenticated$ = this.authState.isAuthenticated$;
        /**
         * Emits details about the authenticated user, or null if not authenticated.
         */
        this.user$ = this.authState.user$;
        /**
         * Emits errors that occur during login, or when checking for an active session on startup.
         */
        this.error$ = this.authState.error$;
        /**
         * Emits the value (if any) that was passed to the `loginWithRedirect` method call
         * but only **after** `handleRedirectCallback` is first called
         */
        this.appState$ = this.appStateSubject$.asObservable();
        this.client.getAccessToken()
            .then()
            .catch(e => undefined)
            .finally(() => this.authState.setIsLoading(false));
    }
    /**
     * Called when the service is destroyed
     */
    ngOnDestroy() {
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
    loginWithRedirect(options) {
        return from(this.client.loginRedirect(options));
    }
    /**
     * ```js
     * logout();
     * ```
     *
     * Clears the application session and signes out the user.
     */
    logout() {
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
    getAccessToken() {
        return of(this.client).pipe(concatMap(client => client.getAccessToken()), tap((access_token) => {
            if (access_token)
                return this.authState.setAccessToken(access_token);
        }), catchError((error) => {
            this.authState.setError(error);
            this.authState.refresh();
            return throwError(error);
        }));
    }
}
AuthService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthService, deps: [{ token: ClientService }, { token: AuthState }], target: i0.ɵɵFactoryTarget.Injectable });
AuthService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: Client, decorators: [{
                    type: Inject,
                    args: [ClientService]
                }] }, { type: AuthState }]; } });

;
/**
 * A custom type guard to help identify route definitions that are actually HttpInterceptorRouteConfig types.
 *
 * @param def The route definition type
 */
function isHttpInterceptorRouteConfig(def) {
    return typeof def !== 'string';
}
/**
 * Injection token for accessing configuration.
 *
 * @usageNotes
 *
 * Use the `Inject` decorator to access the configuration from a service or component:
 *
 * ```
 * class MyService(@Inject(AuthConfigService) config: AuthConfig) {}
 * ```
 */
const AuthConfigService = new InjectionToken('firstline.config');
/**
 * Gets and sets configuration for the internal client. This can be
 * used to provide configuration outside of using AuthModule.forRoot, i.e. from
 * a factory provided by APP_INITIALIZER.
 */
class AuthClientConfig {
    constructor(config) {
        if (config) {
            this.set(config);
        }
    }
    /**
     * Sets configuration to be read by other consumers of the service (see usage notes)
     *
     * @param config The configuration to set
     */
    set(config) {
        this.config = config;
    }
    /**
     * Gets the config that has been set by other consumers of the service
     */
    get() {
        return this.config;
    }
}
AuthClientConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthClientConfig, deps: [{ token: AuthConfigService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
AuthClientConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthClientConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthClientConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [AuthConfigService]
                }] }]; } });

class AuthGuard {
    constructor(auth) {
        this.auth = auth;
    }
    canLoad(route, segments) {
        return this.auth.isAuthenticated$.pipe(take(1));
    }
    canActivate(next, state) {
        return this.redirectIfUnauthenticated(state);
    }
    canActivateChild(childRoute, state) {
        return this.redirectIfUnauthenticated(state);
    }
    redirectIfUnauthenticated(state) {
        return this.auth.isAuthenticated$.pipe(tap((loggedIn) => {
            if (!loggedIn) {
                this.auth.loginWithRedirect({ redirect_uri: state.url });
            }
        }));
    }
}
AuthGuard.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthGuard, deps: [{ token: AuthService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthGuard.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthGuard, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthGuard, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: AuthService }]; } });

class AuthModule {
    /**
     * Initialize the authentication module system. Configuration can either be specified here,
     * or by calling AuthClientConfig.set (perhaps from an APP_INITIALIZER factory function).
     *
     * @param config The optional configuration for the SDK.
     */
    static forRoot(config) {
        return {
            ngModule: AuthModule,
            providers: [
                AuthService,
                AuthGuard,
                {
                    provide: AuthConfigService,
                    useValue: config,
                },
                {
                    provide: ClientService,
                    useFactory: ClientFactory.createClient,
                    deps: [AuthClientConfig],
                },
            ],
        };
    }
}
AuthModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AuthModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthModule });
AuthModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthModule, decorators: [{
            type: NgModule
        }] });

const waitUntil = (signal$) => (source$) => source$.pipe(mergeMap((value) => signal$.pipe(first(), mapTo(value))));
class AuthHttpInterceptor {
    constructor(configFactory, client, authState, authService) {
        this.configFactory = configFactory;
        this.client = client;
        this.authState = authState;
        this.authService = authService;
    }
    intercept(req, next) {
        const config = this.configFactory.get();
        if (!config.httpInterceptor?.allowedList) {
            return next.handle(req);
        }
        const isLoaded$ = this.authService.isLoading$.pipe(filter((isLoading) => !isLoading));
        return this.findMatchingRoute(req, config.httpInterceptor).pipe(concatMap((route) => iif(
        // Check if a route was matched
        () => route !== null, 
        // If we have a matching route, call getToken and attach the token to the
        // outgoing request
        of(route).pipe(waitUntil(isLoaded$), pluck('tokenOptions'), concatMap(() => this.getAccessToken().pipe(catchError((err) => {
            if (this.allowAnonymous(route, err)) {
                return of('');
            }
            this.authState.setError(err);
            return throwError(err);
        }))), switchMap((token) => {
            // Clone the request and attach the bearer token
            const clone = token
                ? req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${token}`),
                })
                : req;
            return next.handle(clone);
        })), 
        // If the URI being called was not found in our httpInterceptor config, simply
        // pass the request through without attaching a token
        next.handle(req))));
    }
    /**
     * Duplicate of AuthService.getAccessToken, but with a slightly different return & error handling.
     * Only used internally in the interceptor.
     *
     */
    getAccessToken() {
        return of(this.client).pipe(concatMap(async (client) => {
            return (await client.getAccessToken()) || "";
        }), tap((access_token) => {
            if (access_token)
                return this.authState.setAccessToken(access_token);
        }), catchError((error) => {
            console.error("error");
            this.authState.refresh();
            return throwError(error);
        }));
    }
    /**
     * Strips the query and fragment from the given uri
     *
     * @param uri The uri to remove the query and fragment from
     */
    stripQueryFrom(uri) {
        if (uri.indexOf('?') > -1) {
            uri = uri.substr(0, uri.indexOf('?'));
        }
        if (uri.indexOf('#') > -1) {
            uri = uri.substr(0, uri.indexOf('#'));
        }
        return uri;
    }
    /**
     * Determines whether the specified route can have an access token attached to it, based on matching the HTTP request against
     * the interceptor route configuration.
     *
     * @param route The route to test
     * @param request The HTTP request
     */
    canAttachToken(route, request) {
        const testPrimitive = (value) => {
            if (!value) {
                return false;
            }
            const requestPath = this.stripQueryFrom(request.url);
            if (value === requestPath) {
                return true;
            }
            // If the URL ends with an asterisk, match using startsWith.
            return (value.indexOf('*') === value.length - 1 &&
                request.url.startsWith(value.substr(0, value.length - 1)));
        };
        if (isHttpInterceptorRouteConfig(route)) {
            if (route.httpMethod && route.httpMethod !== request.method) {
                return false;
            }
            /* istanbul ignore if */
            if (!route.uri && !route.uriMatcher) {
                console.warn('Either a uri or uriMatcher is required when configuring the HTTP interceptor.');
            }
            return route.uriMatcher
                ? route.uriMatcher(request.url)
                : testPrimitive(route.uri);
        }
        return testPrimitive(route);
    }
    /**
     * Tries to match a route from the SDK configuration to the HTTP request.
     * If a match is found, the route configuration is returned.
     *
     * @param request The Http request
     * @param config HttpInterceptorConfig
     */
    findMatchingRoute(request, config) {
        return from(config.allowedList).pipe(first((route) => this.canAttachToken(route, request), null));
    }
    allowAnonymous(route, err) {
        return (!!route &&
            isHttpInterceptorRouteConfig(route) &&
            !!route.allowAnonymous &&
            ['login_required', 'consent_required', 'missing_refresh_token'].includes(err.error));
    }
}
AuthHttpInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthHttpInterceptor, deps: [{ token: AuthClientConfig }, { token: ClientService }, { token: AuthState }, { token: AuthService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthHttpInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthHttpInterceptor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthHttpInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: AuthClientConfig }, { type: Client, decorators: [{
                    type: Inject,
                    args: [ClientService]
                }] }, { type: AuthState }, { type: AuthService }]; } });

/**
 * Initialize the authentication system. Configuration can either be specified here,
 * or by calling AuthClientConfig.set (perhaps from an APP_INITIALIZER factory function).
 *
 * Note: Should only be used as of Angular 15, and should not be added to a component's providers.
 *
 * @param config The optional configuration for the SDK.
 *
 * @example
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provide(),
 *   ],
 * });
 */
function provide(config) {
    return [
        AuthService,
        AuthHttpInterceptor,
        AuthGuard,
        {
            provide: AuthConfigService,
            useValue: config,
        },
        {
            provide: ClientService,
            useFactory: ClientFactory.createClient,
            deps: [AuthClientConfig],
        },
    ];
}

/**
 * Functional AuthGuard to ensure routes can only be accessed when authenticated.
 *
 * Note: Should only be used as of Angular 15
 *
 * @param route Contains the information about a route associated with a component loaded in an outlet at a particular moment in time.
 * @param state Represents the state of the router at a moment in time.
 * @returns An Observable, indicating if the route can be accessed or not
 */
const authGuardFn = (route, state) => inject(AuthGuard).canActivate(route, state);
/**
 * Functional AuthHttpInterceptor to include the access token in matching requests.
 *
 * Note: Should only be used as of Angular 15
 *
 * @param req An outgoing HTTP request with an optional typed body.
 * @param handle Represents the next interceptor in an interceptor chain, or the real backend if there are no
 * further interceptors.
 * @returns An Observable representing the intercepted HttpRequest
 */
const authHttpInterceptorFn = (req, handle) => inject(AuthHttpInterceptor).intercept(req, { handle });

/**
 * Generated bundle index. Do not edit.
 */

export { AuthClientConfig, AuthConfigService, AuthGuard, AuthHttpInterceptor, AuthModule, AuthService, AuthState, Client, ClientFactory, ClientService, authGuardFn, authHttpInterceptorFn, isHttpInterceptorRouteConfig, provide };
//# sourceMappingURL=first-line-firstline-angular.mjs.map
