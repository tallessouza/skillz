# Code Examples: Setup de API Hono com Drizzle e Better Auth

## Catch-all Route Handler completo

```typescript
// src/app/api/[...route]/route.ts
import { handle } from 'hono/vercel'
import app from '@/api'

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
export const PUT = handle(app)
```

**Por que `@/api` e nao `../../../api`?** O Next.js ja configura o path alias `@` no tsconfig.json apontando para `src/`. Isso evita imports relativos profundos e ilegíveis.

## Validacao de ambiente com Zod

```typescript
// src/api-env.ts
import { z } from 'zod'

const envSchema = z.object({
  POSTGRESQL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
```

Se qualquer variavel estiver faltando ou invalida, o Zod lanca erro imediatamente no startup — nao em runtime durante uma request.

## Docker Compose

```yaml
services:
  postgres:
    image: postgres:latest
    container_name: board-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: board
    ports:
      - "5432:5432"
```

```bash
# Subir o container em background
docker compose up -d
```

## Drizzle Config

```typescript
// drizzle.config.ts (raiz do projeto)
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/api/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRESQL!,
  },
})
```

## .env completo

```env
POSTGRESQL=postgresql://postgres:postgres@localhost:5432/board
BETTER_AUTH_SECRET=<string-de-32-caracteres-gerada>
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=<copiar-do-oauth-app>
GITHUB_CLIENT_SECRET=<gerar-no-oauth-app>
```

## Package.json scripts para banco

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/api/db/seed.ts"
  }
}
```

## Dependencias com versoes fixas

```json
{
  "dependencies": {
    "@faker-js/faker": "10.0.0",
    "@hono/zod-openapi": "1.1.3",
    "@scalar/hono-api-reference": "0.9.19",
    "better-auth": "1.3.24",
    "drizzle-orm": "0.44.5",
    "hono": "4.9.9",
    "postgres": "3.4.7",
    "zod": "4.1.11"
  },
  "devDependencies": {
    "@types/pg": "8.15.5",
    "drizzle-kit": "0.31.5",
    "tsx": "latest",
    "dotenv": "latest"
  }
}
```

## Exemplo de query Drizzle (estilo SQL)

```typescript
// Exemplo do estilo Drizzle mencionado pelo instrutor
const newIssue = await db
  .insert(issues)
  .values({
    title: 'Nova feature',
    description: 'Descricao da feature',
    authorId: userId,
  })
  .returning()
```

Comparado com SQL puro: `INSERT INTO issues (title, description, author_id) VALUES (...) RETURNING *` — a estrutura e quase identica, mas com type safety do TypeScript.

## Adapters do Hono por runtime

```typescript
// Vercel (projeto Next.js deployado na Vercel)
import { handle } from 'hono/vercel'

// Node.js puro
import { handle } from 'hono/node'

// Bun
import { handle } from 'hono/bun'

// Cloudflare Workers
import { handle } from 'hono/cloudflare-workers'
```

O mesmo app Hono funciona em qualquer runtime — so muda o import do adapter.

## GitHub OAuth App — Callback URL

```
http://localhost:3000/api/auth/callback/github
```

Esta URL precisa ser exatamente igual no campo "Authorization callback URL" do GitHub OAuth App. O GitHub redireciona o usuario para essa URL apos autenticacao — diferente de outros providers que detectam automaticamente.