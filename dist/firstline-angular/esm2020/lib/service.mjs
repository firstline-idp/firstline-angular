import { Injectable, Inject } from '@angular/core'; // do not remove Inject import!!
import { of, from, Subject, ReplaySubject, throwError, } from 'rxjs';
import { concatMap, tap, catchError } from 'rxjs/operators';
import { ClientService } from './client'; // do not remove ClientService import!!
import * as i0 from "@angular/core";
import * as i1 from "./state";
import * as i2 from "./client";
;
export class AuthService {
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
AuthService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthService, deps: [{ token: ClientService }, { token: i1.AuthState }], target: i0.ɵɵFactoryTarget.Injectable });
AuthService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: AuthService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i2.Client, decorators: [{
                    type: Inject,
                    args: [ClientService]
                }] }, { type: i1.AuthState }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFhLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQyxDQUFFLGdDQUFnQztBQUVoRyxPQUFPLEVBQ0wsRUFBRSxFQUNGLElBQUksRUFDSixPQUFPLEVBRVAsYUFBYSxFQUNiLFVBQVUsR0FDWCxNQUFNLE1BQU0sQ0FBQztBQUNkLE9BQU8sRUFDTCxTQUFTLEVBQ1QsR0FBRyxFQUNILFVBQVUsRUFDWCxNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBVSxhQUFhLEVBQUcsTUFBTSxVQUFVLENBQUMsQ0FBRSx1Q0FBdUM7Ozs7QUFJZCxDQUFDO0FBSzlFLE1BQU0sT0FBTyxXQUFXO0lBaUN0QixZQUNpQyxNQUFjLEVBQ3JDLFNBQW9CO1FBREcsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNyQyxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBakN0QixxQkFBZ0IsR0FBRyxJQUFJLGFBQWEsQ0FBWSxDQUFDLENBQUMsQ0FBQztRQUUzRCx1Q0FBdUM7UUFDL0IsbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQzdDOztXQUVHO1FBQ00sZUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1FBRWhEOzs7V0FHRztRQUNNLHFCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUM7UUFFNUQ7O1dBRUc7UUFDTSxVQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFFdEM7O1dBRUc7UUFDTSxXQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFFeEM7OztXQUdHO1FBQ00sY0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQU14RCxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRTthQUN6QixJQUFJLEVBQUU7YUFDTixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7YUFDckIsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsV0FBVztRQUNULHVDQUF1QztRQUN2QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILGlCQUFpQixDQUNmLE9BQWtDO1FBRWxDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUVILE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0gsY0FBYztRQUNaLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQ3pCLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUM1QyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFBRTtZQUNuQixJQUFJLFlBQVk7Z0JBQ2QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsRUFDRixVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3pCLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDOzt3R0F0R1UsV0FBVyxrQkFrQ1osYUFBYTs0R0FsQ1osV0FBVyxjQUZWLE1BQU07MkZBRVAsV0FBVztrQkFIdkIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OzBCQW1DSSxNQUFNOzJCQUFDLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPbkRlc3Ryb3ksIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnOyAgLy8gZG8gbm90IHJlbW92ZSBJbmplY3QgaW1wb3J0ISFcclxuaW1wb3J0IHsgTG9naW5SZWRpcmVjdE9wdGlvbnMgYXMgTG9naW5SZWRpcmVjdE9wdGlvbnNTUEEgfSBmcm9tIFwiQGZpcnN0LWxpbmUvZmlyc3RsaW5lLXNwYS1qc1wiO1xyXG5pbXBvcnQge1xyXG4gIG9mLFxyXG4gIGZyb20sXHJcbiAgU3ViamVjdCxcclxuICBPYnNlcnZhYmxlLFxyXG4gIFJlcGxheVN1YmplY3QsXHJcbiAgdGhyb3dFcnJvcixcclxufSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtcclxuICBjb25jYXRNYXAsXHJcbiAgdGFwLFxyXG4gIGNhdGNoRXJyb3JcclxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5pbXBvcnQgeyBDbGllbnQsIENsaWVudFNlcnZpY2UgIH0gZnJvbSAnLi9jbGllbnQnOyAgLy8gZG8gbm90IHJlbW92ZSBDbGllbnRTZXJ2aWNlIGltcG9ydCEhXHJcbmltcG9ydCB7IEFwcFN0YXRlIH0gZnJvbSAnLi9jb25maWcnO1xyXG5pbXBvcnQgeyBBdXRoU3RhdGUgfSBmcm9tICcuL3N0YXRlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTG9naW5XaXRoUmVkaXJlY3RPcHRpb25zIGV4dGVuZHMgTG9naW5SZWRpcmVjdE9wdGlvbnNTUEEgeyB9O1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290JyxcclxufSlcclxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlPFRBcHBTdGF0ZSBleHRlbmRzIEFwcFN0YXRlID0gQXBwU3RhdGU+XHJcbiAgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xyXG4gIHByaXZhdGUgYXBwU3RhdGVTdWJqZWN0JCA9IG5ldyBSZXBsYXlTdWJqZWN0PFRBcHBTdGF0ZT4oMSk7XHJcblxyXG4gIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80MTE3NzE2M1xyXG4gIHByaXZhdGUgbmdVbnN1YnNjcmliZSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xyXG4gIC8qKlxyXG4gICAqIEVtaXRzIGJvb2xlYW4gdmFsdWVzIGluZGljYXRpbmcgdGhlIGxvYWRpbmcgc3RhdGUgb2YgdGhlIFNESy5cclxuICAgKi9cclxuICByZWFkb25seSBpc0xvYWRpbmckID0gdGhpcy5hdXRoU3RhdGUuaXNMb2FkaW5nJDtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHMgYm9vbGVhbiB2YWx1ZXMgaW5kaWNhdGluZyB0aGUgYXV0aGVudGljYXRpb24gc3RhdGUgb2YgdGhlIHVzZXIuIElmIGB0cnVlYCwgaXQgbWVhbnMgYSB1c2VyIGhhcyBhdXRoZW50aWNhdGVkLlxyXG4gICAqIFRoaXMgZGVwZW5kcyBvbiB0aGUgdmFsdWUgb2YgYGlzTG9hZGluZyRgLCBzbyB0aGVyZSBpcyBubyBuZWVkIHRvIG1hbnVhbGx5IGNoZWNrIHRoZSBsb2FkaW5nIHN0YXRlIG9mIHRoZSBTREsuXHJcbiAgICovXHJcbiAgcmVhZG9ubHkgaXNBdXRoZW50aWNhdGVkJCA9IHRoaXMuYXV0aFN0YXRlLmlzQXV0aGVudGljYXRlZCQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXRzIGRldGFpbHMgYWJvdXQgdGhlIGF1dGhlbnRpY2F0ZWQgdXNlciwgb3IgbnVsbCBpZiBub3QgYXV0aGVudGljYXRlZC5cclxuICAgKi9cclxuICByZWFkb25seSB1c2VyJCA9IHRoaXMuYXV0aFN0YXRlLnVzZXIkO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0cyBlcnJvcnMgdGhhdCBvY2N1ciBkdXJpbmcgbG9naW4sIG9yIHdoZW4gY2hlY2tpbmcgZm9yIGFuIGFjdGl2ZSBzZXNzaW9uIG9uIHN0YXJ0dXAuXHJcbiAgICovXHJcbiAgcmVhZG9ubHkgZXJyb3IkID0gdGhpcy5hdXRoU3RhdGUuZXJyb3IkO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0cyB0aGUgdmFsdWUgKGlmIGFueSkgdGhhdCB3YXMgcGFzc2VkIHRvIHRoZSBgbG9naW5XaXRoUmVkaXJlY3RgIG1ldGhvZCBjYWxsXHJcbiAgICogYnV0IG9ubHkgKiphZnRlcioqIGBoYW5kbGVSZWRpcmVjdENhbGxiYWNrYCBpcyBmaXJzdCBjYWxsZWRcclxuICAgKi9cclxuICByZWFkb25seSBhcHBTdGF0ZSQgPSB0aGlzLmFwcFN0YXRlU3ViamVjdCQuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgQEluamVjdChDbGllbnRTZXJ2aWNlKSBwcml2YXRlIGNsaWVudDogQ2xpZW50LFxyXG4gICAgcHJpdmF0ZSBhdXRoU3RhdGU6IEF1dGhTdGF0ZVxyXG4gICkge1xyXG4gICAgdGhpcy5jbGllbnQuZ2V0QWNjZXNzVG9rZW4oKVxyXG4gICAgICAudGhlbigpXHJcbiAgICAgIC5jYXRjaChlID0+IHVuZGVmaW5lZClcclxuICAgICAgLmZpbmFsbHkoKCkgPT4gdGhpcy5hdXRoU3RhdGUuc2V0SXNMb2FkaW5nKGZhbHNlKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDYWxsZWQgd2hlbiB0aGUgc2VydmljZSBpcyBkZXN0cm95ZWRcclxuICAgKi9cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80MTE3NzE2M1xyXG4gICAgdGhpcy5uZ1Vuc3Vic2NyaWJlJC5uZXh0KCk7XHJcbiAgICB0aGlzLm5nVW5zdWJzY3JpYmUkLmNvbXBsZXRlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBgYGBqc1xyXG4gICAqIGxvZ2luV2l0aFJlZGlyZWN0KG9wdGlvbnMpO1xyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogUGVyZm9ybXMgYSBsb2dpbiB2aWEgcmVkaXJlY3RcclxuICAgKi9cclxuICBsb2dpbldpdGhSZWRpcmVjdChcclxuICAgIG9wdGlvbnM/OiBMb2dpbldpdGhSZWRpcmVjdE9wdGlvbnNcclxuICApOiBPYnNlcnZhYmxlPHZvaWQ+IHtcclxuICAgIHJldHVybiBmcm9tKHRoaXMuY2xpZW50LmxvZ2luUmVkaXJlY3Qob3B0aW9ucykpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYGBganNcclxuICAgKiBsb2dvdXQoKTtcclxuICAgKiBgYGBcclxuICAgKlxyXG4gICAqIENsZWFycyB0aGUgYXBwbGljYXRpb24gc2Vzc2lvbiBhbmQgc2lnbmVzIG91dCB0aGUgdXNlci5cclxuICAgKi9cclxuXHJcbiAgbG9nb3V0KCk6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgcmV0dXJuIGZyb20odGhpcy5jbGllbnQubG9nb3V0KCkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYGBganNcclxuICAgKiBnZXRBY2Nlc3NUb2tlbigpLnN1YnNjcmliZSh0b2tlbiA9PiAuLi4pXHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBJZiB0aGVyZSdzIGEgdmFsaWQgdG9rZW4gc3RvcmVkLCByZXR1cm4gaXQuIE90aGVyd2lzZSwgb3BlbnMgYW5cclxuICAgKiBpZnJhbWUgd2l0aCB0aGUgYC9hdXRob3JpemVgIFVSTCB1c2luZyB0aGUgcGFyYW1ldGVycyBwcm92aWRlZFxyXG4gICAqIGFzIGFyZ3VtZW50cy4gUmFuZG9tIGFuZCBzZWN1cmUgYHN0YXRlYCBhbmQgYG5vbmNlYCBwYXJhbWV0ZXJzXHJcbiAgICogd2lsbCBiZSBhdXRvLWdlbmVyYXRlZC4gSWYgdGhlIHJlc3BvbnNlIGlzIHN1Y2Nlc3NmdWwsIHJlc3VsdHNcclxuICAgKiB3aWxsIGJlIHZhbGlkIGFjY29yZGluZyB0byB0aGVpciBleHBpcmF0aW9uIHRpbWVzLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZ2V0QWNjZXNzVG9rZW4oKTogT2JzZXJ2YWJsZTxzdHJpbmcgfCBudWxsPiB7XHJcbiAgICByZXR1cm4gb2YodGhpcy5jbGllbnQpLnBpcGUoXHJcbiAgICAgIGNvbmNhdE1hcChjbGllbnQgPT4gY2xpZW50LmdldEFjY2Vzc1Rva2VuKCkpLFxyXG4gICAgICB0YXAoKGFjY2Vzc190b2tlbikgPT4ge1xyXG4gICAgICAgIGlmIChhY2Nlc3NfdG9rZW4pXHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5hdXRoU3RhdGUuc2V0QWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKTtcclxuICAgICAgfSksXHJcbiAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XHJcbiAgICAgICAgdGhpcy5hdXRoU3RhdGUuc2V0RXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIHRoaXMuYXV0aFN0YXRlLnJlZnJlc2goKTtcclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=