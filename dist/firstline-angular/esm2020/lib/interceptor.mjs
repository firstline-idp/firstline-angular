import { from, of, iif, throwError } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { switchMap, first, concatMap, catchError, tap, filter, mergeMap, mapTo, pluck, } from 'rxjs/operators';
import { isHttpInterceptorRouteConfig } from './config';
import { ClientService } from './client';
import * as i0 from "@angular/core";
import * as i1 from "./config";
import * as i2 from "./state";
import * as i3 from "./service";
import * as i4 from "./client";
const waitUntil = (signal$) => (source$) => source$.pipe(mergeMap((value) => signal$.pipe(first(), mapTo(value))));
export class AuthHttpInterceptor {
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
        // If we have a matching route, call getTokenSilently and attach the token to the
        // outgoing request
        of(route).pipe(waitUntil(isLoaded$), pluck('tokenOptions'), concatMap(() => this.getAccessTokenSilently().pipe(catchError((err) => {
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
     * Duplicate of AuthService.getAccessTokenSilently, but with a slightly different return & error handling.
     * Only used internally in the interceptor.
     *
     */
    getAccessTokenSilently() {
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
AuthHttpInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthHttpInterceptor, deps: [{ token: i1.AuthClientConfig }, { token: ClientService }, { token: i2.AuthState }, { token: i3.AuthService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthHttpInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthHttpInterceptor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthHttpInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.AuthClientConfig }, { type: i4.Client, decorators: [{
                    type: Inject,
                    args: [ClientService]
                }] }, { type: i2.AuthState }, { type: i3.AuthService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2ludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLE9BQU8sRUFBYyxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixHQUFHLEVBQ0gsTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsS0FBSyxHQUNOLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUVMLDRCQUE0QixFQUk3QixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQVUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDOzs7Ozs7QUFJakQsTUFBTSxTQUFTLEdBQ2IsQ0FBVSxPQUE0QixFQUFFLEVBQUUsQ0FDMUMsQ0FBVSxPQUE0QixFQUFFLEVBQUUsQ0FDeEMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRzNFLE1BQU0sT0FBTyxtQkFBbUI7SUFDOUIsWUFDVSxhQUErQixFQUNSLE1BQWMsRUFDckMsU0FBb0IsRUFDcEIsV0FBd0I7UUFIeEIsa0JBQWEsR0FBYixhQUFhLENBQWtCO1FBQ1IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNyQyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQy9CLENBQUM7SUFFSixTQUFTLENBQ1AsR0FBcUIsRUFDckIsSUFBaUI7UUFFakIsTUFBTSxN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XG4gIEh0dHBJbnRlcmNlcHRvcixcclxuICBIdHRwUmVxdWVzdCxcclxuICBIdHRwSGFuZGxlcixcclxuICBIdHRwRXZlbnQsXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBmcm9tLCBvZiwgaWlmLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge1xyXG4gIHN3aXRjaE1hcCxcclxuICBmaXJzdCxcclxuICBjb25jYXRNYXAsXHJcbiAgY2F0Y2hFcnJvcixcclxuICB0YXAsXHJcbiAgZmlsdGVyLFxyXG4gIG1lcmdlTWFwLFxyXG4gIG1hcFRvLFxyXG4gIHBsdWNrLFxyXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmltcG9ydCB7XHJcbiAgQXBpUm91dGVEZWZpbml0aW9uLFxyXG4gIGlzSHR0cEludGVyY2VwdG9yUm91dGVDb25maWcsXHJcbiAgQXV0aENsaWVudENvbmZpZyxcclxuICBIdHRwSW50ZXJjZXB0b3JDb25maWcsXHJcbiAgR2V0VG9rZW5TaWxlbnRseU9wdGlvbnNcclxufSBmcm9tICcuL2NvbmZpZyc7XHJcbmltcG9ydCB7IENsaWVudCwgQ2xpZW50U2VydmljZSB9IGZyb20gJy4vY2xpZW50JztcclxuaW1wb3J0IHsgQXV0aFN0YXRlIH0gZnJvbSAnLi9zdGF0ZSc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlJztcclxuXHJcbmNvbnN0IHdhaXRVbnRpbCA9XHJcbiAgPFRTaWduYWw+KHNpZ25hbCQ6IE9ic2VydmFibGU8VFNpZ25hbD4pID0+XHJcbiAgPFRTb3VyY2U+KHNvdXJjZSQ6IE9ic2VydmFibGU8VFNvdXJjZT4pID0+XHJcbiAgICBzb3VyY2UkLnBpcGUobWVyZ2VNYXAoKHZhbHVlKSA9PiBzaWduYWwkLnBpcGUoZmlyc3QoKSwgbWFwVG8odmFsdWUpKSkpO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aEh0dHBJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGNvbmZpZ0ZhY3Rvcnk6IEF1dGhDbGllbnRDb25maWcsXHJcbiAgICBASW5qZWN0KENsaWVudFNlcnZpY2UpIHByaXZhdGUgY2xpZW50OiBDbGllbnQsXHJcbiAgICBwcml2YXRlIGF1dGhTdGF0ZTogQXV0aFN0YXRlLFxyXG4gICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIGludGVyY2VwdChcclxuICAgIHJlcTogSHR0cFJlcXVlc3Q8YW55PixcclxuICAgIG5leHQ6IEh0dHBIYW5kbGVyXHJcbiAgKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xyXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWdGYWN0b3J5LmdldCgpO1xyXG4gICAgaWYgKCFjb25maWcuaHR0cEludGVyY2VwdG9yPy5hbGxvd2VkTGlzdCkge1xyXG4gICAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpc0xvYWRlZCQgPSB0aGlzLmF1dGhTZXJ2aWNlLmlzTG9hZGluZyQucGlwZShcclxuICAgICAgZmlsdGVyKChpc0xvYWRpbmcpID0+ICFpc0xvYWRpbmcpXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmZpbmRNYXRjaGluZ1JvdXRlKHJlcSwgY29uZmlnLmh0dHBJbnRlcmNlcHRvcikucGlwZShcclxuICAgICAgY29uY2F0TWFwKChyb3V0ZSkgPT5cclxuICAgICAgICBpaWYoXHJcbiAgICAgICAgICAvLyBDaGVjayBpZiBhIHJvdXRlIHdhcyBtYXRjaGVkXHJcbiAgICAgICAgICAoKSA9PiByb3V0ZSAhPT0gbnVsbCxcclxuICAgICAgICAgIC8vIElmIHdlIGhhdmUgYSBtYXRjaGluZyByb3V0ZSwgY2FsbCBnZXRUb2tlblNpbGVudGx5IGFuZCBhdHRhY2ggdGhlIHRva2VuIHRvIHRoZVxyXG4gICAgICAgICAgLy8gb3V0Z29pbmcgcmVxdWVzdFxyXG4gICAgICAgICAgb2Yocm91dGUpLnBpcGUoXHJcbiAgICAgICAgICAgIHdhaXRVbnRpbChpc0xvYWRlZCQpLCAgICAgICAgICBcclxuICAgICAgICAgICAgcGx1Y2soJ3Rva2VuT3B0aW9ucycpLFxyXG4gICAgICAgICAgICBjb25jYXRNYXA8R2V0VG9rZW5TaWxlbnRseU9wdGlvbnMsIE9ic2VydmFibGU8c3RyaW5nPj4oKCkgPT5cclxuICAgICAgICAgICAgICB0aGlzLmdldEFjY2Vzc1Rva2VuU2lsZW50bHkoKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmFsbG93QW5vbnltb3VzKHJvdXRlLCBlcnIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKCcnKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU3RhdGUuc2V0RXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBzd2l0Y2hNYXAoKHRva2VuOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAvLyBDbG9uZSB0aGUgcmVxdWVzdCBhbmQgYXR0YWNoIHRoZSBiZWFyZXIgdG9rZW5cclxuICAgICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRva2VuXHJcbiAgICAgICAgICAgICAgICA/IHJlcS5jbG9uZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnMuc2V0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYEJlYXJlciAke3Rva2VufWBcclxuICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgOiByZXE7XHJcblxyXG4gICAgICAgICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShjbG9uZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgICAgLy8gSWYgdGhlIFVSSSBiZWluZyBjYWxsZWQgd2FzIG5vdCBmb3VuZCBpbiBvdXIgaHR0cEludGVyY2VwdG9yIGNvbmZpZywgc2ltcGx5XHJcbiAgICAgICAgICAvLyBwYXNzIHRoZSByZXF1ZXN0IHRocm91Z2ggd2l0aG91dCBhdHRhY2hpbmcgYSB0b2tlblxyXG4gICAgICAgICAgbmV4dC5oYW5kbGUocmVxKVxyXG4gICAgICAgIClcclxuICAgICAgKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIER1cGxpY2F0ZSBvZiBBdXRoU2VydmljZS5nZXRBY2Nlc3NUb2tlblNpbGVudGx5LCBidXQgd2l0aCBhIHNsaWdodGx5IGRpZmZlcmVudCByZXR1cm4gJiBlcnJvciBoYW5kbGluZy5cclxuICAgKiBPbmx5IHVzZWQgaW50ZXJuYWxseSBpbiB0aGUgaW50ZXJjZXB0b3IuXHJcbiAgICpcclxuICAgKi9cclxuICBwcml2YXRlIGdldEFjY2Vzc1Rva2VuU2lsZW50bHkoKTogT2JzZXJ2YWJsZTxzdHJpbmc+IHtcclxuICAgIHJldHVybiBvZih0aGlzLmNsaWVudCkucGlwZShcclxuICAgICAgY29uY2F0TWFwKGFzeW5jIGNsaWVudCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIChhd2FpdCBjbGllbnQuZ2V0QWNjZXNzVG9rZW4oKSkgfHwgXCJcIjtcclxuICAgICAgfSksXHJcbiAgICAgIHRhcCgoYWNjZXNzX3Rva2VuKSA9PiB7XHJcbiAgICAgICAgaWYgKGFjY2Vzc190b2tlbilcclxuICAgICAgICAgIHJldHVybiB0aGlzLmF1dGhTdGF0ZS5zZXRBY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pXHJcbiAgICAgIH0pLCAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcImVycm9yXCIpO1xyXG4gICAgICAgIHRoaXMuYXV0aFN0YXRlLnJlZnJlc2goKTtcclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3RyaXBzIHRoZSBxdWVyeSBhbmQgZnJhZ21lbnQgZnJvbSB0aGUgZ2l2ZW4gdXJpXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXJpIFRoZSB1cmkgdG8gcmVtb3ZlIHRoZSBxdWVyeSBhbmQgZnJhZ21lbnQgZnJvbVxyXG4gICAqL1xyXG4gIHByaXZhdGUgc3RyaXBRdWVyeUZyb20odXJpOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgaWYgKHVyaS5pbmRleE9mKCc/JykgPiAtMSkge1xyXG4gICAgICB1cmkgPSB1cmkuc3Vic3RyKDAsIHVyaS5pbmRleE9mKCc/JykpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh1cmkuaW5kZXhPZignIycpID4gLTEpIHtcclxuICAgICAgdXJpID0gdXJpLnN1YnN0cigwLCB1cmkuaW5kZXhPZignIycpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdXJpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgcm91dGUgY2FuIGhhdmUgYW4gYWNjZXNzIHRva2VuIGF0dGFjaGVkIHRvIGl0LCBiYXNlZCBvbiBtYXRjaGluZyB0aGUgSFRUUCByZXF1ZXN0IGFnYWluc3RcclxuICAgKiB0aGUgaW50ZXJjZXB0b3Igcm91dGUgY29uZmlndXJhdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByb3V0ZSBUaGUgcm91dGUgdG8gdGVzdFxyXG4gICAqIEBwYXJhbSByZXF1ZXN0IFRoZSBIVFRQIHJlcXVlc3RcclxuICAgKi9cclxuICBwcml2YXRlIGNhbkF0dGFjaFRva2VuKFxyXG4gICAgcm91dGU6IEFwaVJvdXRlRGVmaW5pdGlvbixcclxuICAgIHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT5cclxuICApOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHRlc3RQcmltaXRpdmUgPSAodmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICBpZiAoIXZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCByZXF1ZXN0UGF0aCA9IHRoaXMuc3RyaXBRdWVyeUZyb20ocmVxdWVzdC51cmwpO1xyXG5cclxuICAgICAgaWYgKHZhbHVlID09PSByZXF1ZXN0UGF0aCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJZiB0aGUgVVJMIGVuZHMgd2l0aCBhbiBhc3RlcmlzaywgbWF0Y2ggdXNpbmcgc3RhcnRzV2l0aC5cclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICB2YWx1ZS5pbmRleE9mKCcqJykgPT09IHZhbHVlLmxlbmd0aCAtIDEgJiZcclxuICAgICAgICByZXF1ZXN0LnVybC5zdGFydHNXaXRoKHZhbHVlLnN1YnN0cigwLCB2YWx1ZS5sZW5ndGggLSAxKSlcclxuICAgICAgKTtcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGlzSHR0cEludGVyY2VwdG9yUm91dGVDb25maWcocm91dGUpKSB7XHJcbiAgICAgIGlmIChyb3V0ZS5odHRwTWV0aG9kICYmIHJvdXRlLmh0dHBNZXRob2QgIT09IHJlcXVlc3QubWV0aG9kKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgaWYgKCFyb3V0ZS51cmkgJiYgIXJvdXRlLnVyaU1hdGNoZXIpIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgICAnRWl0aGVyIGEgdXJpIG9yIHVyaU1hdGNoZXIgaXMgcmVxdWlyZWQgd2hlbiBjb25maWd1cmluZyB0aGUgSFRUUCBpbnRlcmNlcHRvci4nXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJvdXRlLnVyaU1hdGNoZXJcclxuICAgICAgICA/IHJvdXRlLnVyaU1hdGNoZXIocmVxdWVzdC51cmwpXHJcbiAgICAgICAgOiB0ZXN0UHJpbWl0aXZlKHJvdXRlLnVyaSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRlc3RQcmltaXRpdmUocm91dGUpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJpZXMgdG8gbWF0Y2ggYSByb3V0ZSBmcm9tIHRoZSBTREsgY29uZmlndXJhdGlvbiB0byB0aGUgSFRUUCByZXF1ZXN0LlxyXG4gICAqIElmIGEgbWF0Y2ggaXMgZm91bmQsIHRoZSByb3V0ZSBjb25maWd1cmF0aW9uIGlzIHJldHVybmVkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlcXVlc3QgVGhlIEh0dHAgcmVxdWVzdFxyXG4gICAqIEBwYXJhbSBjb25maWcgSHR0cEludGVyY2VwdG9yQ29uZmlnXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBmaW5kTWF0Y2hpbmdSb3V0ZShcclxuICAgIHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PGFueT4sXHJcbiAgICBjb25maWc6IEh0dHBJbnRlcmNlcHRvckNvbmZpZ1xyXG4gICk6IE9ic2VydmFibGU8QXBpUm91dGVEZWZpbml0aW9uIHwgbnVsbD4ge1xyXG4gICAgcmV0dXJuIGZyb20oY29uZmlnLmFsbG93ZWRMaXN0KS5waXBlKFxyXG4gICAgICBmaXJzdCgocm91dGUpID0+IHRoaXMuY2FuQXR0YWNoVG9rZW4ocm91dGUsIHJlcXVlc3QpLCBudWxsKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWxsb3dBbm9ueW1vdXMocm91dGU6IEFwaVJvdXRlRGVmaW5pdGlvbiB8IG51bGwsIGVycjogYW55KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAhIXJvdXRlICYmXHJcbiAgICAgIGlzSHR0cEludGVyY2VwdG9yUm91dGVDb25maWcocm91dGUpICYmXHJcbiAgICAgICEhcm91dGUuYWxsb3dBbm9ueW1vdXMgJiZcclxuICAgICAgWydsb2dpbl9yZXF1aXJlZCcsICdjb25zZW50X3JlcXVpcmVkJywgJ21pc3NpbmdfcmVmcmVzaF90b2tlbiddLmluY2x1ZGVzKFxyXG4gICAgICAgIGVyci5lcnJvclxyXG4gICAgICApXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=