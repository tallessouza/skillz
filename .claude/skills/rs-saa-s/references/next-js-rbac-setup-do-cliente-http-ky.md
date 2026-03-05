---
name: rs-saas-nextjs-setup-cliente-http-ky
description: "Applies HTTP client setup patterns using Ky library when building Next.js applications with API communication. Use when user asks to 'setup HTTP client', 'configure API calls', 'replace axios', 'create API instance', 'organize HTTP requests', or 'setup fetch wrapper'. Enforces typed request/response patterns, separated HTTP modules, and Ky best practices. Make sure to use this skill whenever setting up API communication in Next.js or TypeScript projects. Not for WebSocket, GraphQL, or server-side API route creation."
---

# Setup do Cliente HTTP (Ky)

> Organize requisicoes HTTP em modulos tipados usando Ky como wrapper da fetch API, com funcoes separadas por rota e interfaces de request/response.

## Rules

1. **Use Ky em vez de Axios** — Ky usa fetch API nativa (leve, suporta web streams), enquanto Axios usa XMLHttpRequest (API antiga, mais pesada), porque features novas do JavaScript como streaming funcionam melhor com fetch
2. **Crie uma instancia centralizada do API client** — `ky.create({ prefixUrl })` em arquivo separado, porque permite reusar configuracao (base URL, interceptors) em todas as requisicoes
3. **Nunca inclua barra inicial nas rotas** — `api.post('sessions/password')` nao `api.post('/sessions/password')`, porque Ky descarta o prefixUrl quando encontra barra inicial
4. **Uma funcao por rota da API** — cada endpoint vira um arquivo em `src/http/`, porque isola tipagem, facilita manutencao e torna imports explicitos
5. **Tipe request e response com interfaces** — defina `{Name}Request` e `{Name}Response` para cada funcao HTTP, porque garante type safety sem precisar de runtime validation para dados que voce controla
6. **Nao valide respostas da propria API com Zod** — use interfaces TypeScript (compile-time), porque a resposta vem de codigo seu (nao do usuario), e validacao runtime adiciona carga desnecessaria

## How to write

### API Client centralizado

```typescript
// src/http/api-client.ts
import ky from 'ky'

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
})
```

### Funcao de requisicao tipada

```typescript
// src/http/sign-in-with-password.ts
import { api } from './api-client'

interface SignInWithPasswordRequest {
  email: string
  password: string
}

interface SignInWithPasswordResponse {
  token: string
}

export async function signInWithPassword({
  email,
  password,
}: SignInWithPasswordRequest) {
  const result = await api
    .post('sessions/password', {
      json: { email, password },
    })
    .json<SignInWithPasswordResponse>()

  return result
}
```

### Uso em Server Actions (Next.js)

```typescript
// src/app/auth/sign-in/actions.ts
'use server'

import { signInWithPassword } from '@/http/sign-in-with-password'

export async function signInAction(data: FormData) {
  const { token } = await signInWithPassword({
    email: String(data.get('email')),
    password: String(data.get('password')),
  })

  // usar o token...
}
```

## Example

**Before (fetch inline sem tipagem):**
```typescript
const response = await fetch('http://localhost:3333/sessions/password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
const data = await response.json() // unknown, sem tipagem
```

**After (Ky com modulo tipado):**
```typescript
import { signInWithPassword } from '@/http/sign-in-with-password'

const { token } = await signInWithPassword({ email, password })
// token: string — tipado automaticamente
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova rota da API | Criar arquivo em `src/http/{nome-da-rota}.ts` com interfaces Request/Response |
| Dados do FormData para funcao tipada | Converter com `String(data.get('field'))` |
| Resposta da API precisa de tipo | Usar generic no `.json<Type>()` do Ky |
| Precisa de interceptors (auth token) | Configurar no `ky.create()` com hooks `beforeRequest` |
| Precisa de base URL diferente por ambiente | Usar variavel de ambiente no `prefixUrl` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `api.post('/sessions/password')` (barra inicial) | `api.post('sessions/password')` |
| `fetch()` inline com URL completa repetida | `api.post()` com instancia centralizada |
| `const data: any = await res.json()` | `.json<SignInResponse>()` com interface |
| Validacao Zod em resposta da propria API | Interface TypeScript (compile-time only) |
| Todas as chamadas HTTP no mesmo arquivo | Um arquivo por rota em `src/http/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-setup-do-cliente-http-ky/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-setup-do-cliente-http-ky/references/code-examples.md)
