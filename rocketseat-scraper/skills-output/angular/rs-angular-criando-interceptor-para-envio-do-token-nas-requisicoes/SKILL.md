---
name: rs-angular-criando-interceptor-token
description: "Applies Angular HTTP interceptor pattern for automatic token injection in requests. Use when user asks to 'create an interceptor', 'add auth token to requests', 'handle authorization headers', 'avoid repeating token code', or 'configure HTTP client with interceptors'. Ensures proper request cloning, conditional token attachment, and interceptor registration in app config. Make sure to use this skill whenever implementing authentication flow in Angular or adding headers to HTTP requests. Not for login/signup form creation, token storage implementation, or backend auth logic."
---

# Interceptor HTTP para Token de Autorizacao

> Clone a requisicao original antes de modificar headers — nunca mute a request diretamente.

## Rules

1. **Interceptor e uma funcao, nao uma classe** — use `HttpInterceptorFn` do `@angular/common/http`, porque Angular moderno usa interceptors funcionais
2. **Sempre clone a request** — `request.clone({ setHeaders })` cria uma copia imutavel, porque mutar a original causa bugs imprevisiveis em interceptors encadeados
3. **Verifique se o token existe antes de injetar** — nem toda requisicao precisa de token (login, cadastro), porque o backend rejeita tokens invalidos/vazios
4. **Retorne `next(request)` no else** — requisicoes sem token devem seguir normalmente, porque omitir o return causa erro silencioso
5. **Registre o interceptor no `app.config.ts`** — use `provideHttpClient(withInterceptors([...]))`, porque criar o arquivo sem registrar nao tem efeito
6. **Coloque interceptors na pasta `core/interceptors/`** — sao funcoes essenciais para a aplicacao funcionar, porque fazem parte da infraestrutura core

## How to write

### Estrutura do interceptor

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

### Registro no app.config.ts

```typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

## Example

**Before (token manual em cada requisicao):**
```typescript
// Repetido em CADA service que precisa de auth
getFilmes() {
  const token = this.userTokenStore.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
  return this.http.get('/api/filmes', { headers });
}
```

**After (interceptor automatico):**
```typescript
// Service limpo — interceptor cuida do token
getFilmes() {
  return this.http.get('/api/filmes');
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Requisicao precisa de auth | Interceptor injeta automaticamente |
| Requisicao de login/cadastro | Token nao existe, request segue original |
| Multiplos interceptors necessarios | Adicione ao array em `withInterceptors([a, b, c])` |
| Token expirado | Trate em interceptor separado (refresh token) |
| Precisa de header diferente por rota | Verifique `request.url` antes de clonar |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| Mutar `request` diretamente | `request.clone({ setHeaders })` |
| Adicionar token manualmente em cada service | Usar interceptor centralizado |
| Criar interceptor sem registrar em `app.config.ts` | `provideHttpClient(withInterceptors([...]))` |
| Enviar token vazio/undefined | Verificar `hasToken()` antes |
| Usar classe com `implements HttpInterceptor` | Usar `HttpInterceptorFn` (funcional) |
| Esquecer o `return next(request)` no else | Sempre retornar para requests sem token |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
