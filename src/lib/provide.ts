import { Provider } from '@angular/core';

import { ClientService, ClientFactory } from './client';
import { AuthConfig, AuthConfigService, AuthClientConfig } from './config';
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
export function provide(config?: AuthConfig): Provider[] {
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
