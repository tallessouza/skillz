# Code Examples: Token Store Service

## Estrutura de pastas

```
src/
  app/
    core/
      services/
        user-token-store.ts    ← O service criado nesta aula
    features/
      ...
```

## Codigo completo do service

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserTokenStore {
  private readonly tokenKey = 'alf-token';

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
```

## Uso futuro em um interceptor (previsto pelo instrutor)

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserTokenStore } from '../core/services/user-token-store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStore = inject(UserTokenStore);
  const token = tokenStore.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
```

## Uso futuro em um guard (previsto pelo instrutor)

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserTokenStore } from '../core/services/user-token-store';

export const authGuard: CanActivateFn = () => {
  const tokenStore = inject(UserTokenStore);
  const router = inject(Router);

  if (tokenStore.hasToken()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

## Uso futuro no fluxo de login

```typescript
import { UserTokenStore } from '../core/services/user-token-store';

// Dentro de um component ou service de login
onLogin(credentials: LoginCredentials): void {
  this.authService.login(credentials).subscribe({
    next: (response) => {
      this.userTokenStore.saveToken(response.token);
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      // handle error
    }
  });
}
```

## Uso futuro no fluxo de logout

```typescript
onLogout(): void {
  this.userTokenStore.removeToken();
  this.router.navigate(['/login']);
}
```

## Evolucao do refactor: key inline → propriedade

O instrutor comecou assim:

```typescript
// Primeira versao (inline)
saveToken(token: string): void {
  localStorage.setItem('alf-token', token);
}
```

E refatorou para:

```typescript
// Versao final (propriedade)
private readonly tokenKey = 'alf-token';

saveToken(token: string): void {
  localStorage.setItem(this.tokenKey, token);
}
```

Motivo: a string `'alf-token'` seria repetida em 3 metodos. Centralizar evita typos e facilita mudancas futuras.