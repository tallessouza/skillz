# Code Examples: Guest Guard para Rotas de Login e Registro

## Exemplo completo do guest guard criado na aula

```typescript
// core/guards/guest-guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserTokenStore } from '../stores/user-token.store';

export const guestGuard: CanActivateFn = (route, state) => {
  const userTokenStore = inject(UserTokenStore);
  const router = inject(Router);

  const hasToken = userTokenStore.getToken();

  // Sem token → permite acesso (usuario precisa fazer login)
  if (!hasToken) {
    return true;
  }

  // Com token → redireciona para rota autenticada
  // O path vazio carrega o main layout e aciona o auth guard
  // que valida o token automaticamente
  const exploreRoute = router.createUrlTree(['/']);
  return exploreRoute;
};
```

## Aplicacao nas rotas de auth

```typescript
// Antes (sem guest guard)
{
  path: 'auth',
  children: [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
  ]
}

// Depois (com guest guard aplicado)
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
  ]
}
```

## Comparacao: auth guard vs guest guard

```typescript
// AUTH GUARD — protege rotas que precisam de autenticacao
export const authGuard: CanActivateFn = (route, state) => {
  const userTokenStore = inject(UserTokenStore);
  const router = inject(Router);

  const hasToken = userTokenStore.getToken();

  if (hasToken) {
    // Tem token → valida e permite
    return userTokenStore.validateToken(hasToken);
  }

  // Sem token → redireciona para login
  return router.createUrlTree(['/auth/login']);
};

// GUEST GUARD — protege rotas de visitante
export const guestGuard: CanActivateFn = (route, state) => {
  const userTokenStore = inject(UserTokenStore);
  const router = inject(Router);

  const hasToken = userTokenStore.getToken();

  if (!hasToken) {
    // Sem token → permite acessar login/registro
    return true;
  }

  // Com token → redireciona para area autenticada
  return router.createUrlTree(['/']);
};
```

## Testes realizados na aula

### Teste 1: Sem token
```
1. Acessar /auth/login → Carrega normalmente ✓
2. Acessar /auth/register → Carrega normalmente ✓
```

### Teste 2: Com token invalido
```
1. Application > Local Storage > auth_token = "teste123"
2. Acessar /auth/register
3. Guest guard detecta token → redireciona para /
4. Auth guard chama validateToken("teste123") → invalido
5. Auth guard limpa local storage → redireciona para /auth/login ✓
```

### Teste 3: Com token valido
```
1. Fazer login real → copiar token JWT valido
2. Application > Local Storage > auth_token = token_valido
3. Acessar /auth/login
4. Guest guard detecta token → redireciona para /
5. Auth guard valida token → sucesso → mostra tela de explore ✓
6. Acessar /auth/register → mesmo comportamento, vai para explore ✓
```