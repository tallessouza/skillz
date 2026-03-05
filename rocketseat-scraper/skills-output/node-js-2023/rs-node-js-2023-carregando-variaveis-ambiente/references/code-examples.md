# Code Examples: Carregando Variáveis Ambiente

## Estrutura de arquivos

```
src/
├── env/
│   └── index.ts    # Validação e export do env
├── server.ts       # Usa env.PORT
└── ...
.env                # Valores reais (no .gitignore)
.env.example        # Template (commitado)
```

## `.env`

```env
NODE_ENV=dev
PORT=3333
```

## `.env.example`

```env
NODE_ENV=dev
PORT=3333
```

## `src/env/index.ts` — Completo

```typescript
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables.')
}

export const env = _env.data
```

## `src/server.ts` — Usando o env tipado

```typescript
import { env } from './env'

// env.PORT é number, com autocomplete
app.listen({
  host: '0.0.0.0',
  port: env.PORT,
})
```

## Instalação das dependências

```bash
npm install dotenv
npm install zod
```

## Variação: Adicionando DATABASE_URL

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(), // obrigatória, sem default — crash se faltar
})
```

## Variação: Adicionando JWT_SECRET com validação de tamanho

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32), // mínimo 32 caracteres
})
```

## Output do erro formatado

Quando uma variável obrigatória falta, o `error.format()` produz algo como:

```
❌ Invalid environment variables {
  DATABASE_URL: {
    _errors: [ 'Required' ]
  }
}
```

Isso torna imediatamente claro qual variável está faltando e qual é o problema.