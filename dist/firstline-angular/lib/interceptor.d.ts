import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthClientConfig } from './config';
import { Client } from './client';
import { AuthState } from './state';
import { AuthService } from './service';
import * as i0 from "@angular/core";
export declare class AuthHttpInterceptor implements HttpInterceptor {
    private configFactory;
    private client;
    private authState;
    private authService;
    constructor(configFactory: AuthClientConfig, client: Client, authState: AuthState, authService: AuthService);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    /**
     * Duplicate of AuthService.getAccessTokenSilently, but with a slightly different return & error handling.
     * Only used internally in the interceptor.
     *
     */
    private getAccessTokenSilently;
    /**
     * Strips the query and fragment from the given uri
     *
     * @param uri The uri to remove the query and fragment from
     */
    private stripQueryFrom;
    /**
     * Determines whether the specified route can have an access token attached to it, based on matching the HTTP request against
     * the interceptor route configuration.
     *
     * @param route The route to test
     * @param request The HTTP request
     */
    private canAttachToken;
    /**
     * Tries to match a route from the SDK configuration to the HTTP request.
     * If a match is found, the route configuration is returned.
     *
     * @param request The Http request
     * @param config HttpInterceptorConfig
     */
    private findMatchingRoute;
    private allowAnonymous;
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthHttpInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AuthHttpInterceptor>;
}
