import { NgModule } from '@angular/core';
import { AuthService } from './service';
import { AuthConfigService, AuthClientConfig } from './config';
import { ClientService, ClientFactory } from './client';
import { AuthGuard } from './guard';
import * as i0 from "@angular/core";
export class AuthModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN4QyxPQUFPLEVBQWMsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDM0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDeEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7QUFJcEMsTUFBTSxPQUFPLFVBQVU7SUFDckI7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQW1CO1FBQ2hDLE9BQU87WUFDTCxRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUU7Z0JBQ1QsV0FBVztnQkFDWCxTQUFTO2dCQUNUO29CQUNFLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFFBQVEsRUFBRSxNQUFNO2lCQUNqQjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsYUFBYTtvQkFDdEIsVUFBVSxFQUFFLGFBQWEsQ0FBQyxZQUFZO29CQUN0QyxJQUFJLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDekI7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzt1R0F4QlUsVUFBVTt3R0FBVixVQUFVO3dHQUFWLFVBQVU7MkZBQVYsVUFBVTtrQkFEdEIsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXV0aENvbmZpZywgQXV0aENvbmZpZ1NlcnZpY2UsIEF1dGhDbGllbnRDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XHJcbmltcG9ydCB7IENsaWVudFNlcnZpY2UsIENsaWVudEZhY3RvcnkgfSBmcm9tICcuL2NsaWVudCc7XHJcbmltcG9ydCB7IEF1dGhHdWFyZCB9IGZyb20gJy4vZ3VhcmQnO1xyXG5cclxuXHJcbkBOZ01vZHVsZSgpXHJcbmV4cG9ydCBjbGFzcyBBdXRoTW9kdWxlIHtcclxuICAvKipcclxuICAgKiBJbml0aWFsaXplIHRoZSBhdXRoZW50aWNhdGlvbiBtb2R1bGUgc3lzdGVtLiBDb25maWd1cmF0aW9uIGNhbiBlaXRoZXIgYmUgc3BlY2lmaWVkIGhlcmUsXHJcbiAgICogb3IgYnkgY2FsbGluZyBBdXRoQ2xpZW50Q29uZmlnLnNldCAocGVyaGFwcyBmcm9tIGFuIEFQUF9JTklUSUFMSVpFUiBmYWN0b3J5IGZ1bmN0aW9uKS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIG9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBTREsuXHJcbiAgICovXHJcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnPzogQXV0aENvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8QXV0aE1vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IEF1dGhNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIEF1dGhTZXJ2aWNlLFxyXG4gICAgICAgIEF1dGhHdWFyZCxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBBdXRoQ29uZmlnU2VydmljZSxcclxuICAgICAgICAgIHVzZVZhbHVlOiBjb25maWcsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBwcm92aWRlOiBDbGllbnRTZXJ2aWNlLFxyXG4gICAgICAgICAgdXNlRmFjdG9yeTogQ2xpZW50RmFjdG9yeS5jcmVhdGVDbGllbnQsXHJcbiAgICAgICAgICBkZXBzOiBbQXV0aENsaWVudENvbmZpZ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==