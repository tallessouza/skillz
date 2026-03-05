---
name: rs-angular-login-request-token-storage
description: "Enforces Angular login request pattern with token storage when implementing authentication flows. Use when user asks to 'implement login', 'create authentication', 'handle login request', 'store auth token', or 'build sign-in feature' in Angular. Applies rules: typed HTTP responses, tap operator for side effects, token persistence via dedicated service, descriptive interface naming. Make sure to use this skill whenever building Angular auth flows or HTTP login endpoints. Not for route guards, interceptors, or session management."
---

# Requisicao de Login com Armazenamento de Token

> Ao implementar login em Angular, tipar o response, usar tap para side effects e delegar persistencia a um service dedicado.

## Rules

1. **Tipar o response da requisicao HTTP** — criar interface dedicada com nome descritivo (ex: `IUserLoginSuccessResponse`), porque `Observable<object>` nao oferece autocomplete nem seguranca de tipos
2. **Usar o operador `tap` para salvar o token** — tap executa apenas em sucesso, nao em erro, porque o componente nao deve conhecer detalhes de persistencia
3. **Delegar persistencia a um service dedicado** — nunca chamar `localStorage` diretamente no service de API, porque isola responsabilidades e facilita testes
4. **Nomear interfaces de forma descritiva** — `IUserLoginSuccessResponse` e melhor que `ILoginResponse` ou `ILogin`, porque nomes grandes mas claros valem mais que nomes curtos e genericos
5. **Usar shorthand de propriedades no body** — `{ email, password }` ao inves de `{ email: email, password: password }`, porque reduz codigo sem perder clareza
6. **Nao exigir token para endpoint de login** — login gera o token, nao consome, porque e o ponto de entrada da autenticacao

## How to write

### Service de API com login tipado

```typescript
// user-api.service.ts
private readonly _httpClient = inject(HttpClient);
private readonly _userTokenStore = inject(UserTokenStore);

login(email: string, password: string) {
  return this._httpClient
    .post<IUserLoginSuccessResponse>('http://localhost:3000/users/login', {
      email,
      password,
    })
    .pipe(
      tap((loginResponse) => {
        this._userTokenStore.saveToken(loginResponse.token);
      })
    );
}
```

### Interface de response tipada

```typescript
// models/user-login-success-response.ts
export interface IUserLoginSuccessResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
```

## Example

**Before (sem tipagem, localStorage direto):**
```typescript
login(email: string, password: string) {
  return this.http.post('http://localhost:3000/users/login', {
    email: email,
    password: password,
  });
}

// No componente:
this.userApi.login(email, password).subscribe((res: any) => {
  localStorage.setItem('token', res.token);
});
```

**After (tipado, tap + service dedicado):**
```typescript
login(email: string, password: string) {
  return this._httpClient
    .post<IUserLoginSuccessResponse>('http://localhost:3000/users/login', {
      email,
      password,
    })
    .pipe(
      tap((loginResponse) => {
        this._userTokenStore.saveToken(loginResponse.token);
      })
    );
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Response tem estrutura conhecida | Crie interface tipada na pasta `shared/models/` |
| Precisa processar response antes de retornar | Use `tap` para side effects, `map` para transformacao |
| Token precisa ser persistido | Delegue a um service dedicado (TokenStore) |
| Body do POST coincide com parametros | Use shorthand `{ email, password }` |
| Interface pode ter nome ambiguo | Prefira nome longo e descritivo |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `http.post(url, body)` sem tipagem genérica | `http.post<IUserLoginSuccessResponse>(url, body)` |
| `localStorage.setItem()` dentro do service de API | `this._userTokenStore.saveToken(token)` |
| `(res: any) => res.token` no componente | `tap()` no service para processar o token |
| `{ email: email, password: password }` | `{ email, password }` |
| `ILogin` ou `IUserResponse` generico | `IUserLoginSuccessResponse` descritivo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
