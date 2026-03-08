---
name: rs-saas-nextjs-rbac-variaveis-ambiente-backend
description: "Applies backend environment variable patterns when configuring Fastify/Node.js APIs in SaaS monorepos. Use when user asks to 'configure env variables', 'setup environment for API', 'validate env with Zod', 'configure JWT secret', or 'load database URL'. Enforces Zod validation on boot, typed env object, separation between dev and production env loading, and secure secret management. Make sure to use this skill whenever configuring environment variables for Node.js/Fastify backends in monorepo projects. Not for frontend env variables (use rs-saas-nextjs-rbac-utilizando-variaveis-ambiente), CI/CD secrets, or Docker env configuration."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: deploy
  tags: [saas, environment-variables, fastify, nodejs, zod, backend, configuration]
---

# Variaveis de Ambiente no Backend (Fastify/Node.js)

> Valide todas as variaveis de ambiente no boot da aplicacao com Zod, nunca acesse `process.env` diretamente no codigo de negocio.

## Rules

1. **Valide env no boot com Zod** — crie um schema Zod que parse `process.env` ao iniciar, porque variaveis faltantes devem falhar imediatamente, nao em runtime quando um usuario faz uma requisicao
2. **Exporte um objeto `env` tipado** — `export const env = envSchema.parse(process.env)`, porque `process.env.VAR` retorna `string | undefined` enquanto `env.VAR` retorna o tipo correto
3. **Use `z.coerce.number()` para portas** — `PORT` vem como string do ambiente, coerce converte automaticamente, porque evita `parseInt` manual espalhado pelo codigo
4. **Separe .env por contexto** — `.env` na raiz do monorepo para desenvolvimento, variaveis injetadas pela plataforma em producao, porque `.env` nao deve existir em producao
5. **JWT_SECRET nunca tem valor padrao** — use `z.string()` sem `.default()`, porque um secret com valor padrao e equivalente a nao ter secret
6. **DATABASE_URL valide como URL** — use `z.string().url()`, porque uma URL malformada vai falhar na primeira query, nao no boot

## How to write

### Schema de variaveis de ambiente

```typescript
// src/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  GITHUB_OAUTH_CLIENT_ID: z.string(),
  GITHUB_OAUTH_CLIENT_SECRET: z.string(),
  GITHUB_OAUTH_CLIENT_REDIRECT_URI: z.string().url(),
  PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)
```

### Usando env tipado no servidor

```typescript
// src/http/server.ts
import { env } from '../env'

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server running on port ${env.PORT}`)
})
```

### Usando env no JWT

```typescript
import { env } from '../env'

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
```

## Example

**Before (process.env direto, sem validacao):**
```typescript
const port = parseInt(process.env.PORT || '3333')
const secret = process.env.JWT_SECRET || 'default-secret' // INSEGURO

app.register(fastifyJwt, { secret })
app.listen({ port })
```

**After (env validado com Zod):**
```typescript
import { env } from './env'

app.register(fastifyJwt, { secret: env.JWT_SECRET })
app.listen({ port: env.PORT, host: '0.0.0.0' })
// Se JWT_SECRET nao existir, app falha no boot com mensagem clara
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Variavel numerica (PORT) | Use `z.coerce.number()` |
| Variavel URL (DATABASE_URL, redirect) | Use `z.string().url()` |
| Secret (JWT_SECRET, OAuth) | Use `z.string()` sem `.default()` |
| Variavel opcional com fallback | Use `z.string().default('valor')` |
| Monorepo com .env na raiz | Use dotenv-cli no script dev do backend |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `process.env.PORT \|\| '3333'` | `z.coerce.number().default(3333)` no schema |
| `process.env.JWT_SECRET \|\| 'secret'` | `z.string()` sem default — falhe no boot |
| `process.env.VAR` espalhado pelo codigo | `import { env } from './env'` com objeto tipado |
| `.env` no repositorio (git) | `.env` no `.gitignore`, `.env.example` commitado |
| Validar env na primeira requisicao | Validar no boot com `envSchema.parse(process.env)` |

## Troubleshooting

### App nao inicia: "ZodError: Required"
**Symptom:** Aplicacao falha no boot com erro de validacao Zod
**Cause:** Variavel de ambiente obrigatoria nao esta definida no `.env` ou no ambiente
**Fix:** Verifique que o arquivo `.env` existe na raiz do monorepo e contem todas as variaveis listadas no schema. Em producao, configure na plataforma de deploy

### Porta ja em uso ao iniciar o servidor
**Symptom:** Erro `EADDRINUSE` ao executar `pnpm dev`
**Cause:** Outra instancia do servidor esta rodando na mesma porta
**Fix:** Encerre o processo anterior ou altere a variavel `PORT` no `.env`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
