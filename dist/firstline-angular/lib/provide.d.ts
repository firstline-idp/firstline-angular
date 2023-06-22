import { Provider } from '@angular/core';
import { AuthConfig } from './config';
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
export declare function provide(config?: AuthConfig): Provider[];
