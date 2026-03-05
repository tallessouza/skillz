# Code Examples: Tratando Variáveis Ambiente com Zod

## Setup completo passo a passo

### 1. Instalar Zod

```bash
npm install zod
```

### 2. Criar `src/env/index.ts`

```typescript
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('⚠️ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
```

### 3. Usar no database.ts

```typescript
// ANTES — validação manual
import 'dotenv/config'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL env not found.')
}

export const knex = setupKnex({
  client: 'sqlite',
  connection: { filename: databaseUrl },
})

// DEPOIS — importa env validado
import { env } from './env'

export const knex = setupKnex({
  client: 'sqlite',
  connection: { filename: env.DATABASE_URL },
})
```

### 4. Usar no server.ts

```typescript
import { env } from './env'

app.listen({ port: env.PORT }, () => {
  console.log(`Server running on port ${env.PORT}`)
})
```

### 5. Arquivos .env

```env
# .env
NODE_ENV=development
DATABASE_URL=./db/app.db

# .env.example
NODE_ENV=development
DATABASE_URL=
```

## Erro quando variável falta

Ao executar sem `DATABASE_URL`:

```
⚠️ Invalid environment variables {
  DATABASE_URL: {
    _errors: ['Required']
  }
}
Error: Invalid environment variables.
```

## Variações de tipos comuns

```typescript
const envSchema = z.object({
  // String obrigatória
  DATABASE_URL: z.string(),
  
  // String com formato específico
  API_URL: z.string().url(),
  
  // Número (coerce porque process.env retorna string)
  PORT: z.coerce.number().default(3333),
  
  // Enum com default
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  
  // Opcional (pode não existir)
  SENTRY_DSN: z.string().optional(),
  
  // Boolean (vem como string "true"/"false")
  ENABLE_LOGGING: z.string().transform(v => v === 'true').default('false'),
})
```

## Diferença visual: `parse` vs `safeParse`

```typescript
// Com parse — erro automático do Zod (técnico, pouco legível)
const env = envSchema.parse(process.env)

// Com safeParse — controle total sobre o erro
const _env = envSchema.safeParse(process.env)
if (_env.success === false) {
  console.error('⚠️ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}
export const env = _env.data
```