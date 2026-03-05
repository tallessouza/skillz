---
name: rs-node-js-2023-tratando-env-com-zod
description: "Enforces environment variable validation with Zod schemas in Node.js/TypeScript projects. Use when user asks to 'setup env variables', 'validate environment', 'create env config', 'configure dotenv', or 'add environment variables'. Applies Zod schema validation with type inference, safeParse error handling, and centralized env export. Make sure to use this skill whenever setting up or modifying environment variables in any Node.js backend project. Not for frontend env configs, Docker env files, or CI/CD environment setup."
---

# Tratando Variáveis Ambiente com Zod

> Valide todas as variáveis ambiente com um schema Zod centralizado antes de qualquer código da aplicação executar.

## Rules

1. **Centralize em `src/env/index.ts`** — todas as variáveis ambiente passam por um único arquivo, porque isso garante validação antes de qualquer uso e tipagem automática em toda a aplicação
2. **Use `z.object()` para o schema completo** — defina todas as variáveis num único schema, não valide individualmente, porque o Zod valida tudo de uma vez e retorna todos os erros juntos
3. **Use `safeParse` em vez de `parse`** — porque `safeParse` permite criar mensagens de erro customizadas e legíveis antes de lançar a exceção
4. **Exporte `env` tipado, nunca `process.env` direto** — porque `env.DATABASE_URL` tem autocomplete e tipo correto, `process.env.DATABASE_URL` é `string | undefined`
5. **Defina `.default()` para variáveis opcionais** — como `PORT` e `NODE_ENV`, porque a aplicação deve funcionar sem elas com valores sensatos
6. **Use `z.enum()` para valores restritos** — como `NODE_ENV`, porque impede valores inválidos como typos em "production"

## How to write

### Schema centralizado

```typescript
// src/env/index.ts
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('⚠️ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
```

### Consumindo em qualquer arquivo

```typescript
import { env } from './env'

// Tipado automaticamente — autocomplete funciona
const port = env.PORT        // number
const dbUrl = env.DATABASE_URL // string
const nodeEnv = env.NODE_ENV  // 'development' | 'test' | 'production'
```

## Example

**Before (validação manual espalhada):**
```typescript
import 'dotenv/config'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required')
}
// Não valida tipo, não valida formato
// Sem autocomplete, sem tipagem
```

**After (com Zod centralizado):**
```typescript
import { env } from './env'

// Validação já aconteceu no boot da aplicação
// Se chegou aqui, DATABASE_URL existe e é string
const knex = setupKnex({ connection: env.DATABASE_URL })

app.listen({ port: env.PORT }) // number, com default 3333
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Variável obrigatória sem default | `z.string()` — app falha no boot se ausente |
| Variável com valor padrão | `z.string().default('valor')` ou `z.coerce.number().default(3333)` |
| Variável restrita a opcoes | `z.enum(['opt1', 'opt2']).default('opt1')` |
| Variável numérica vinda de env | `z.coerce.number()` — porque `process.env` sempre retorna string |
| Adicionando nova variável | Adicione ao schema + `.env` + `.env.example` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `process.env.DATABASE_URL` espalhado no código | `env.DATABASE_URL` importado de `src/env` |
| `if (!process.env.VAR) throw ...` manual | Schema Zod com `safeParse` centralizado |
| `envSchema.parse(process.env)` sem tratamento | `envSchema.safeParse()` com `console.error` + `throw` |
| `z.string()` para PORT (vem como string do env) | `z.coerce.number()` para converter automaticamente |
| `.env.example` sem `NODE_ENV` | Sempre incluir `NODE_ENV=development` no example |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
