---
name: rs-angular-token-store-service
description: "Applies Angular token management service pattern when building authentication flows. Use when user asks to 'create a token service', 'manage auth tokens', 'store JWT', 'handle local storage tokens', or 'build login/logout logic' in Angular. Enforces injectable service with save/get/remove/hasToken methods, private readonly key, and core module placement. Make sure to use this skill whenever implementing authentication token persistence in Angular apps. Not for HTTP interceptors, route guards, or login UI components."
---

# Token Store Service em Angular

> Crie um service dedicado no core da aplicacao para centralizar todo acesso ao token no localStorage, nunca acesse localStorage diretamente de components ou interceptors.

## Rules

1. **Coloque no core/services/** — token store e universal para toda aplicacao, nao pertence a nenhuma feature especifica, porque interceptors e guards de qualquer modulo precisam dele
2. **Nomeie o arquivo de forma auto-explicativa** — `user-token-store.ts` sem sufixo `.service`, porque Angular moderno dispensa prefixos e o nome deve descrever o que o service faz
3. **Nome da classe = nome do arquivo** — `UserTokenStore` para `user-token-store.ts`, porque facilita navegacao e busca no codebase
4. **Use `providedIn: 'root'`** — instancia unica para toda aplicacao, porque o token e um estado global de autenticacao
5. **Extraia a key do localStorage para propriedade private readonly** — porque a key e acessada em multiplos metodos e duplicacao gera bugs silenciosos
6. **Exponha exatamente 4 metodos** — `saveToken`, `getToken`, `removeToken`, `hasToken`, porque cobrem todos os casos de uso sem expor detalhes de implementacao

## How to write

### Estrutura completa do service

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

## Example

**Before (acesso direto espalhado pelo codigo):**

```typescript
// No interceptor
const token = localStorage.getItem('alf-token');

// No guard
if (localStorage.getItem('alf-token')) { ... }

// No logout
localStorage.removeItem('alf-token');
```

**After (centralizado no token store):**

```typescript
// No interceptor
const token = this.userTokenStore.getToken();

// No guard
if (this.userTokenStore.hasToken()) { ... }

// No logout
this.userTokenStore.removeToken();
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa persistir token apos login | `userTokenStore.saveToken(response.token)` |
| Interceptor precisa anexar header | `userTokenStore.getToken()` |
| Guard precisa verificar autenticacao | `userTokenStore.hasToken()` |
| Logout precisa limpar sessao | `userTokenStore.removeToken()` |
| Novo projeto Angular com auth | Crie o token store antes de interceptors e guards |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `localStorage.getItem('token')` direto no component | `this.userTokenStore.getToken()` |
| Key duplicada como string literal em varios arquivos | `private readonly tokenKey` centralizado |
| Service de token dentro de uma feature module | Service no `core/services/` |
| `user-token-store.service.ts` com sufixo | `user-token-store.ts` (Angular moderno) |
| `@Injectable()` sem providedIn | `@Injectable({ providedIn: 'root' })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
