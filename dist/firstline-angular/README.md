# Firstline Angular

## Helpful resources

- [Quick setup](https://docs.firstline.sh/quicksetup?tab=angular) - our guide for quickly adding login, logout and user information to an Angular app using Firstline.
- [Angular sample app](https://github.com/firstline-idp/firstline-angular) - a full-fledged Angular application integrated with Firstline.
- [Firstline docs](https://docs.firstline.sh) - explore our docs site and learn more about Firstline.

## Getting started

### Setup Firstline Application & API
1. Follow the [Quick setup](https://docs.firstline.sh/quicksetup?tab=angular) to configure a Firstline Application.
2. Add a Firstline API as shown in [Secure API](https://docs.firstline.sh/secure-api?tab=angular).

**Important:** Don't forget to configure the Application URIs.

### Installation

Using npm:

```sh
npm install @first-line/firstline-angular
```

Using yarn:

```sh
yarn add @first-line/firstline-angular
```

### Configuration

Add the following code to your Angular project. Replace **DOMAIN**, **API_IDENTIFIER** and **CLIENT_ID** with the settings you configured in setup step. You can also find them in the Application's and API's "Configure" tab in your dashboard.

Furthermore, replace **API_URL** with the base URL of your secured API endpoints. For example, by specifying `http://localhost:8080/*` all calls to endpoints that start with `http://localhost:8080` have an Authorization header.

```ts
// app.module.ts
import { NgModule } from '@angular/core';
import { AuthModule } from '@first-line/firstline-angular';

@NgModule({
  // ...
  imports: [
    AuthModule.forRoot({
      domain: 'DOMAIN',
      audience: 'API_IDENTIFIER',  // = audience
      client_id: 'CLIENT_ID',
      redirect_uri: window.location.origin,
      logout_uri: `${window.location.origin}/logout`,  // or window.location.origin to redirect back to home after logout
      httpInterceptor: {
        allowedList: [
          'API_URL/*'
        ]
      }
    }),
  ]
})
export class AppModule {}
```

### Add login, logout, isAuthenticated & user
```ts
// home.component.ts
import { Component, Inject } from '@angular/core';
import { AuthService } from '@first-line/firstline-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class NavBarComponent {
  constructor(public auth: AuthService) { }

  loginWithRedirect() {
    this.auth.loginRedirect();
  }

  logout() {
    this.auth.logout();
  }
}
```

```html
<!-- home.component.html -->
<div class="container" *ngIf="auth.isLoading$ | async; else loaded">
  <app-loading></app-loading>
</div>

<ng-template #loaded>
  <div class="container" *ngIf="auth.user$ | async as user; else homesignin">
    <h1 class="text-2xl">Welcome {{user.email}}.</h1>
    <button (click)="logout()">Logout</button>
  </div>
  <ng-template #homesignin>
    <h1>Please sign-in </h1>
    <button (click)="loginWithRedirect()">Login</button>
  </ng-template>
</ng-template>
```

### Make a secured backend call

You now only need to implement the API call. Firstline will automatically inject an Authorization header into all calls with a URL starting with `API_URL`.

```ts
// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  loadPosts$() {
    return this.http.get('API_URL/posts');
  }
}
```

### Protect a page

Create a component `SecureComponent` with secure UI content. Add the following code to `app-routing.module.ts`.
If you implemented everything correct, unauthenticated users can no longer access `/scured`.

```ts
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SecuredComponent } from './pages/secured/secured.component';
import { LogoutComponent } from './pages/logout/logout.component';

import { AuthGuard } from '@first-line/firstline-angular';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'logout', component: LogoutComponent },
  
  {  // secured page:
    path: 'secured',
    component: SecuredComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```