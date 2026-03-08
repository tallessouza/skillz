---
name: rs-nextjs-app-router-fetch-api-wrapper
description: "Applies Next.js Fetch API wrapper pattern when creating data fetching layers in Next.js applications. Use when user asks to 'create an API client', 'fetch data in Next.js', 'setup data fetching', 'create API wrapper', or 'configure base URL for requests'. Enforces native Fetch API over Axios to preserve Next.js caching extensions, env validation with Zod, and URL constructor pattern. Make sure to use this skill whenever building data fetching infrastructure in Next.js App Router projects. Not for generic React data fetching, REST API design, or backend route handler creation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [next-js, fetch-api, api-wrapper, zod, env-validation, caching, data-fetching]
---

# Fetch API Wrapper no Next.js App Router

> Usar a Fetch API nativa (nunca Axios) no Next.js porque o framework estende o fetch com funcionalidades de caching que se perdem com XMLHttpRequest.

## Rules

1. **Nunca use Axios no Next.js** — Axios usa XMLHttpRequest por baixo, e o Next.js estende apenas a Fetch API nativa para adicionar caching e revalidation. Usar Axios significa perder todas essas funcionalidades.
2. **Crie um wrapper com base URL** — a Fetch API nao suporta base URL nativamente, entao crie uma funcao `api()` que usa o constructor `new URL(path, baseUrl)` para concatenar automaticamente.
3. **Valide variaveis de ambiente com Zod** — crie um `env.ts` que faz `safeParse` do `process.env` e lanca erro se invalido, porque a aplicacao nao deve executar sem variaveis obrigatorias.
4. **Prefixe com NEXT_PUBLIC_** — variaveis de ambiente que precisam estar disponiveis no client-side devem comecar com `NEXT_PUBLIC_`, senao ficam visiveis apenas no server-side.
5. **Use `new URL()` para concatenar paths** — nunca concatene strings manualmente. O constructor `URL` lida com barras e encoding corretamente.
6. **Repasse RequestInit ao fetch** — o wrapper deve aceitar e repassar `init?: RequestInit` para permitir configuracao de cache, headers, method etc.

## How to write

### Arquivo env.ts (validacao de variaveis)

```typescript
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error(
    'Invalid environment variables',
    parsedEnv.error.flatten().fieldErrors,
  )
  throw new Error('Invalid environment variables')
}

export const env = parsedEnv.data
```

### Arquivo api.ts (wrapper)

```typescript
import { env } from '@/env'

export function api(path: string, init?: RequestInit) {
  const baseUrl = env.NEXT_PUBLIC_API_BASE_URL
  const url = new URL(path, baseUrl)

  return fetch(url, init)
}
```

### Uso em paginas/componentes

```typescript
import { api } from '@/data/api'

const response = await api('/products')
const products = await response.json()
```

## Example

**Before (Axios — perde caching do Next.js):**
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

const { data } = await api.get('/products')
```

**After (Fetch wrapper — preserva caching):**
```typescript
import { api } from '@/data/api'

const response = await api('/products')
const products = await response.json()
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de base URL no fetch | Crie wrapper com `new URL(path, base)` |
| Variavel de ambiente no client | Prefixe com `NEXT_PUBLIC_` |
| Multiplas variaveis de ambiente | Valide todas com Zod schema no `env.ts` |
| Precisa passar headers/cache config | Use parametro `init?: RequestInit` no wrapper |
| Biblioteca de fetching (SWR, React Query) | OK se baseada em Fetch API, nao XMLHttpRequest |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `import axios from 'axios'` em projeto Next.js | `fetch()` ou wrapper sobre fetch |
| `baseURL + '/products'` (concatenacao manual) | `new URL('/products', baseURL)` |
| `process.env.VAR` direto sem validacao | `env.VAR` via Zod safeParse |
| Variavel client sem prefixo `NEXT_PUBLIC_` | `NEXT_PUBLIC_API_BASE_URL` |
| `throw` sem `console.error` antes | Log do erro formatado + throw |

## Troubleshooting

### Dados cacheados nao atualizam apos mutacao
**Symptom:** Apos criar/editar/deletar, a listagem mostra dados antigos
**Cause:** Cache do Next.js serve a versao antiga da pagina
**Fix:** Usar `revalidatePath('/caminho')` ou `revalidateTag('tag')` na server action apos a mutacao. Verificar que o path passado corresponde exatamente a rota da listagem

### fetch retorna dados stale em producao
**Symptom:** Dados frescos em desenvolvimento mas desatualizados em producao
**Cause:** Em producao, Next.js aplica cache agressivo por padrao em fetch requests
**Fix:** Adicionar `{ cache: 'no-store' }` ao fetch para desabilitar cache, ou usar `{ next: { revalidate: N } }` para ISR

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-criando-fetch-api-wrapper/references/deep-explanation.md) — O instrutor explica que o Axios e um wrapper sobre a **XMLHttpRequest**, que e a API antiga dos nave
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-criando-fetch-api-wrapper/references/code-examples.md) — NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
