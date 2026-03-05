---
name: rs-api-com-bun-variaveis-ambiente
description: "Applies Bun environment variable patterns when setting up a Bun project or configuring env vars. Use when user asks to 'setup env', 'configure environment variables', 'create a Bun project', 'validate env vars', or 'use .env with Bun'. Enforces Zod validation of process.env, .env.local file usage, and typed env exports. Make sure to use this skill whenever creating or configuring a Bun-based project. Not for Node.js dotenv setup, Docker env, or CI/CD secrets management."
---

# Variaveis Ambiente no Bun

> Toda variavel ambiente deve ser validada com Zod antes de ser usada no codigo — nunca confie em process.env diretamente.

## Rules

1. **Bun le .env automaticamente** — nao precisa de dotenv ou qualquer biblioteca extra, porque o Bun ja carrega `.env`, `.env.local`, `.env.production` etc em todo comando executado
2. **Use `.env.local` para desenvolvimento** — porque `.env.local` tem prioridade e nao vai pro repositorio
3. **Sempre crie um arquivo `env.ts` com validacao Zod** — porque garante que variaveis existem e estao no formato correto antes do app iniciar
4. **Valide formato, nao apenas existencia** — use `z.string().url().min(1)` ao inves de apenas `z.string()`, porque uma string vazia passa na validacao basica mas quebra em runtime
5. **Exporte `env` tipado, nunca use `process.env` diretamente** — porque o objeto validado tem tipagem correta e falha cedo se algo estiver faltando
6. **Importe `env` de `@/env` em todo lugar que precisar** — um unico ponto de acesso, porque evita `process.env.VARIAVEL` espalhado pelo codigo

## How to write

### Arquivo .env.local

```bash
# .env.local (raiz do projeto)
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
```

### Validacao com Zod (env.ts)

```typescript
// src/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
})

export const env = envSchema.parse(process.env)
```

### Uso no codigo

```typescript
// drizzle.config.ts
import { env } from './src/env'

export default {
  dbCredentials: {
    url: env.DATABASE_URL,
  },
}
```

## Example

**Before (sem validacao):**
```typescript
// drizzle.config.ts
export default {
  dbCredentials: {
    url: process.env.DATABASE_URL, // pode ser undefined, sem tipagem
  },
}
```

**After (com env.ts validado):**
```typescript
// src/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
})

export const env = envSchema.parse(process.env)

// drizzle.config.ts
import { env } from './src/env'

export default {
  dbCredentials: {
    url: env.DATABASE_URL, // tipado como string, validado como URL
  },
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova variavel ambiente adicionada | Adicione ao envSchema em env.ts |
| Variavel eh uma URL | Use `z.string().url().min(1)` |
| Variavel eh um numero (porta) | Use `z.coerce.number()` |
| Variavel eh opcional | Use `.optional().default('valor')` |
| Precisa de feedback visual em CLI | Use chalk como devDependency |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `process.env.DATABASE_URL` direto no codigo | `env.DATABASE_URL` via env.ts validado |
| `import dotenv from 'dotenv'` em projeto Bun | Nada — Bun carrega .env automaticamente |
| `z.string()` sem min ou formato | `z.string().url().min(1)` com validacao real |
| `.env` com secrets commitado no git | `.env.local` (adicione .env.local ao .gitignore) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
