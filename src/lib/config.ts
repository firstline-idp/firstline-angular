import { InjectionToken, Injectable, Optional, Inject } from '@angular/core';
import { FirstlineClientOptions } from "@first-line/firstline-spa-js"

/**
 * Defines a common set of HTTP methods.
 */
export const enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Head = 'HEAD',
}

export interface GetTokenOptions { };

/**
 * Defines the type for a route config entry. Can either be:
 *
 * - an object of type HttpInterceptorRouteConfig
 * - a string
 */
export type ApiRouteDefinition = HttpInterceptorRouteConfig | string;

/**
 * A custom type guard to help identify route definitions that are actually HttpInterceptorRouteConfig types.
 *
 * @param def The route definition type
 */
export function isHttpInterceptorRouteConfig(
  def: ApiRouteDefinition
): def is HttpInterceptorRouteConfig {
  return typeof def !== 'string';
}

/**
 * Configuration for the HttpInterceptor
 */
export interface HttpInterceptorConfig {
  allowedList: ApiRouteDefinition[];
}

/**
 * Configuration for a single interceptor route
 */
export interface HttpInterceptorRouteConfig {
  /**
   * The URL to test, by supplying the URL to match.
   * If `test` is a match for the current request path from the HTTP client, then
   * an access token is attached to the request in the
   *  ["Authorization" header](https://tools.ietf.org/html/draft-ietf-oauth-v2-bearer-20#section-2.1).
   *
   * If the test does not pass, the request proceeds without the access token attached.
   *
   * A wildcard character can be used to match only the start of the URL.
   *
   * @usagenotes
   *
   * '/api' - exactly match the route /api
   * '/api/*' - match any route that starts with /api/
   */
  uri?: string;

  /**
   * A function that will be called with the HttpRequest.url value, allowing you to do
   * any kind of flexible matching.
   *
   * If this function returns true, then
   * an access token is attached to the request in the
   *  ["Authorization" header](https://tools.ietf.org/html/draft-ietf-oauth-v2-bearer-20#section-2.1).
   *
   * If it returns false, the request proceeds without the access token attached.
   */
  uriMatcher?: (uri: string) => boolean;

  /**
   * The options that are passed to the SDK when retrieving the
   * access token to attach to the outgoing request.
   */
  tokenOptions?: GetTokenOptions;

  /**
   * The HTTP method to match on. If specified, the HTTP method of
   * the outgoing request will be checked against this. If there is no match, the
   * Authorization header is not attached.
   *
   * The HTTP method name is case-sensitive.
   */
  httpMethod?: HttpMethod | string;

  /**
   * Allow the HTTP call to be executed anonymously, when no token is available.
   *
   * When omitted (or set to false), calls that match the configuration will fail when no token is available.
   */
  allowAnonymous?: boolean;
}

/**
 * Configuration for the authentication service
 */
export interface AuthConfig extends FirstlineClientOptions {
  /**
   * Configuration for the built-in Http Interceptor, used for
   * automatically attaching access tokens.
   */
  httpInterceptor?: HttpInterceptorConfig;
}

/**
 * Angular specific state to be stored before redirect
 */
export interface AppState {

  /**
   * Any custom parameter to be stored in appState
   */
  [key: string]: any;
}

/**
 * Injection token for accessing configuration.
 *
 * @usageNotes
 *
 * Use the `Inject` decorator to access the configuration from a service or component:
 *
 * ```
 * class MyService(@Inject(AuthConfigService) config: AuthConfig) {}
 * ```
 */
export const AuthConfigService = new InjectionToken<AuthConfig>(
  'firstline.config'
);

/**
 * Gets and sets configuration for the internal client. This can be
 * used to provide configuration outside of using AuthModule.forRoot, i.e. from
 * a factory provided by APP_INITIALIZER.
 */
@Injectable({ providedIn: 'root' })
export class AuthClientConfig {
  private config?: AuthConfig;

  constructor(@Optional() @Inject(AuthConfigService) config?: AuthConfig) {
    if (config) {
      this.set(config);
    }
  }

  /**
   * Sets configuration to be read by other consumers of the service (see usage notes)
   *
   * @param config The configuration to set
   */
  set(config: AuthConfig): void {
    this.config = config;
  }

  /**
   * Gets the config that has been set by other consumers of the service
   */
  get(): AuthConfig {
    return this.config as AuthConfig;
  }
}
