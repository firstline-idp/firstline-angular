import { InjectionToken } from '@angular/core';
import { FirstlineClient, FirstlineClientOptions, ExchangeCodeResponse } from "@first-line/firstline-spa-js";
import { AuthClientConfig } from './config';
export declare class Client extends FirstlineClient {
    tokens: null | ExchangeCodeResponse;
    constructor(options: FirstlineClientOptions);
    getTokens(): Promise<ExchangeCodeResponse>;
    getAccessToken(): Promise<string | null>;
    getUser(): Promise<any>;
    isAuthenticated(): Promise<boolean>;
}
export declare class ClientFactory {
    static createClient(configFactory: AuthClientConfig): Client;
}
export declare const ClientService: InjectionToken<Client>;
