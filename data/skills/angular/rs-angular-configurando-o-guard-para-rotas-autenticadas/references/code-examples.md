# Code Examples: Guard para Rotas Autenticadas

## Exemplo 1: Guard completo da aula

```typescript
// guards/alf-guard.ts
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const alfGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): MaybeAsync<GuardResult> => {
  const userTokenStore = inject(UserTokenStore);
  const userApi = inject(UserApi);
  const router = inject(Router);

  const loginRoute = router.createUrlTree(['/alphi/login']);

  const hasToken = userTokenStore.hasToken();
  if (!hasToken) {
    return loginRoute;
  }

  return userApi.validateToken().pipe(
    map(() => true),
    catchError(() => {
      userTokenStore.removeToken();
      return of(loginRoute);
    })
  );
};
```

## Exemplo 2: Aplicando o guard nas rotas

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [alfGuard],  // Protege todas as rotas filhas
    children: [
      { path: 'explore', component: ExploreComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'create', component: CreateComponent },
      { path: 'details/:id', component: DetailsComponent },
    ]
  },
  {
    path: 'alphi/login',
    component: LoginComponent  // Rota publica, sem guard
  }
];
```

## Exemplo 3: Tipagens do guard

```typescript
// Os parametros do CanActivateFn sao tipados automaticamente,
// mas podem ser explicitados para clareza:

// route: ActivatedRouteSnapshot — informacoes da rota sendo acessada
// state: RouterStateSnapshot — estado atual do router

// O retorno MaybeAsync<GuardResult> aceita:
// - boolean (true = permite, false = bloqueia)
// - URLTree (redireciona)
// - Observable<boolean | URLTree> (Angular se inscreve)
// - Promise<boolean | URLTree> (Angular resolve)
```

## Exemplo 4: Variacao — Guard que usa dados do response

```typescript
// Se precisar de dados do response de validacao:
return userApi.validateToken().pipe(
  map((response) => {
    // Pode usar response.user, response.roles, etc.
    console.log('Token valido para:', response.user);
    return true;
  }),
  catchError(() => {
    userTokenStore.removeToken();
    return of(loginRoute);
  })
);
```

## Exemplo 5: Variacao — Guard com role-based access

```typescript
// Extensao do pattern para verificar roles
export const adminGuard: CanActivateFn = (route, state) => {
  const tokenStore = inject(UserTokenStore);
  const userApi = inject(UserApi);
  const router = inject(Router);

  const loginRoute = router.createUrlTree(['/auth/login']);
  const forbiddenRoute = router.createUrlTree(['/forbidden']);

  if (!tokenStore.hasToken()) {
    return loginRoute;
  }

  return userApi.validateToken().pipe(
    map((response) => {
      if (response.role === 'admin') return true;
      return forbiddenRoute;
    }),
    catchError(() => {
      tokenStore.removeToken();
      return of(loginRoute);
    })
  );
};
```

## Fluxo completo: Guard + Interceptor + TokenStore + API

```
Usuario tenta acessar /explore
        │
        ▼
   canActivate: [authGuard]
        │
        ▼
   hasToken()? ──NO──> return loginRoute (URLTree)
        │
       YES
        │
        ▼
   userApi.validateToken()
        │
        ▼
   [Interceptor adiciona token no header Authorization]
        │
        ▼
   API /validate-token
        │
   ┌────┴────┐
  200       401
   │         │
   ▼         ▼
 map()    catchError()
   │         │
   ▼         ▼
 true    removeToken()
   │     return of(loginRoute)
   │         │
   ▼         ▼
 Acesso   Redirect
 liberado  /auth/login
```