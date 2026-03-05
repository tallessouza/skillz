---
name: rs-saas-nextjs-rbac-variaveis-ambiente
description: "Applies environment variable configuration patterns in Next.js monorepo projects. Use when user asks to 'setup env variables', 'configure environment', 'use env in Next.js', 'monorepo env setup', or 'load .env in turborepo'. Covers dotenv-cli for monorepos, @t3-oss/env-nextjs shared/server/client separation, and NEXT_PUBLIC_ prefix rules. Make sure to use this skill whenever configuring environment variables in Next.js monorepo frontends. Not for backend-only env setup, Docker env, or CI/CD secrets configuration."
---

# Variáveis Ambiente em Next.js Monorepo

> Em monorepos, o Next.js não lê .env da raiz automaticamente — use dotenv-cli para carregar e @t3-oss/env para validar e expor variáveis com type-safety.

## Rules

1. **Use dotenv-cli no script dev** — `pnpm env:load next dev`, porque o Next.js só lê `.env` da raiz do próprio pacote, não do monorepo root
2. **Não adicione env:load nos scripts de build/start** — esses comandos são para produção, onde variáveis são injetadas pelo ambiente (Vercel, Docker, etc.), porque `.env` é exclusivo de desenvolvimento
3. **Separe variáveis em server, client e shared** — variáveis acessadas no browser E no servidor vão em `shared`, não em `server`, porque `server` bloqueia acesso client-side
4. **Prefixe com NEXT_PUBLIC_ variáveis do client/shared** — o Next.js só expõe ao browser variáveis com esse prefixo, porque é um mecanismo de segurança contra vazamento de secrets
5. **Valide com Zod no env package** — `z.string().url()` para URLs, `z.string()` para IDs, porque variáveis inválidas devem falhar no boot, não em runtime
6. **Importe `env` do pacote compartilhado** — `import { env } from '@saas/env'`, nunca `process.env` direto, porque perde type-safety e validação

## How to write

### Script dev com dotenv-cli

```json
// apps/web/package.json
{
  "scripts": {
    "env:load": "dotenv -e ../../.env --",
    "dev": "pnpm env:load next dev"
  }
}
```

### Env package com separação correta

```typescript
// packages/env/index.ts
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
})
```

### Uso no código

```typescript
// Correto: import tipado
import { env } from '@saas/env'

const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
})

// GitHub OAuth
const githubSignInURL = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${env.GITHUB_CLIENT_REDIRECT_URL}`
```

## Example

**Before (acesso direto sem validação):**
```typescript
const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
})

const githubUrl = `...?client_id=${process.env.GITHUB_CLIENT_ID}`
```

**After (com env package tipado):**
```typescript
import { env } from '@saas/env'

const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
})

const githubUrl = `...?client_id=${env.GITHUB_CLIENT_ID}`
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Variável usada só no servidor (DB, secrets) | Coloque em `server` |
| Variável usada só no browser | Coloque em `client`, prefixe com NEXT_PUBLIC_ |
| Variável usada em ambos (API URL) | Coloque em `shared`, prefixe com NEXT_PUBLIC_ |
| Monorepo com .env na raiz | Instale dotenv-cli no pacote web |
| Script de build/start | Não adicione env:load — produção injeta variáveis |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `process.env.NEXT_PUBLIC_API_URL` direto no código | `env.NEXT_PUBLIC_API_URL` via pacote env |
| Variável shared dentro de `server: {}` | Mova para `shared: {}` |
| `dotenv-cli` no script de `build` | Apenas no script de `dev` |
| `.env` dentro de `apps/web/` em monorepo | `.env` na raiz do monorepo + dotenv-cli |
| Variável sem validação Zod | `z.string().url()` ou schema apropriado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-utilizando-variaveis-ambiente/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-utilizando-variaveis-ambiente/references/code-examples.md)
