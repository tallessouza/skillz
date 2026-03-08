---
name: rs-nextjs-app-router-env-vars
description: "Enforces correct environment variable separation between client and server in Next.js App Router projects using t3-env. Use when user asks to 'add env variables', 'configure environment', 'setup t3-env', 'create env file', or any Next.js project setup involving process.env. Validates NEXT_PUBLIC_ prefix usage and Zod schemas for both contexts. Make sure to use this skill whenever setting up or modifying environment variables in Next.js projects. Not for generic Node.js env configuration, Docker env files, or non-Next.js frameworks."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [env-variables, t3-env, next-js, zod, NEXT_PUBLIC, client-server, environment]
---

# Variaveis Ambiente: Client e Server no Next.js

> Separe variaveis de ambiente entre client e server usando t3-env com validacao Zod, garantindo que dados sensiveis nunca vazem para o browser.

## Rules

1. **Prefixe variaveis client com NEXT_PUBLIC_** — `NEXT_PUBLIC_API_URL` nao `API_URL`, porque o Next.js so expoe variaveis prefixadas para Client Components
2. **Use t3-env para validacao tipada** — `@t3-oss/env-nextjs` com Zod, porque valida separadamente client/server e da erro em build se faltar variavel
3. **Declare variaveis em runtimeEnv** — repita cada variavel com `process.env.NOME`, porque o Next.js faz tree-shaking de variaveis nao referenciadas no codigo
4. **Nunca acesse variavel server em Client Component** — o t3-env bloqueia isso em dev e build, porque dados sensiveis (API keys, secrets) nao devem chegar ao browser
5. **Centralize em um unico arquivo env.ts** — importe `env` de `@/env` em toda a aplicacao, porque evita `process.env` espalhado sem validacao

## How to write

### Arquivo env.ts com t3-env

```typescript
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    APP_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    API_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  },
  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    API_SECRET: process.env.API_SECRET,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
})
```

### Uso em Server Component

```typescript
import { env } from '@/env'

// Acesso a qualquer variavel (server + client)
const apiUrl = env.APP_URL
const publicUrl = env.NEXT_PUBLIC_API_BASE_URL
```

### Uso em Client Component

```typescript
'use client'
import { env } from '@/env'

// Apenas variaveis NEXT_PUBLIC_ disponiveis
const apiBaseUrl = env.NEXT_PUBLIC_API_BASE_URL
// env.APP_URL -> ERRO em dev e build
```

## Example

**Before (sem separacao, propenso a erro):**

```typescript
import { z } from 'zod'

const envSchema = z.object({
  APP_URL: z.string().url(),
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
})

// Valida tudo junto — quebra em Client Components
// porque APP_URL nao existe no contexto client
export const env = envSchema.parse(process.env)
```

**After (com t3-env):**

```typescript
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    APP_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  },
  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
})
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Variavel contem secret, key, token, password | Coloque em `server`, sem prefixo NEXT_PUBLIC_ |
| Variavel precisa ser lida no browser | Prefixe com NEXT_PUBLIC_, coloque em `client` |
| Nova variavel adicionada ao .env | Adicione no schema Zod E no runtimeEnv |
| Build falha com "missing env" | Verifique se runtimeEnv tem process.env.NOME para cada variavel |
| Projeto nao usa t3-env | Instale `@t3-oss/env-nextjs` (leve, sem overhead) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `process.env.API_URL` direto no codigo | `env.API_URL` importado de `@/env` |
| Validar todas variaveis num schema unico | Separar em `server` e `client` no createEnv |
| Esquecer runtimeEnv | Repetir cada variavel com `process.env.NOME` |
| Usar variavel server em Client Component | Mover para `client` com prefixo NEXT_PUBLIC_ |
| Criar multiplos arquivos env por contexto | Um unico `env.ts` com createEnv separando contextos |

## Troubleshooting

### Erro ao usar hooks em Server Component
**Symptom:** Erro "useState/useEffect is not a function" ou "Hooks can only be called inside a Client Component"
**Cause:** Tentativa de usar hooks React (useState, useEffect, useSession) em um componente sem a diretiva "use client"
**Fix:** Adicionar `"use client"` no topo do arquivo OU extrair a parte interativa para um componente-folha separado com "use client"

### Server Component nao consegue ser async apos adicionar "use client"
**Symptom:** Erro ao usar `async function Component()` com `"use client"`
**Cause:** Client Components nao suportam async/await — essa e uma restricao fundamental do React
**Fix:** Remover "use client" e usar async/await direto (Server Component), ou manter "use client" e buscar dados via hooks (useEffect, React Query)

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-variaveis-ambiente-client-e-server/references/deep-explanation.md) — O Next.js faz uma distincao fundamental entre codigo que roda no servidor e codigo que roda no brows
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-variaveis-ambiente-client-e-server/references/code-examples.md) — npm install @t3-oss/env-nextjs
