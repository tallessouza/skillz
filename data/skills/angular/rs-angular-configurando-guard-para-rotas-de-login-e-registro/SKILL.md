---
name: rs-angular-guard-rotas-login-registro
description: "Applies Angular route guard patterns when protecting authentication routes from logged-in users. Use when user asks to 'create a guard', 'protect login route', 'redirect authenticated users', 'guest guard', or 'prevent access to login when logged in'. Enforces guest guard pattern with token validation and UrlTree redirects. Make sure to use this skill whenever implementing route protection logic in Angular apps. Not for server-side auth, JWT validation logic, or HTTP interceptors."
---

# Guest Guard para Rotas de Login e Registro

> Rotas de autenticacao (login/registro) devem redirecionar usuarios ja autenticados para a area logada, usando um guest guard com CanActivateFn.

## Rules

1. **Separe auth guard de guest guard** — auth guard protege rotas autenticadas, guest guard protege rotas publicas de usuarios ja logados, porque sao responsabilidades inversas
2. **Use CanActivateFn (functional guard)** — nao use class-based guards, porque functional guards sao o padrao moderno do Angular e mais simples
3. **Retorne UrlTree para redirecionamento** — use `router.createUrlTree(['/'])` em vez de `router.navigate()`, porque UrlTree integra com o sistema de rotas do Angular
4. **Valide token atraves do fluxo existente** — redirecione para a rota que ja tem auth guard, porque ele vai validar o token automaticamente sem duplicar logica
5. **Return true quando nao ha token** — permita acesso a rota de login/registro quando local storage esta vazio, porque o usuario precisa se autenticar

## How to write

### Guest Guard (functional)

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserTokenStore } from './user-token.store';

export const guestGuard: CanActivateFn = (route, state) => {
  const userTokenStore = inject(UserTokenStore);
  const router = inject(Router);

  const hasToken = userTokenStore.getToken();

  if (!hasToken) {
    return true; // sem token → permite acessar login/registro
  }

  // com token → redireciona para area autenticada
  const exploreRoute = router.createUrlTree(['/']);
  return exploreRoute;
};
```

### Aplicando nas rotas de auth

```typescript
{
  path: 'auth',
  children: [
    {
      path: 'login',
      canActivate: [guestGuard],
      component: LoginComponent,
    },
    {
      path: 'register',
      canActivate: [guestGuard],
      component: RegisterComponent,
    },
  ],
}
```

## Example

**Before (sem guest guard):**
```typescript
// Usuario logado acessa /auth/login → ve tela de login desnecessariamente
// Pode fazer login duplicado sem necessidade
{
  path: 'auth/login',
  component: LoginComponent,
}
```

**After (com guest guard):**
```typescript
// Usuario logado acessa /auth/login → redirecionado para /explore
// Token validado automaticamente pelo auth guard na rota raiz
{
  path: 'auth/login',
  canActivate: [guestGuard],
  component: LoginComponent,
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Rota so para visitantes (login, registro, forgot-password) | Aplique guestGuard |
| Rota so para usuarios logados (dashboard, profile) | Aplique authGuard |
| Token presente mas possivelmente expirado | Redirecione para rota com authGuard que valida o token |
| Multiplas rotas de auth no mesmo modulo | Aplique guestGuard no parent route |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `router.navigate()` dentro do guard | `return router.createUrlTree(['/'])` |
| Validar token dentro do guest guard | Redirecionar para rota que ja tem auth guard |
| Class-based guard com `@Injectable` | Functional guard com `CanActivateFn` |
| Duplicar logica de validacao de token | Reaproveitar o auth guard existente via redirecionamento |
| Checar token apenas no login, esquecer registro | Aplicar guest guard em todas as rotas de auth |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
