import { ClientService, ClientFactory } from './client';
import { AuthConfigService, AuthClientConfig } from './config';
import { AuthGuard } from './guard';
import { AuthHttpInterceptor } from './interceptor';
import { AuthService } from './service';
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
export function provide(config) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdmlkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcHJvdmlkZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN4RCxPQUFPLEVBQWMsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDM0UsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNwQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDcEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUV4Qzs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILE1BQU0sVUFBVSxPQUFPLENBQUMsTUFBbUI7SUFDekMsT0FBTztRQUNMLFdBQVc7UUFDWCxtQkFBbUI7UUFDbkIsU0FBUztRQUNUO1lBQ0UsT0FBTyxFQUFFLGlCQUFpQjtZQUMxQixRQUFRLEVBQUUsTUFBTTtTQUNqQjtRQUNEO1lBQ0UsT0FBTyxFQUFFLGFBQWE7WUFDdEIsVUFBVSxFQUFFLGFBQWEsQ0FBQyxZQUFZO1lBQ3RDLElBQUksRUFBRSxDQUFDLGdCQUFnQixDQUFDO1NBQ3pCO0tBQ0YsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcm92aWRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQ2xpZW50U2VydmljZSwgQ2xpZW50RmFjdG9yeSB9IGZyb20gJy4vY2xpZW50JztcclxuaW1wb3J0IHsgQXV0aENvbmZpZywgQXV0aENvbmZpZ1NlcnZpY2UsIEF1dGhDbGllbnRDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XHJcbmltcG9ydCB7IEF1dGhHdWFyZCB9IGZyb20gJy4vZ3VhcmQnO1xyXG5pbXBvcnQgeyBBdXRoSHR0cEludGVyY2VwdG9yIH0gZnJvbSAnLi9pbnRlcmNlcHRvcic7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIHRoZSBhdXRoZW50aWNhdGlvbiBzeXN0ZW0uIENvbmZpZ3VyYXRpb24gY2FuIGVpdGhlciBiZSBzcGVjaWZpZWQgaGVyZSxcclxuICogb3IgYnkgY2FsbGluZyBBdXRoQ2xpZW50Q29uZmlnLnNldCAocGVyaGFwcyBmcm9tIGFuIEFQUF9JTklUSUFMSVpFUiBmYWN0b3J5IGZ1bmN0aW9uKS5cclxuICpcclxuICogTm90ZTogU2hvdWxkIG9ubHkgYmUgdXNlZCBhcyBvZiBBbmd1bGFyIDE1LCBhbmQgc2hvdWxkIG5vdCBiZSBhZGRlZCB0byBhIGNvbXBvbmVudCdzIHByb3ZpZGVycy5cclxuICpcclxuICogQHBhcmFtIGNvbmZpZyBUaGUgb3B0aW9uYWwgY29uZmlndXJhdGlvbiBmb3IgdGhlIFNESy5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogYm9vdHN0cmFwQXBwbGljYXRpb24oQXBwQ29tcG9uZW50LCB7XHJcbiAqICAgcHJvdmlkZXJzOiBbXHJcbiAqICAgICBwcm92aWRlKCksXHJcbiAqICAgXSxcclxuICogfSk7XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZShjb25maWc/OiBBdXRoQ29uZmlnKTogUHJvdmlkZXJbXSB7XHJcbiAgcmV0dXJuIFtcclxuICAgIEF1dGhTZXJ2aWNlLFxyXG4gICAgQXV0aEh0dHBJbnRlcmNlcHRvcixcclxuICAgIEF1dGhHdWFyZCxcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogQXV0aENvbmZpZ1NlcnZpY2UsXHJcbiAgICAgIHVzZVZhbHVlOiBjb25maWcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwcm92aWRlOiBDbGllbnRTZXJ2aWNlLFxyXG4gICAgICB1c2VGYWN0b3J5OiBDbGllbnRGYWN0b3J5LmNyZWF0ZUNsaWVudCxcclxuICAgICAgZGVwczogW0F1dGhDbGllbnRDb25maWddLFxyXG4gICAgfSxcclxuICBdO1xyXG59XHJcbiJdfQ==