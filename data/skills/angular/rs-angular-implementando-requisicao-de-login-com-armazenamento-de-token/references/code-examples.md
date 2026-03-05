# Code Examples: Requisicao de Login com Armazenamento de Token

## Exemplo completo do service

```typescript
// services/user-api.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { IUserLoginSuccessResponse } from '../shared/models/user-login-success-response';
import { UserTokenStore } from './user-token-store.service';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _userTokenStore = inject(UserTokenStore);

  login(email: string, password: string) {
    return this._httpClient
      .post<IUserLoginSuccessResponse>(
        'http://localhost:3000/users/login',
        { email, password }
      )
      .pipe(
        tap((loginResponse) => {
          this._userTokenStore.saveToken(loginResponse.token);
        })
      );
  }
}
```

## Interface de response

```typescript
// shared/models/user-login-success-response.ts
export interface IUserLoginSuccessResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
```

## Referencia: requisicao no Insomnia

O endpoint testado:
- **Metodo:** POST
- **URL:** `http://localhost:3000/users/login`
- **Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```
- **Response (sucesso):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

## Variacao: com tratamento de erro no componente

```typescript
// login.component.ts
onLogin() {
  const { email, password } = this.loginForm.value;

  this.userApi.login(email, password).subscribe({
    next: () => {
      // Token ja foi salvo pelo tap no service
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
      // Back-end retornou erro — tap nao executou
      this.errorMessage = 'Email ou senha incorretos';
    },
  });
}
```

## Variacao: UserTokenStore referenciado

```typescript
// services/user-token-store.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserTokenStore {
  private readonly TOKEN_KEY = 'auth_token';

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
```

## Evolucao do post sem tipagem para com tipagem

```typescript
// SEM tipagem — retorna Observable<Object>
this._httpClient.post('http://localhost:3000/users/login', { email, password });

// COM tipagem — retorna Observable<IUserLoginSuccessResponse>
this._httpClient.post<IUserLoginSuccessResponse>(
  'http://localhost:3000/users/login',
  { email, password }
);
```