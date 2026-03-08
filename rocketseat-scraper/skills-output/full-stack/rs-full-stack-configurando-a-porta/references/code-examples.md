# Code Examples: Configurando Variáveis de Ambiente com Zod

## Exemplo 1 — Setup completo do env.ts

```typescript
// src/env.ts
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)
```

## Exemplo 2 — Usando env no server.ts

```typescript
// src/server.ts
import fastify from "fastify"
import { env } from "./env"

const app = fastify()

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server running on port ${env.PORT}`)
})
```

## Exemplo 3 — Arquivo .gitignore relevante

```gitignore
node_modules
.env
```

## Exemplo 4 — Arquivo .env-example

```
DATABASE_URL=
JWT_SECRET=
PORT=
```

## Exemplo 5 — Arquivo .env preenchido (nunca commitado)

```
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
JWT_SECRET=minha-chave-secreta
PORT=3333
```

## Exemplo 6 — Comportamento do Zod com diferentes valores de PORT

```typescript
// PORT=3000 no .env
const env = envSchema.parse(process.env)
console.log(env.PORT) // 3000 (número, convertido de string)

// PORT= (vazio) no .env
const env = envSchema.parse(process.env)
console.log(env.PORT) // 0 (string vazia coerce para 0)

// Sem PORT no .env (linha removida)
const env = envSchema.parse(process.env)
console.log(env.PORT) // 3333 (default do Zod)
```

## Exemplo 7 — Variação com Express (mesmo padrão)

```typescript
// env.ts — mesmo arquivo, funciona com qualquer framework
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)

// server.ts com Express
import express from "express"
import { env } from "./env"

const app = express()

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`)
})
```

## Exemplo 8 — Adicionando mais variáveis ao schema

```typescript
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
  // Novas variáveis seguindo o mesmo padrão:
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_BASE_URL: z.string().url().optional(),
  MAX_FILE_SIZE_IN_MB: z.coerce.number().default(10),
})

export const env = envSchema.parse(process.env)
```

## Exemplo 9 — Erro do Zod quando variável obrigatória falta

```
// Se DATABASE_URL não existir no .env:
ZodError: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": ["DATABASE_URL"],
    "message": "Required"
  }
]
```

Esse erro aparece **imediatamente ao iniciar a aplicação**, não quando o código tenta usar a variável. Isso é o valor da validação centralizada com Zod.