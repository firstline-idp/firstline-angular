import { NgModule, ModuleWithProviders } from '@angular/core';
import { AuthService } from './service';
import { AuthConfig, AuthConfigService, AuthClientConfig } from './config';
import { ClientService, ClientFactory } from './client';
import { AuthGuard } from './guard';


@NgModule()
export class AuthModule {
  /**
   * Initialize the authentication module system. Configuration can either be specified here,
   * or by calling AuthClientConfig.set (perhaps from an APP_INITIALIZER factory function).
   *
   * @param config The optional configuration for the SDK.
   */
  static forRoot(config?: AuthConfig): ModuleWithProviders<AuthModule> {
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
