import { Injectable, Inject } from '@angular/core';
import { of, from, Subject, ReplaySubject, throwError, } from 'rxjs';
import { concatMap, tap, catchError } from 'rxjs/operators';
import { ClientService } from './client';
import * as i0 from "@angular/core";
import * as i1 from "./state";
import * as i2 from "./client";
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
         * Emits the value (if any) that was passed to the `loginRedirect` method call
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
     * loginRedirect();
     * ```
     *
     * Performs a redirect
     */
    loginRedirect() {
        return from(this.client.loginRedirect());
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
    getAccessTokenSilently() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBYSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQ0wsRUFBRSxFQUNGLElBQUksRUFDSixPQUFPLEVBRVAsYUFBYSxFQUNiLFVBQVUsR0FDWCxNQUFNLE1BQU0sQ0FBQztBQUNkLE9BQU8sRUFDTCxTQUFTLEVBQ1QsR0FBRyxFQUNILFVBQVUsRUFDWCxNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE9BQU8sRUFBVSxhQUFhLEVBQUUsTUFBTSxVQUFVLENBQUM7Ozs7QUFPakQsTUFBTSxPQUFPLFdBQVc7SUFpQ3RCLFlBQ2lDLE1BQWMsRUFDckMsU0FBb0I7UUFERyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ3JDLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFqQ3RCLHFCQUFnQixHQUFHLElBQUksYUFBYSxDQUFZLENBQUMsQ0FBQyxDQUFDO1FBRTNELHVDQUF1QztRQUMvQixtQkFBYyxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDN0M7O1dBRUc7UUFDTSxlQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFFaEQ7OztXQUdHO1FBQ00scUJBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUU1RDs7V0FFRztRQUNNLFVBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztRQUV0Qzs7V0FFRztRQUNNLFdBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUV4Qzs7O1dBR0c7UUFDTSxjQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBTXhELElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFO2FBQ3pCLElBQUksRUFBRTthQUNOLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQzthQUNyQixPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxXQUFXO1FBQ1QsdUNBQXVDO1FBQ3ZDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsYUFBYTtRQUNYLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBRUgsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxzQkFBc0I7UUFDcEIsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FDekIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQzVDLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO1lBQ25CLElBQUksWUFBWTtnQkFDZCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxFQUNGLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDekIsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7O3dHQXBHVSxXQUFXLGtCQWtDWixhQUFhOzRHQWxDWixXQUFXLGNBRlYsTUFBTTsyRkFFUCxXQUFXO2tCQUh2QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7MEJBbUNJLE1BQU07MkJBQUMsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEV4Y2hhbmdlQ29kZVJlc3BvbnNlIH0gZnJvbSBcIkBmaXJzdC1saW5lL2ZpcnN0bGluZS1zcGEtanNcIjtcclxuaW1wb3J0IHtcclxuICBvZixcclxuICBmcm9tLFxyXG4gIFN1YmplY3QsXHJcbiAgT2JzZXJ2YWJsZSxcclxuICBSZXBsYXlTdWJqZWN0LFxyXG4gIHRocm93RXJyb3IsXHJcbn0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7XHJcbiAgY29uY2F0TWFwLFxyXG4gIHRhcCxcclxuICBjYXRjaEVycm9yXHJcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuaW1wb3J0IHsgQ2xpZW50LCBDbGllbnRTZXJ2aWNlIH0gZnJvbSAnLi9jbGllbnQnO1xyXG5pbXBvcnQgeyBBcHBTdGF0ZSB9IGZyb20gJy4vY29uZmlnJztcclxuaW1wb3J0IHsgQXV0aFN0YXRlIH0gZnJvbSAnLi9zdGF0ZSc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQXV0aFNlcnZpY2U8VEFwcFN0YXRlIGV4dGVuZHMgQXBwU3RhdGUgPSBBcHBTdGF0ZT5cclxuICBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XHJcbiAgcHJpdmF0ZSBhcHBTdGF0ZVN1YmplY3QkID0gbmV3IFJlcGxheVN1YmplY3Q8VEFwcFN0YXRlPigxKTtcclxuXHJcbiAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQxMTc3MTYzXHJcbiAgcHJpdmF0ZSBuZ1Vuc3Vic2NyaWJlJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XHJcbiAgLyoqXHJcbiAgICogRW1pdHMgYm9vbGVhbiB2YWx1ZXMgaW5kaWNhdGluZyB0aGUgbG9hZGluZyBzdGF0ZSBvZiB0aGUgU0RLLlxyXG4gICAqL1xyXG4gIHJlYWRvbmx5IGlzTG9hZGluZyQgPSB0aGlzLmF1dGhTdGF0ZS5pc0xvYWRpbmckO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0cyBib29sZWFuIHZhbHVlcyBpbmRpY2F0aW5nIHRoZSBhdXRoZW50aWNhdGlvbiBzdGF0ZSBvZiB0aGUgdXNlci4gSWYgYHRydWVgLCBpdCBtZWFucyBhIHVzZXIgaGFzIGF1dGhlbnRpY2F0ZWQuXHJcbiAgICogVGhpcyBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBvZiBgaXNMb2FkaW5nJGAsIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gbWFudWFsbHkgY2hlY2sgdGhlIGxvYWRpbmcgc3RhdGUgb2YgdGhlIFNESy5cclxuICAgKi9cclxuICByZWFkb25seSBpc0F1dGhlbnRpY2F0ZWQkID0gdGhpcy5hdXRoU3RhdGUuaXNBdXRoZW50aWNhdGVkJDtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHMgZGV0YWlscyBhYm91dCB0aGUgYXV0aGVudGljYXRlZCB1c2VyLCBvciBudWxsIGlmIG5vdCBhdXRoZW50aWNhdGVkLlxyXG4gICAqL1xyXG4gIHJlYWRvbmx5IHVzZXIkID0gdGhpcy5hdXRoU3RhdGUudXNlciQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXRzIGVycm9ycyB0aGF0IG9jY3VyIGR1cmluZyBsb2dpbiwgb3Igd2hlbiBjaGVja2luZyBmb3IgYW4gYWN0aXZlIHNlc3Npb24gb24gc3RhcnR1cC5cclxuICAgKi9cclxuICByZWFkb25seSBlcnJvciQgPSB0aGlzLmF1dGhTdGF0ZS5lcnJvciQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIEVtaXRzIHRoZSB2YWx1ZSAoaWYgYW55KSB0aGF0IHdhcyBwYXNzZWQgdG8gdGhlIGBsb2dpblJlZGlyZWN0YCBtZXRob2QgY2FsbFxyXG4gICAqIGJ1dCBvbmx5ICoqYWZ0ZXIqKiBgaGFuZGxlUmVkaXJlY3RDYWxsYmFja2AgaXMgZmlyc3QgY2FsbGVkXHJcbiAgICovXHJcbiAgcmVhZG9ubHkgYXBwU3RhdGUkID0gdGhpcy5hcHBTdGF0ZVN1YmplY3QkLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIEBJbmplY3QoQ2xpZW50U2VydmljZSkgcHJpdmF0ZSBjbGllbnQ6IENsaWVudCxcclxuICAgIHByaXZhdGUgYXV0aFN0YXRlOiBBdXRoU3RhdGVcclxuICApIHtcclxuICAgIHRoaXMuY2xpZW50LmdldEFjY2Vzc1Rva2VuKClcclxuICAgICAgLnRoZW4oKVxyXG4gICAgICAuY2F0Y2goZSA9PiB1bmRlZmluZWQpXHJcbiAgICAgIC5maW5hbGx5KCgpID0+IHRoaXMuYXV0aFN0YXRlLnNldElzTG9hZGluZyhmYWxzZSkpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHNlcnZpY2UgaXMgZGVzdHJveWVkXHJcbiAgICovXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDExNzcxNjNcclxuICAgIHRoaXMubmdVbnN1YnNjcmliZSQubmV4dCgpO1xyXG4gICAgdGhpcy5uZ1Vuc3Vic2NyaWJlJC5jb21wbGV0ZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYGBganNcclxuICAgKiBsb2dpblJlZGlyZWN0KCk7XHJcbiAgICogYGBgXHJcbiAgICpcclxuICAgKiBQZXJmb3JtcyBhIHJlZGlyZWN0XHJcbiAgICovXHJcbiAgbG9naW5SZWRpcmVjdCgpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcclxuICAgIHJldHVybiBmcm9tKHRoaXMuY2xpZW50LmxvZ2luUmVkaXJlY3QoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBgYGBqc1xyXG4gICAqIGxvZ291dCgpO1xyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogQ2xlYXJzIHRoZSBhcHBsaWNhdGlvbiBzZXNzaW9uIGFuZCBzaWduZXMgb3V0IHRoZSB1c2VyLlxyXG4gICAqL1xyXG5cclxuICBsb2dvdXQoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gZnJvbSh0aGlzLmNsaWVudC5sb2dvdXQoKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBgYGBqc1xyXG4gICAqIGdldEFjY2Vzc1Rva2VuU2lsZW50bHkoKS5zdWJzY3JpYmUodG9rZW4gPT4gLi4uKVxyXG4gICAqIGBgYFxyXG4gICAqXHJcbiAgICogSWYgdGhlcmUncyBhIHZhbGlkIHRva2VuIHN0b3JlZCwgcmV0dXJuIGl0LiBPdGhlcndpc2UsIG9wZW5zIGFuXHJcbiAgICogaWZyYW1lIHdpdGggdGhlIGAvYXV0aG9yaXplYCBVUkwgdXNpbmcgdGhlIHBhcmFtZXRlcnMgcHJvdmlkZWRcclxuICAgKiBhcyBhcmd1bWVudHMuIFJhbmRvbSBhbmQgc2VjdXJlIGBzdGF0ZWAgYW5kIGBub25jZWAgcGFyYW1ldGVyc1xyXG4gICAqIHdpbGwgYmUgYXV0by1nZW5lcmF0ZWQuIElmIHRoZSByZXNwb25zZSBpcyBzdWNjZXNzZnVsLCByZXN1bHRzXHJcbiAgICogd2lsbCBiZSB2YWxpZCBhY2NvcmRpbmcgdG8gdGhlaXIgZXhwaXJhdGlvbiB0aW1lcy5cclxuICAgKlxyXG4gICAqL1xyXG4gIGdldEFjY2Vzc1Rva2VuU2lsZW50bHkoKTogT2JzZXJ2YWJsZTxzdHJpbmcgfCBudWxsPiB7XHJcbiAgICByZXR1cm4gb2YodGhpcy5jbGllbnQpLnBpcGUoXHJcbiAgICAgIGNvbmNhdE1hcChjbGllbnQgPT4gY2xpZW50LmdldEFjY2Vzc1Rva2VuKCkpLFxyXG4gICAgICB0YXAoKGFjY2Vzc190b2tlbikgPT4ge1xyXG4gICAgICAgIGlmIChhY2Nlc3NfdG9rZW4pXHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5hdXRoU3RhdGUuc2V0QWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKTtcclxuICAgICAgfSksXHJcbiAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XHJcbiAgICAgICAgdGhpcy5hdXRoU3RhdGUuc2V0RXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIHRoaXMuYXV0aFN0YXRlLnJlZnJlc2goKTtcclxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnJvcik7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=