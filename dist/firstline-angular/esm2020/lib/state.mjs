import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, defer, merge, of, ReplaySubject, Subject, } from 'rxjs';
import { concatMap, distinctUntilChanged, filter, mergeMap, scan, shareReplay, switchMap, } from 'rxjs/operators';
import { ClientService } from './client';
import * as i0 from "@angular/core";
import * as i1 from "./client";
/**
 * Tracks the Authentication State for the SDK
 */
export class AuthState {
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
        }], ctorParameters: function () { return [{ type: i1.Client, decorators: [{
                    type: Inject,
                    args: [ClientService]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3N0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFDTCxlQUFlLEVBQ2YsS0FBSyxFQUNMLEtBQUssRUFDTCxFQUFFLEVBQ0YsYUFBYSxFQUNiLE9BQU8sR0FDUixNQUFNLE1BQU0sQ0FBQztBQUNkLE9BQU8sRUFDTCxTQUFTLEVBQ1Qsb0JBQW9CLEVBQ3BCLE1BQU0sRUFDTixRQUFRLEVBQ1IsSUFBSSxFQUNKLFdBQVcsRUFDWCxTQUFTLEdBQ1YsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQVUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDOzs7QUFFakQ7O0dBRUc7QUFFSCxNQUFNLE9BQU8sU0FBUztJQTZFcEIsWUFBMkMsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUE1RWpELHNCQUFpQixHQUFHLElBQUksZUFBZSxDQUFVLElBQUksQ0FBQyxDQUFDO1FBQ3ZELGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQy9CLGlCQUFZLEdBQUcsSUFBSSxhQUFhLENBQVMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsa0JBQWEsR0FBRyxJQUFJLGFBQWEsQ0FBUSxDQUFDLENBQUMsQ0FBQztRQUVwRDs7V0FFRztRQUNhLGVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFbkU7OztXQUdHO1FBQ0ssd0JBQW1CLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQ2xELElBQUksQ0FDRixDQUNFLEdBQXdELEVBQ3hELE9BQXNCLEVBQ3RCLEVBQUUsQ0FBQyxDQUFDO1lBQ0osUUFBUSxFQUFFLEdBQUcsQ0FBQyxPQUFPO1lBQ3JCLE9BQU87U0FDUixDQUFDLEVBQ0YsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FDbEMsRUFDRCxNQUFNLENBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUN4RCxDQUFDO1FBRUY7Ozs7V0FJRztRQUNjLDRCQUF1QixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUM3RCxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQzdCLG9CQUFvQixFQUFFLEVBQ3RCLFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDYixxRUFBcUU7UUFDckUsdUJBQXVCO1FBQ3ZCLDBHQUEwRztRQUMxRyxzRkFBc0Y7UUFDdEYsNENBQTRDO1FBQzVDLEtBQUssQ0FDSCxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxFQUMxQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUMzQixRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUM5QyxFQUNELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FDbEUsQ0FDRixDQUNGLENBQUM7UUFFRjs7O1dBR0c7UUFDTSxxQkFBZ0IsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUMzRCxvQkFBb0IsRUFBRSxFQUN0QixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQ2YsQ0FBQztRQUVGOztXQUVHO1FBQ00sVUFBSyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQ2hELFNBQVMsQ0FBQyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQzFCLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUNoRCxFQUNELG9CQUFvQixFQUFFLENBQ3ZCLENBQUM7UUFFRjs7V0FFRztRQUNhLFdBQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBRUMsQ0FBQztJQUU3RDs7OztPQUlHO0lBQ0ksWUFBWSxDQUFDLFNBQWtCO1FBQ3BDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLE9BQU87UUFDWixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksY0FBYyxDQUFDLFdBQW1CO1FBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksUUFBUSxDQUFDLEtBQVU7UUFDeEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQzs7c0dBaEhVLFNBQVMsa0JBNkVBLGFBQWE7MEdBN0V0QixTQUFTLGNBREksTUFBTTsyRkFDbkIsU0FBUztrQkFEckIsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7OzBCQThFbkIsTUFBTTsyQkFBQyxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgQmVoYXZpb3JTdWJqZWN0LFxyXG4gIGRlZmVyLFxyXG4gIG1lcmdlLFxyXG4gIG9mLFxyXG4gIFJlcGxheVN1YmplY3QsXHJcbiAgU3ViamVjdCxcclxufSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtcclxuICBjb25jYXRNYXAsXHJcbiAgZGlzdGluY3RVbnRpbENoYW5nZWQsXHJcbiAgZmlsdGVyLFxyXG4gIG1lcmdlTWFwLFxyXG4gIHNjYW4sXHJcbiAgc2hhcmVSZXBsYXksXHJcbiAgc3dpdGNoTWFwLFxyXG59IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmltcG9ydCB7IENsaWVudCwgQ2xpZW50U2VydmljZSB9IGZyb20gJy4vY2xpZW50JztcclxuXHJcbi8qKlxyXG4gKiBUcmFja3MgdGhlIEF1dGhlbnRpY2F0aW9uIFN0YXRlIGZvciB0aGUgU0RLXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgQXV0aFN0YXRlIHtcclxuICBwcml2YXRlIGlzTG9hZGluZ1N1YmplY3QkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPih0cnVlKTtcclxuICBwcml2YXRlIHJlZnJlc2gkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcclxuICBwcml2YXRlIGFjY2Vzc1Rva2VuJCA9IG5ldyBSZXBsYXlTdWJqZWN0PHN0cmluZz4oMSk7XHJcbiAgcHJpdmF0ZSBlcnJvclN1YmplY3QkID0gbmV3IFJlcGxheVN1YmplY3Q8RXJyb3I+KDEpO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0cyBib29sZWFuIHZhbHVlcyBpbmRpY2F0aW5nIHRoZSBsb2FkaW5nIHN0YXRlIG9mIHRoZSBTREsuXHJcbiAgICovXHJcbiAgcHVibGljIHJlYWRvbmx5IGlzTG9hZGluZyQgPSB0aGlzLmlzTG9hZGluZ1N1YmplY3QkLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICAvKipcclxuICAgKiBUcmlnZ2VyIHVzZWQgdG8gcHVsbCBVc2VyIGluZm9ybWF0aW9uIGZyb20gdGhlIENsaWVudC5cclxuICAgKiBUcmlnZ2VycyB3aGVuIHRoZSBhY2Nlc3MgdG9rZW4gaGFzIGNoYW5nZWQuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBhY2Nlc3NUb2tlblRyaWdnZXIkID0gdGhpcy5hY2Nlc3NUb2tlbiQucGlwZShcclxuICAgIHNjYW4oXHJcbiAgICAgIChcclxuICAgICAgICBhY2M6IHsgY3VycmVudDogc3RyaW5nIHwgbnVsbDsgcHJldmlvdXM6IHN0cmluZyB8IG51bGwgfSxcclxuICAgICAgICBjdXJyZW50OiBzdHJpbmcgfCBudWxsXHJcbiAgICAgICkgPT4gKHtcclxuICAgICAgICBwcmV2aW91czogYWNjLmN1cnJlbnQsXHJcbiAgICAgICAgY3VycmVudCxcclxuICAgICAgfSksXHJcbiAgICAgIHsgY3VycmVudDogbnVsbCwgcHJldmlvdXM6IG51bGwgfVxyXG4gICAgKSxcclxuICAgIGZpbHRlcigoeyBwcmV2aW91cywgY3VycmVudCB9KSA9PiBwcmV2aW91cyAhPT0gY3VycmVudClcclxuICApO1xyXG5cclxuICAvKipcclxuICAgKiBUcmlnZ2VyIHVzZWQgdG8gcHVsbCBVc2VyIGluZm9ybWF0aW9uIGZyb20gdGhlIENsaWVudC5cclxuICAgKiBUcmlnZ2VycyB3aGVuIGFuIGV2ZW50IG9jY3VycyB0aGF0IG5lZWRzIHRvIHJldHJpZ2dlciB0aGUgVXNlciBQcm9maWxlIGluZm9ybWF0aW9uLlxyXG4gICAqIEV2ZW50czogTG9naW4sIEFjY2VzcyBUb2tlbiBjaGFuZ2UgYW5kIExvZ291dFxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgaXNBdXRoZW50aWNhdGVkVHJpZ2dlciQgPSB0aGlzLmlzTG9hZGluZyQucGlwZShcclxuICAgIGZpbHRlcigobG9hZGluZykgPT4gIWxvYWRpbmcpLFxyXG4gICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcclxuICAgIHN3aXRjaE1hcCgoKSA9PlxyXG4gICAgICAvLyBUbyB0cmFjayB0aGUgdmFsdWUgb2YgaXNBdXRoZW50aWNhdGVkIG92ZXIgdGltZSwgd2UgbmVlZCB0byBtZXJnZTpcclxuICAgICAgLy8gIC0gdGhlIGN1cnJlbnQgdmFsdWVcclxuICAgICAgLy8gIC0gdGhlIHZhbHVlIHdoZW5ldmVyIHRoZSBhY2Nlc3MgdG9rZW4gY2hhbmdlcy4gKHRoaXMgc2hvdWxkIGFsd2F5cyBiZSB0cnVlIG9mIHRoZXJlIGlzIGFuIGFjY2VzcyB0b2tlblxyXG4gICAgICAvLyAgICBidXQgaXQgaXMgc2FmZXIgdG8gcGFzcyB0aGlzIHRocm91Z2ggdGhpcy5jbGllbnQuaXNBdXRoZW50aWNhdGVkKCkgbmV2ZXJ0aGVsZXNzKVxyXG4gICAgICAvLyAgLSB0aGUgdmFsdWUgd2hlbmV2ZXIgcmVmcmVzaFN0YXRlJCBlbWl0c1xyXG4gICAgICBtZXJnZShcclxuICAgICAgICBkZWZlcigoKSA9PiB0aGlzLmNsaWVudC5pc0F1dGhlbnRpY2F0ZWQoKSksXHJcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlblRyaWdnZXIkLnBpcGUoXHJcbiAgICAgICAgICBtZXJnZU1hcCgoKSA9PiB0aGlzLmNsaWVudC5pc0F1dGhlbnRpY2F0ZWQoKSlcclxuICAgICAgICApLFxyXG4gICAgICAgIHRoaXMucmVmcmVzaCQucGlwZShtZXJnZU1hcCgoKSA9PiB0aGlzLmNsaWVudC5pc0F1dGhlbnRpY2F0ZWQoKSkpXHJcbiAgICAgIClcclxuICAgIClcclxuICApO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0cyBib29sZWFuIHZhbHVlcyBpbmRpY2F0aW5nIHRoZSBhdXRoZW50aWNhdGlvbiBzdGF0ZSBvZiB0aGUgdXNlci4gSWYgYHRydWVgLCBpdCBtZWFucyBhIHVzZXIgaGFzIGF1dGhlbnRpY2F0ZWQuXHJcbiAgICogVGhpcyBkZXBlbmRzIG9uIHRoZSB2YWx1ZSBvZiBgaXNMb2FkaW5nJGAsIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gbWFudWFsbHkgY2hlY2sgdGhlIGxvYWRpbmcgc3RhdGUgb2YgdGhlIFNESy5cclxuICAgKi9cclxuICByZWFkb25seSBpc0F1dGhlbnRpY2F0ZWQkID0gdGhpcy5pc0F1dGhlbnRpY2F0ZWRUcmlnZ2VyJC5waXBlKFxyXG4gICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcclxuICAgIHNoYXJlUmVwbGF5KDEpXHJcbiAgKTtcclxuXHJcbiAgLyoqXHJcbiAgICogRW1pdHMgZGV0YWlscyBhYm91dCB0aGUgYXV0aGVudGljYXRlZCB1c2VyLCBvciBudWxsIGlmIG5vdCBhdXRoZW50aWNhdGVkLlxyXG4gICAqL1xyXG4gIHJlYWRvbmx5IHVzZXIkID0gdGhpcy5pc0F1dGhlbnRpY2F0ZWRUcmlnZ2VyJC5waXBlKFxyXG4gICAgY29uY2F0TWFwKChhdXRoZW50aWNhdGVkKSA9PlxyXG4gICAgICBhdXRoZW50aWNhdGVkID8gdGhpcy5jbGllbnQuZ2V0VXNlcigpOiBvZihudWxsKVxyXG4gICAgKSxcclxuICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKClcclxuICApO1xyXG5cclxuICAvKipcclxuICAgKiBFbWl0cyBlcnJvcnMgdGhhdCBvY2N1ci5cclxuICAgKi9cclxuICBwdWJsaWMgcmVhZG9ubHkgZXJyb3IkID0gdGhpcy5lcnJvclN1YmplY3QkLmFzT2JzZXJ2YWJsZSgpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihASW5qZWN0KENsaWVudFNlcnZpY2UpIHByaXZhdGUgY2xpZW50OiBDbGllbnQpIHt9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSB0aGUgaXNMb2FkaW5nIHN0YXRlIHVzaW5nIHRoZSBwcm92aWRlZCB2YWx1ZVxyXG4gICAqXHJcbiAgICogQHBhcmFtIGlzTG9hZGluZyBUaGUgbmV3IHZhbHVlIGZvciBpc0xvYWRpbmdcclxuICAgKi9cclxuICBwdWJsaWMgc2V0SXNMb2FkaW5nKGlzTG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgdGhpcy5pc0xvYWRpbmdTdWJqZWN0JC5uZXh0KGlzTG9hZGluZyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZWZyZXNoIHRoZSBzdGF0ZSB0byBlbnN1cmUgdGhlIGBpc0F1dGhlbnRpY2F0ZWRgIGFuZCBgdXNlciRgXHJcbiAgICogcmVmbGVjdCB0aGUgbW9zdCB1cC10by1kYXRlIHZhbHVlcyBmcm9tICBDbGllbnQuXHJcbiAgICovXHJcbiAgcHVibGljIHJlZnJlc2goKTogdm9pZCB7XHJcbiAgICB0aGlzLnJlZnJlc2gkLm5leHQoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSB0aGUgYWNjZXNzIHRva2VuLCBkb2luZyBzbyB3aWxsIGFsc28gcmVmcmVzaCB0aGUgc3RhdGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYWNjZXNzVG9rZW4gVGhlIG5ldyBBY2Nlc3MgVG9rZW5cclxuICAgKi9cclxuICBwdWJsaWMgc2V0QWNjZXNzVG9rZW4oYWNjZXNzVG9rZW46IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5hY2Nlc3NUb2tlbiQubmV4dChhY2Nlc3NUb2tlbik7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFbWl0cyB0aGUgZXJyb3IgaW4gdGhlIGBlcnJvciRgIG9ic2VydmFibGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXJyb3IgVGhlIG5ldyBlcnJvclxyXG4gICAqL1xyXG4gIHB1YmxpYyBzZXRFcnJvcihlcnJvcjogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLmVycm9yU3ViamVjdCQubmV4dChlcnJvcik7XHJcbiAgfVxyXG59XHJcbiJdfQ==