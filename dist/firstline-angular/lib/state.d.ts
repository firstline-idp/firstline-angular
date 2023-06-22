import { Client } from './client';
import * as i0 from "@angular/core";
/**
 * Tracks the Authentication State for the SDK
 */
export declare class AuthState {
    private client;
    private isLoadingSubject$;
    private refresh$;
    private accessToken$;
    private errorSubject$;
    /**
     * Emits boolean values indicating the loading state of the SDK.
     */
    readonly isLoading$: import("rxjs").Observable<boolean>;
    /**
     * Trigger used to pull User information from the Client.
     * Triggers when the access token has changed.
     */
    private accessTokenTrigger$;
    /**
     * Trigger used to pull User information from the Client.
     * Triggers when an event occurs that needs to retrigger the User Profile information.
     * Events: Login, Access Token change and Logout
     */
    private readonly isAuthenticatedTrigger$;
    /**
     * Emits boolean values indicating the authentication state of the user. If `true`, it means a user has authenticated.
     * This depends on the value of `isLoading$`, so there is no need to manually check the loading state of the SDK.
     */
    readonly isAuthenticated$: import("rxjs").Observable<boolean>;
    /**
     * Emits details about the authenticated user, or null if not authenticated.
     */
    readonly user$: import("rxjs").Observable<any>;
    /**
     * Emits errors that occur.
     */
    readonly error$: import("rxjs").Observable<Error>;
    constructor(client: Client);
    /**
     * Update the isLoading state using the provided value
     *
     * @param isLoading The new value for isLoading
     */
    setIsLoading(isLoading: boolean): void;
    /**
     * Refresh the state to ensure the `isAuthenticated` and `user$`
     * reflect the most up-to-date values from  Client.
     */
    refresh(): void;
    /**
     * Update the access token, doing so will also refresh the state.
     *
     * @param accessToken The new Access Token
     */
    setAccessToken(accessToken: string): void;
    /**
     * Emits the error in the `error$` observable.
     *
     * @param error The new error
     */
    setError(error: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthState, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthState>;
}
