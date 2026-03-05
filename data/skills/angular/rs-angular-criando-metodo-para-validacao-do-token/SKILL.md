---
name: rs-angular-validacao-token
description: "Enforces Angular HTTP service patterns for token validation and API communication. Use when user asks to 'create an API service', 'validate token', 'make HTTP request in Angular', 'type HTTP response', or 'create injectable service'. Applies rules: dedicated API service per domain, typed HTTP responses with interfaces, HttpClient injection via private readonly, Observable return types. Make sure to use this skill whenever creating Angular services that communicate with backends. Not for state management, routing guards, or interceptors."
---

# Servicos HTTP e Validacao de Token no Angular

> Cada dominio da aplicacao tem seu proprio servico API com requisicoes HTTP tipadas e interfaces de response explicitas.

## Rules

1. **Um servico API por dominio** — `UserAPI` para usuarios, `MovieAPI` para filmes, porque isola responsabilidades e facilita manutencao
2. **Servicos core usam `providedIn: 'root'`** — porque a aplicacao depende deles para funcionar corretamente
3. **HttpClient injetado como `private readonly`** — `private readonly _httpClient = inject(HttpClient)` ou via construtor, porque previne reatribuicao acidental
4. **Toda response HTTP deve ser tipada** — nunca deixe `Observable<Object>`, crie uma interface especifica, porque tipagem generica esconde bugs em projetos profissionais
5. **Interfaces de response ficam em `shared/models/`** — prefixadas com `I`, porque centraliza tipos reutilizaveis e o prefixo identifica visualmente que e uma interface
6. **Nomes de interface descrevem o cenario completo** — `IUserTokenSuccessAuthResponse` nao `ITokenResponse`, porque o nome comunica contexto sem precisar abrir o arquivo

## How to write

### Servico API com HttpClient

```typescript
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

  login() { /* implementar futuramente */ }
  register() { /* implementar futuramente */ }
}
```

### Interface de response tipada

```typescript
// shared/models/user-token-success-auth-response.ts
export interface IUserTokenSuccessAuthResponse {
  id: number;
  name: string;
  email: string;
}
```

## Example

**Before (response sem tipagem):**
```typescript
validateToken() {
  return this._httpClient.get('http://localhost:3000/users/validate-token');
  // Retorna Observable<Object> — generico, sem autocomplete, sem seguranca
}
```

**After (com tipagem generica no get):**
```typescript
validateToken() {
  return this._httpClient.get<IUserTokenSuccessAuthResponse>(
    'http://localhost:3000/users/validate-token'
  );
  // Retorna Observable<IUserTokenSuccessAuthResponse> — tipado, seguro
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo endpoint de API | Crie interface de response antes de implementar o metodo |
| Servico usado em toda app | `providedIn: 'root'` e coloque na pasta `core/` |
| Metodo ainda nao implementado | Deixe o stub vazio no servico para documentar a API completa |
| Response com estrutura conhecida | Use tipagem generica no `get<T>()`, `post<T>()` etc |
| Multiplos endpoints do mesmo dominio | Agrupe no mesmo servico API |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `get(url)` sem tipagem | `get<IMyResponse>(url)` |
| `response: any` | `response: ISpecificResponse` |
| `ITokenResponse` (generico) | `IUserTokenSuccessAuthResponse` (descritivo) |
| `httpClient` publico no servico | `private readonly _httpClient` |
| Requisicoes HTTP direto no componente | Servico API dedicado injetado no componente |
| Um servico gigante para toda a app | Um servico API por dominio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
