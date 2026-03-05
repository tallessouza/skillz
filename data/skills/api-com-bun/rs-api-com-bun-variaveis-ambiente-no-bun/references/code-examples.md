# Code Examples: Variaveis Ambiente no Bun

## Exemplo 1: Setup basico do .env.local

```bash
# .env.local
DATABASE_URL=postgresql://docker:docker@localhost:5432/api-com-bun
```

Nao precisa de nenhum import ou configuracao. Qualquer comando `bun` ja tera acesso via `process.env.DATABASE_URL`.

## Exemplo 2: env.ts completo com Zod

```typescript
// src/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
})

export const env = envSchema.parse(process.env)
```

O `envSchema.parse()` faz duas coisas:
1. Valida que todas as variaveis existem e estao no formato correto
2. Retorna um objeto tipado (TypeScript infere os tipos do schema)

## Exemplo 3: Uso no drizzle.config.ts

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './.migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
```

## Exemplo 4: Uso no arquivo de migrate

```typescript
// src/db/migrate.ts
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from '.'
import { env } from '../env'
import chalk from 'chalk'

await migrate(db, { migrationsFolder: './.migrations' })

console.log(chalk.greenBright('Migrations applied successfully'))

process.exit(0)
```

## Exemplo 5: Package.json scripts

```json
{
  "scripts": {
    "dev": "bun --watch src/server.ts",
    "db:migrate": "bun src/db/migrate.ts",
    "db:studio": "bun drizzle-kit studio"
  }
}
```

Note que no `db:studio` nao precisa de `npx` — o Bun resolve binarios de dependencias automaticamente.

## Exemplo 6: env.ts expandido (variacoes comuns)

```typescript
// src/env.ts — versao com mais variaveis
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().url().optional(),
})

export const env = envSchema.parse(process.env)
```

### Padroes de validacao por tipo:

| Tipo | Schema Zod |
|------|-----------|
| URL obrigatoria | `z.string().url().min(1)` |
| Porta numerica | `z.coerce.number().default(3333)` |
| Enum com default | `z.enum(['dev', 'prod']).default('dev')` |
| Secret com minimo | `z.string().min(32)` |
| URL opcional | `z.string().url().optional()` |
| Boolean | `z.coerce.boolean().default(false)` |

## Exemplo 7: Chalk — cores disponiveis

```typescript
import chalk from 'chalk'

// Cores de texto
console.log(chalk.green('Sucesso'))
console.log(chalk.greenBright('Sucesso (claro)'))
console.log(chalk.red('Erro'))
console.log(chalk.yellow('Aviso'))
console.log(chalk.blue('Info'))

// Cores de fundo
console.log(chalk.bgGreen(' OK '))
console.log(chalk.bgRed(' FAIL '))

// Combinacoes
console.log(chalk.bold.greenBright('Migrations applied successfully'))
```