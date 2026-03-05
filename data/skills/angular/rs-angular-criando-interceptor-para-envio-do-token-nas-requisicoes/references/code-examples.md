# Code Examples: Interceptor HTTP para Token

## Exemplo completo do interceptor (da aula)

```typescript
// core/interceptors/auth-interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserTokenStore } from '../services/user-token-store.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const userTokenStore = inject(UserTokenStore);
  const hasToken = userTokenStore.hasToken();

  if (hasToken) {
    const newRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${userTokenStore.getToken()}`,
      },
    });
    return next(newRequest);
  }

  return next(request);
};
```

### Passo a passo:

1. **`inject(UserTokenStore)`** — Injeta o service que gerencia o token no localStorage
2. **`hasToken()`** — Verifica se existe um token salvo
3. **`request.clone({ setHeaders })`** — Clona a request adicionando o header Authorization
4. **`next(newRequest)`** — Dispara a request clonada (com token)
5. **`next(request)`** — Dispara a request original (sem token) quando nao ha token

## Registro no app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... outros providers
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

## Variacao: Interceptor que verifica URL antes de adicionar token

```typescript
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const publicUrls = ['/api/auth/login', '/api/auth/register'];
  const isPublic = publicUrls.some((url) => request.url.includes(url));

  if (isPublic) {
    return next(request);
  }

  const userTokenStore = inject(UserTokenStore);
  const token = userTokenStore.getToken();

  if (token) {
    const newRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(newRequest);
  }

  return next(request);
};
```

## Variacao: Multiplos interceptors registrados

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,    // Adiciona token
        loggingInterceptor, // Loga requests
        errorInterceptor,   // Trata erros globais
      ])
    ),
  ],
};
```

A ordem no array define a ordem de execucao dos interceptors.

## UserTokenStore (service referenciado)

```typescript
// core/services/user-token-store.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserTokenStore {
  private readonly TOKEN_KEY = 'user_token';

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
```