# Code Examples: Requisicoes HTTP Tipadas em Angular

## Exemplo completo do servico

### user-api.service.ts (antes da aula)

```typescript
@Injectable({ providedIn: 'root' })
export class UserApiService {
  private httpClient = inject(HttpClient);

  validateToken() {
    // ... implementacao existente
  }

  login() {
    // ... implementacao existente
  }

  register(name: string, email: string, password: string) {
    return this.httpClient.post<UserRegisterSuccessResponse>(
      'http://localhost:3000/users',
      { name, email, password }
    );
  }
}
```

## Interface de response

### shared/models/user-register-success-response.ts

```typescript
export interface UserRegisterSuccessResponse {
  id: number;
  name: string;
  email: string;
}
```

## Melhoria de tipagem do SchemaPath

### Antes (tipagem generica com N e N)

```typescript
// Tipagem pouco clara
someMethod(confirmPassword: any, password: any) { ... }
```

### Depois (SchemaPath tipado)

```typescript
import { SchemaPath } from '@angular/forms/signals';

// Agora aceita apenas field paths de campos string
someMethod(confirmPassword: SchemaPath<string>, password: SchemaPath<string>) {
  // Se o campo fosse number, TypeScript acusaria erro
}
```

## Padrao para outros endpoints similares

### Login (mesmo padrao, diferente interface)

```typescript
// login-success-response.ts
export interface LoginSuccessResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

// No servico
login(email: string, password: string) {
  return this.httpClient.post<LoginSuccessResponse>(
    'http://localhost:3000/auth/login',
    { email, password }
  );
}
```

### GET tipado (variacao do padrao)

```typescript
// user-profile-response.ts
export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
}

// No servico
getProfile() {
  return this.httpClient.get<UserProfileResponse>(
    'http://localhost:3000/users/me'
  );
}
```

## Endpoint no Insomnia

```
POST http://localhost:3000/users

Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}

Response (200):
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

Note: password nao retorna no response — o backend nunca deve expor senhas no retorno.