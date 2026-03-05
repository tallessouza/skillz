---
name: rs-angular-guard-rotas-autenticadas
description: "Applies Angular route guard patterns when protecting authenticated routes. Use when user asks to 'create a guard', 'protect routes', 'route authentication', 'canActivate', or 'redirect unauthenticated users'. Implements CanActivateFn with token validation, RxJS error handling, and URL tree redirects. Make sure to use this skill whenever implementing route protection in Angular. Not for HTTP interceptors, login forms, or token storage implementation."
---

# Guard para Rotas Autenticadas no Angular

> Proteja rotas com CanActivateFn que valida token via API e redireciona para login quando invalido ou ausente.

## Rules

1. **Use CanActivateFn funcional, nao class-based** — `export const authGuard: CanActivateFn = (route, state) => {}`, porque guards funcionais sao o padrao moderno do Angular e mais simples de compor
2. **Verifique existencia do token ANTES de chamar a API** — se nao ha token no storage, redirecione imediatamente sem fazer requisicao HTTP, porque economiza uma chamada de rede desnecessaria
3. **Retorne URLTree para redirecionamentos** — use `router.createUrlTree(['/path'])` em vez de `router.navigate()`, porque o Angular gerencia o redirect nativamente quando recebe URLTree do guard
4. **Use map + catchError no Observable de validacao** — map retorna `true` no sucesso, catchError limpa token e retorna `of(loginRoute)`, porque o Angular se inscreve automaticamente no Observable retornado
5. **Limpe o token no catchError** — sempre remova o token invalido do storage antes de redirecionar, porque evita loops de validacao com token corrompido
6. **Aplique canActivate no array da rota pai** — `canActivate: [authGuard]` na rota que agrupa as rotas protegidas, porque protege todas as rotas filhas automaticamente

## How to write

### Guard funcional completo

```typescript
// guards/auth-guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenStore = inject(UserTokenStore);
  const userApi = inject(UserApi);
  const router = inject(Router);

  const loginRoute = router.createUrlTree(['/auth/login']);

  const hasToken = tokenStore.hasToken();
  if (!hasToken) {
    return loginRoute;
  }

  return userApi.validateToken().pipe(
    map(() => true),
    catchError(() => {
      tokenStore.removeToken();
      return of(loginRoute);
    })
  );
};
```

### Aplicando na rota pai

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'explore', component: ExploreComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'create', component: CreateComponent },
    ]
  },
  {
    path: 'auth/login',
    component: LoginComponent
  }
];
```

## Example

**Before (guard incompleto sem tratamento de erro):**
```typescript
export const authGuard: CanActivateFn = () => {
  const tokenStore = inject(UserTokenStore);
  return tokenStore.hasToken();
};
```

**After (com validacao via API e redirect):**
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const tokenStore = inject(UserTokenStore);
  const userApi = inject(UserApi);
  const router = inject(Router);

  const loginRoute = router.createUrlTree(['/auth/login']);

  if (!tokenStore.hasToken()) {
    return loginRoute;
  }

  return userApi.validateToken().pipe(
    map(() => true),
    catchError(() => {
      tokenStore.removeToken();
      return of(loginRoute);
    })
  );
};
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota publica (login, registro) | Nao aplique guard |
| Grupo de rotas protegidas | Aplique guard na rota pai com children |
| Token ausente | Redirecione direto, sem chamar API |
| Token presente mas possivelmente expirado | Valide via endpoint da API |
| Validacao falhou | Limpe token + redirecione para login |
| Guard precisa de dados do response | Use map com o response dentro do pipe |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `router.navigate(['/login'])` dentro do guard | `return router.createUrlTree(['/login'])` |
| `return true` sem validar token na API | `return userApi.validateToken().pipe(map(() => true))` |
| Guard class-based com `@Injectable` | Guard funcional com `CanActivateFn` |
| `subscribe()` dentro do guard | Retorne o Observable diretamente (Angular se inscreve) |
| `canActivate` em cada rota filha individualmente | `canActivate` na rota pai que agrupa as filhas |
| Ignorar limpeza do token no erro | `tokenStore.removeToken()` no `catchError` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
