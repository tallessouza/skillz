# Code Examples: Testando o Interceptor Angular

## Codigo de teste no AppComponent

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { UserApiService } from './services/user-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private userApi = inject(UserApiService);

  ngOnInit() {
    this.userApi.validateToken().subscribe({
      next: (response) => console.log(response),
      error: (err) => console.error(err)
    });
  }
}
```

## Servico UserApiService (referencia)

```typescript
@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  validateToken() {
    return this.http.get(`${this.apiUrl}/users/validate-token`);
  }
}
```

## Interceptor (da aula anterior, para referencia)

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth-token');

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
```

## Cenarios de teste no DevTools

### Cenario 1: Sem token

```
// Local Storage: vazio
// Console output:
HttpErrorResponse {
  status: 401,
  error: { message: "Token não fornecido" }
}
// Network > Request Headers: (sem Authorization)
```

### Cenario 2: Token invalido

```
// Local Storage: auth-token = "teste123"
// Console output:
HttpErrorResponse {
  status: 401,
  error: { message: "Token inválido ou expirado" }
}
// Network > Request Headers:
//   Authorization: Bearer teste123
```

### Cenario 3: Token valido

```
// Local Storage: auth-token = "eyJhbGciOiJIUzI1NiIs..."
// Console output:
{ message: "Token válido", user: { id: 1, email: "user@example.com" } }
// Network > Request Headers:
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
// Network > Status: 200 OK
```

## Gerando token valido via Insomnia/Postman

```http
POST /users/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123"
}

// Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Copiar o valor de `token` e colar no Local Storage do browser em `auth-token`.