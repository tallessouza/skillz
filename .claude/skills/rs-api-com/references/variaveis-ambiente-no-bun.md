---
name: rs-api-com-bun-variaveis-ambiente
description: "Enforces Bun environment variable validation with Zod when setting up env configuration. Use when user asks to 'setup env', 'configure environment variables', 'validate env vars', 'use .env with Bun', or 'create env.ts'. Applies Zod schema validation of process.env, .env.local usage, typed exports. Make sure to use this skill whenever configuring env vars in Bun projects. Not for Node.js dotenv (use rs-node-js), Docker env (use rs-devops), or CI/CD secrets."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: api-com-bun
  module: setup
  tags: [bun, env, zod, validation, environment-variables]
---

# Variaveis Ambiente no Bun

> Toda variavel ambiente deve ser validada com Zod antes de usar — nunca confie em process.env diretamente.

## Rules

1. **Bun le .env automaticamente** — sem dotenv
2. **Use `.env.local` para dev** — prioridade e nao vai pro git
3. **Crie `env.ts` com Zod** — garante existencia e formato
4. **Valide formato** — `z.string().url().min(1)`, nao apenas `z.string()`
5. **Exporte `env` tipado** — nunca `process.env` direto
6. **Um ponto de acesso** — `import { env } from '@/env'`

## How to write

```typescript
// src/env.ts
import { z } from 'zod'
const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
  JWT_SECRET_KEY: z.string().min(1),
  API_BASE_URL: z.string().url().min(1),
})
export const env = envSchema.parse(process.env)
```

## Example

**Before:** `process.env.DATABASE_URL` — pode ser undefined
**After:** `env.DATABASE_URL` — tipado, validado, falha cedo

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `process.env.DB_URL` direto | `env.DATABASE_URL` |
| `import dotenv` em Bun | Nada — Bun carrega .env |
| `z.string()` sem formato | `z.string().url().min(1)` |

## Troubleshooting

### Zod parse falha
**Fix:** Verifique `.env.local` tem todas as variaveis com valores validos.

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo
- [code-examples.md](references/code-examples.md) — Exemplos expandidos
