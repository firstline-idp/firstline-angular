import { InjectionToken } from '@angular/core';
import {
  FirstlineClient,
  FirstlineClientOptions,
  ExchangeCodeResponse,
} from "@first-line/firstline-spa-js";

import { AuthClientConfig } from './config';

export class Client extends FirstlineClient {
  tokens: null | ExchangeCodeResponse;

  constructor(options: FirstlineClientOptions) {
    super(options);
    this.tokens = null;
  }

  async getTokens() {
    if (!this.tokens) {
      this.tokens = await this.doExchangeOrRefresh();
    }
    return this.tokens;
  }

  async getAccessToken() {
    const tokens = await this.getTokens();
    return tokens ? tokens.access_token : null;
  }

  override async getUser() {
    const tokens = await this.getTokens();
    return super.getUser(tokens);
  }

  async isAuthenticated() {
    const user = await this.getUser();
    return Boolean(user);
  }

};

export class ClientFactory {
  static createClient(configFactory: AuthClientConfig): Client {
    const config = configFactory.get();

    if (!config) {
      throw new Error(
        'Configuration must be specified either through AuthModule.forRoot or through AuthClientConfig.set'
      );
    }

    return new Client(config);
  }
}

export const ClientService = new InjectionToken<Client>(
  'firstline.client'
);
