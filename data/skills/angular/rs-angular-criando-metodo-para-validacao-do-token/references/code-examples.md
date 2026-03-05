# Code Examples: Servicos HTTP e Validacao de Token

## Exemplo completo do servico UserAPI

```typescript
// core/user-api.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUserTokenSuccessAuthResponse } from '../../shared/models/user-token-success-auth-response';

@Injectable({ providedIn: 'root' })
export class UserAPI {
  private readonly _httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }

  validateToken() {
    return this._httpClient.get<IUserTokenSuccessAuthResponse>(
      'http://localhost:3000/users/validate-token'
    );
  }

  login() {
    // sera implementado futuramente
  }

  register() {
    // sera implementado futuramente
  }
}
```

## Interface de response

```typescript
// shared/models/user-token-success-auth-response.ts
export interface IUserTokenSuccessAuthResponse {
  id: number;
  name: string;
  email: string;
}
```

## Estrutura de pastas resultante

```
src/app/
├── core/
│   ├── user-token-store.ts      # (aula anterior)
│   └── user-api.ts              # servico de requisicoes HTTP do usuario
├── shared/
│   ├── components/
│   └── models/
│       └── user-token-success-auth-response.ts  # interface de response
```

## Variacao: usando inject() em vez de construtor

```typescript
// Alternativa moderna com inject()
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserAPI {
  private readonly _httpClient = inject(HttpClient);

  validateToken() {
    return this._httpClient.get<IUserTokenSuccessAuthResponse>(
      'http://localhost:3000/users/validate-token'
    );
  }
}
```

## Variacao: extraindo a base URL

```typescript
@Injectable({ providedIn: 'root' })
export class UserAPI {
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrl = 'http://localhost:3000';

  validateToken() {
    return this._httpClient.get<IUserTokenSuccessAuthResponse>(
      `${this._baseUrl}/users/validate-token`
    );
  }

  login(credentials: { email: string; password: string }) {
    return this._httpClient.post<ILoginResponse>(
      `${this._baseUrl}/users/login`,
      credentials
    );
  }
}
```

## Consumindo o servico (preview de uso futuro)

```typescript
// Em um componente ou guard
export class AuthGuard {
  private readonly _userAPI = inject(UserAPI);

  canActivate() {
    return this._userAPI.validateToken().pipe(
      map(response => {
        // response e tipado: { id, name, email }
        console.log(response.name); // autocomplete funciona
        return true;
      }),
      catchError(() => {
        return of(false);
      })
    );
  }
}
```

## Sem tipagem vs com tipagem (comparacao visual)

```typescript
// SEM tipagem — Observable<Object>
validateToken() {
  return this._httpClient.get('http://localhost:3000/users/validate-token');
}
// Ao consumir: response.name → ERRO: Property 'name' does not exist on type 'Object'

// COM tipagem — Observable<IUserTokenSuccessAuthResponse>
validateToken() {
  return this._httpClient.get<IUserTokenSuccessAuthResponse>(
    'http://localhost:3000/users/validate-token'
  );
}
// Ao consumir: response.name → OK, autocomplete mostra id, name, email
```