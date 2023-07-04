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
AuthHttpInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthHttpInterceptor, deps: [{ token: i1.AuthClientConfig }, { token: ClientService }, { token: i2.AuthState }, { token: i3.AuthService }], target: i0.ɵɵFactoryTarget.Injectable });
AuthHttpInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthHttpInterceptor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthHttpInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.AuthClientConfig }, { type: i4.Client, decorators: [{
                    type: Inject,
                    args: [ClientService]
                }] }, { type: i2.AuthState }, { type: i3.AuthService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJjZXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2ludGVyY2VwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLE9BQU8sRUFBYyxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixHQUFHLEVBQ0gsTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsS0FBSyxHQUNOLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUVMLDRCQUE0QixFQUk3QixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQVUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDOzs7Ozs7QUFJakQsTUFBTSxTQUFTLEdBQ2IsQ0FBVSxPQUE0QixFQUFFLEVBQUUsQ0FDMUMsQ0FBVSxPQUE0QixFQUFFLEVBQUUsQ0FDeEMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRzNFLE1BQU0sT0FBTyxtQkFBbUI7SUFDOUIsWUFDVSxhQUErQixFQUNSLE1BQWMsRUFDckMsU0FBb0IsRUFDcEIsV0FBd0I7UUFIeEIsa0JBQWEsR0FBYixhQUFhLENBQWtCO1FBQ1IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNyQyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQy9CLENBQUM7SUFFSixTQUFTLENBQ1AsR0FBcUIsRUFDckIsSUFBaUI7UUFFakIsTUFBTSxN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SHR0cEludGVyY2VwdG9yLFxyXG4gIEh0dHBSZXF1ZXN0LFxyXG4gIEh0dHBIYW5kbGVyLFxyXG4gIEh0dHBFdmVudCxcclxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIGZyb20sIG9mLCBpaWYsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgc3dpdGNoTWFwLFxyXG4gIGZpcnN0LFxyXG4gIGNvbmNhdE1hcCxcclxuICBjYXRjaEVycm9yLFxyXG4gIHRhcCxcclxuICBmaWx0ZXIsXHJcbiAgbWVyZ2VNYXAsXHJcbiAgbWFwVG8sXHJcbiAgcGx1Y2ssXHJcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuaW1wb3J0IHtcclxuICBBcGlSb3V0ZURlZmluaXRpb24sXHJcbiAgaXNIdHRwSW50ZXJjZXB0b3JSb3V0ZUNvbmZpZyxcclxuICBBdXRoQ2xpZW50Q29uZmlnLFxyXG4gIEh0dHBJbnRlcmNlcHRvckNvbmZpZyxcclxuICBHZXRUb2tlbk9wdGlvbnNcclxufSBmcm9tICcuL2NvbmZpZyc7XHJcbmltcG9ydCB7IENsaWVudCwgQ2xpZW50U2VydmljZSB9IGZyb20gJy4vY2xpZW50JztcclxuaW1wb3J0IHsgQXV0aFN0YXRlIH0gZnJvbSAnLi9zdGF0ZSc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlJztcclxuXHJcbmNvbnN0IHdhaXRVbnRpbCA9XHJcbiAgPFRTaWduYWw+KHNpZ25hbCQ6IE9ic2VydmFibGU8VFNpZ25hbD4pID0+XHJcbiAgPFRTb3VyY2U+KHNvdXJjZSQ6IE9ic2VydmFibGU8VFNvdXJjZT4pID0+XHJcbiAgICBzb3VyY2UkLnBpcGUobWVyZ2VNYXAoKHZhbHVlKSA9PiBzaWduYWwkLnBpcGUoZmlyc3QoKSwgbWFwVG8odmFsdWUpKSkpO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXV0aEh0dHBJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGNvbmZpZ0ZhY3Rvcnk6IEF1dGhDbGllbnRDb25maWcsXHJcbiAgICBASW5qZWN0KENsaWVudFNlcnZpY2UpIHByaXZhdGUgY2xpZW50OiBDbGllbnQsXHJcbiAgICBwcml2YXRlIGF1dGhTdGF0ZTogQXV0aFN0YXRlLFxyXG4gICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2VcclxuICApIHt9XHJcblxyXG4gIGludGVyY2VwdChcclxuICAgIHJlcTogSHR0cFJlcXVlc3Q8YW55PixcclxuICAgIG5leHQ6IEh0dHBIYW5kbGVyXHJcbiAgKTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8YW55Pj4ge1xyXG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWdGYWN0b3J5LmdldCgpO1xyXG4gICAgaWYgKCFjb25maWcuaHR0cEludGVyY2VwdG9yPy5hbGxvd2VkTGlzdCkge1xyXG4gICAgICByZXR1cm4gbmV4dC5oYW5kbGUocmVxKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpc0xvYWRlZCQgPSB0aGlzLmF1dGhTZXJ2aWNlLmlzTG9hZGluZyQucGlwZShcclxuICAgICAgZmlsdGVyKChpc0xvYWRpbmcpID0+ICFpc0xvYWRpbmcpXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmZpbmRNYXRjaGluZ1JvdXRlKHJlcSwgY29uZmlnLmh0dHBJbnRlcmNlcHRvcikucGlwZShcclxuICAgICAgY29uY2F0TWFwKChyb3V0ZSkgPT5cclxuICAgICAgICBpaWYoXHJcbiAgICAgICAgICAvLyBDaGVjayBpZiBhIHJvdXRlIHdhcyBtYXRjaGVkXHJcbiAgICAgICAgICAoKSA9PiByb3V0ZSAhPT0gbnVsbCxcclxuICAgICAgICAgIC8vIElmIHdlIGhhdmUgYSBtYXRjaGluZyByb3V0ZSwgY2FsbCBnZXRUb2tlbiBhbmQgYXR0YWNoIHRoZSB0b2tlbiB0byB0aGVcclxuICAgICAgICAgIC8vIG91dGdvaW5nIHJlcXVlc3RcclxuICAgICAgICAgIG9mKHJvdXRlKS5waXBlKFxyXG4gICAgICAgICAgICB3YWl0VW50aWwoaXNMb2FkZWQkKSwgICAgICAgICAgXHJcbiAgICAgICAgICAgIHBsdWNrKCd0b2tlbk9wdGlvbnMnKSxcclxuICAgICAgICAgICAgY29uY2F0TWFwPEdldFRva2VuT3B0aW9ucywgT2JzZXJ2YWJsZTxzdHJpbmc+PigoKSA9PlxyXG4gICAgICAgICAgICAgIHRoaXMuZ2V0QWNjZXNzVG9rZW4oKS5waXBlKFxyXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmFsbG93QW5vbnltb3VzKHJvdXRlLCBlcnIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKCcnKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgdGhpcy5hdXRoU3RhdGUuc2V0RXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBzd2l0Y2hNYXAoKHRva2VuOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAvLyBDbG9uZSB0aGUgcmVxdWVzdCBhbmQgYXR0YWNoIHRoZSBiZWFyZXIgdG9rZW5cclxuICAgICAgICAgICAgICBjb25zdCBjbG9uZSA9IHRva2VuXHJcbiAgICAgICAgICAgICAgICA/IHJlcS5jbG9uZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogcmVxLmhlYWRlcnMuc2V0KFxyXG4gICAgICAgICAgICAgICAgICAgICAgJ0F1dGhvcml6YXRpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYEJlYXJlciAke3Rva2VufWBcclxuICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgOiByZXE7XHJcblxyXG4gICAgICAgICAgICAgIHJldHVybiBuZXh0LmhhbmRsZShjbG9uZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgICAgLy8gSWYgdGhlIFVSSSBiZWluZyBjYWxsZWQgd2FzIG5vdCBmb3VuZCBpbiBvdXIgaHR0cEludGVyY2VwdG9yIGNvbmZpZywgc2ltcGx5XHJcbiAgICAgICAgICAvLyBwYXNzIHRoZSByZXF1ZXN0IHRocm91Z2ggd2l0aG91dCBhdHRhY2hpbmcgYSB0b2tlblxyXG4gICAgICAgICAgbmV4dC5oYW5kbGUocmVxKVxyXG4gICAgICAgIClcclxuICAgICAgKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIER1cGxpY2F0ZSBvZiBBdXRoU2VydmljZS5nZXRBY2Nlc3NUb2tlbiwgYnV0IHdpdGggYSBzbGlnaHRseSBkaWZmZXJlbnQgcmV0dXJuICYgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICogT25seSB1c2VkIGludGVybmFsbHkgaW4gdGhlIGludGVyY2VwdG9yLlxyXG4gICAqXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXRBY2Nlc3NUb2tlbigpOiBPYnNlcnZhYmxlPHN0cmluZz4ge1xyXG4gICAgcmV0dXJuIG9mKHRoaXMuY2xpZW50KS5waXBlKFxyXG4gICAgICBjb25jYXRNYXAoYXN5bmMgY2xpZW50ID0+IHtcclxuICAgICAgICByZXR1cm4gKGF3YWl0IGNsaWVudC5nZXRBY2Nlc3NUb2tlbigpKSB8fCBcIlwiO1xyXG4gICAgICB9KSxcclxuICAgICAgdGFwKChhY2Nlc3NfdG9rZW4pID0+IHtcclxuICAgICAgICBpZiAoYWNjZXNzX3Rva2VuKVxyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuYXV0aFN0YXRlLnNldEFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbilcclxuICAgICAgfSksICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiZXJyb3JcIik7XHJcbiAgICAgICAgdGhpcy5hdXRoU3RhdGUucmVmcmVzaCgpO1xyXG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycm9yKTtcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdHJpcHMgdGhlIHF1ZXJ5IGFuZCBmcmFnbWVudCBmcm9tIHRoZSBnaXZlbiB1cmlcclxuICAgKlxyXG4gICAqIEBwYXJhbSB1cmkgVGhlIHVyaSB0byByZW1vdmUgdGhlIHF1ZXJ5IGFuZCBmcmFnbWVudCBmcm9tXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzdHJpcFF1ZXJ5RnJvbSh1cmk6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBpZiAodXJpLmluZGV4T2YoJz8nKSA+IC0xKSB7XHJcbiAgICAgIHVyaSA9IHVyaS5zdWJzdHIoMCwgdXJpLmluZGV4T2YoJz8nKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHVyaS5pbmRleE9mKCcjJykgPiAtMSkge1xyXG4gICAgICB1cmkgPSB1cmkuc3Vic3RyKDAsIHVyaS5pbmRleE9mKCcjJykpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB1cmk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHNwZWNpZmllZCByb3V0ZSBjYW4gaGF2ZSBhbiBhY2Nlc3MgdG9rZW4gYXR0YWNoZWQgdG8gaXQsIGJhc2VkIG9uIG1hdGNoaW5nIHRoZSBIVFRQIHJlcXVlc3QgYWdhaW5zdFxyXG4gICAqIHRoZSBpbnRlcmNlcHRvciByb3V0ZSBjb25maWd1cmF0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJvdXRlIFRoZSByb3V0ZSB0byB0ZXN0XHJcbiAgICogQHBhcmFtIHJlcXVlc3QgVGhlIEhUVFAgcmVxdWVzdFxyXG4gICAqL1xyXG4gIHByaXZhdGUgY2FuQXR0YWNoVG9rZW4oXHJcbiAgICByb3V0ZTogQXBpUm91dGVEZWZpbml0aW9uLFxyXG4gICAgcmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PlxyXG4gICk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgdGVzdFByaW1pdGl2ZSA9ICh2YWx1ZTogc3RyaW5nIHwgdW5kZWZpbmVkKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgIGlmICghdmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHJlcXVlc3RQYXRoID0gdGhpcy5zdHJpcFF1ZXJ5RnJvbShyZXF1ZXN0LnVybCk7XHJcblxyXG4gICAgICBpZiAodmFsdWUgPT09IHJlcXVlc3RQYXRoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIHRoZSBVUkwgZW5kcyB3aXRoIGFuIGFzdGVyaXNrLCBtYXRjaCB1c2luZyBzdGFydHNXaXRoLlxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHZhbHVlLmluZGV4T2YoJyonKSA9PT0gdmFsdWUubGVuZ3RoIC0gMSAmJlxyXG4gICAgICAgIHJlcXVlc3QudXJsLnN0YXJ0c1dpdGgodmFsdWUuc3Vic3RyKDAsIHZhbHVlLmxlbmd0aCAtIDEpKVxyXG4gICAgICApO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoaXNIdHRwSW50ZXJjZXB0b3JSb3V0ZUNvbmZpZyhyb3V0ZSkpIHtcclxuICAgICAgaWYgKHJvdXRlLmh0dHBNZXRob2QgJiYgcm91dGUuaHR0cE1ldGhvZCAhPT0gcmVxdWVzdC5tZXRob2QpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICBpZiAoIXJvdXRlLnVyaSAmJiAhcm91dGUudXJpTWF0Y2hlcikge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICAgICdFaXRoZXIgYSB1cmkgb3IgdXJpTWF0Y2hlciBpcyByZXF1aXJlZCB3aGVuIGNvbmZpZ3VyaW5nIHRoZSBIVFRQIGludGVyY2VwdG9yLidcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcm91dGUudXJpTWF0Y2hlclxyXG4gICAgICAgID8gcm91dGUudXJpTWF0Y2hlcihyZXF1ZXN0LnVybClcclxuICAgICAgICA6IHRlc3RQcmltaXRpdmUocm91dGUudXJpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGVzdFByaW1pdGl2ZShyb3V0ZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUcmllcyB0byBtYXRjaCBhIHJvdXRlIGZyb20gdGhlIFNESyBjb25maWd1cmF0aW9uIHRvIHRoZSBIVFRQIHJlcXVlc3QuXHJcbiAgICogSWYgYSBtYXRjaCBpcyBmb3VuZCwgdGhlIHJvdXRlIGNvbmZpZ3VyYXRpb24gaXMgcmV0dXJuZWQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVxdWVzdCBUaGUgSHR0cCByZXF1ZXN0XHJcbiAgICogQHBhcmFtIGNvbmZpZyBIdHRwSW50ZXJjZXB0b3JDb25maWdcclxuICAgKi9cclxuICBwcml2YXRlIGZpbmRNYXRjaGluZ1JvdXRlKFxyXG4gICAgcmVxdWVzdDogSHR0cFJlcXVlc3Q8YW55PixcclxuICAgIGNvbmZpZzogSHR0cEludGVyY2VwdG9yQ29uZmlnXHJcbiAgKTogT2JzZXJ2YWJsZTxBcGlSb3V0ZURlZmluaXRpb24gfCBudWxsPiB7XHJcbiAgICByZXR1cm4gZnJvbShjb25maWcuYWxsb3dlZExpc3QpLnBpcGUoXHJcbiAgICAgIGZpcnN0KChyb3V0ZSkgPT4gdGhpcy5jYW5BdHRhY2hUb2tlbihyb3V0ZSwgcmVxdWVzdCksIG51bGwpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhbGxvd0Fub255bW91cyhyb3V0ZTogQXBpUm91dGVEZWZpbml0aW9uIHwgbnVsbCwgZXJyOiBhbnkpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICEhcm91dGUgJiZcclxuICAgICAgaXNIdHRwSW50ZXJjZXB0b3JSb3V0ZUNvbmZpZyhyb3V0ZSkgJiZcclxuICAgICAgISFyb3V0ZS5hbGxvd0Fub255bW91cyAmJlxyXG4gICAgICBbJ2xvZ2luX3JlcXVpcmVkJywgJ2NvbnNlbnRfcmVxdWlyZWQnLCAnbWlzc2luZ19yZWZyZXNoX3Rva2VuJ10uaW5jbHVkZXMoXHJcbiAgICAgICAgZXJyLmVycm9yXHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiJdfQ==