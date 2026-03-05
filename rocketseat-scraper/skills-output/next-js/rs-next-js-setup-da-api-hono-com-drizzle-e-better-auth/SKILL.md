---
name: rs-next-js-setup-api-hono-drizzle-betterauth
description: "Applies Hono + Drizzle + BetterAuth API setup pattern inside Next.js App Router projects. Use when user asks to 'setup API in Next.js', 'integrate Hono with Next', 'configure BetterAuth', 'add Drizzle ORM', or 'create catch-all route handler'. Follows wildcard route handler pattern, env validation with Zod, Docker Postgres setup, and OAuth configuration. Make sure to use this skill whenever scaffolding a full-stack Next.js project with separate API layer. Not for standalone backend projects, serverless functions outside Next.js, or Prisma-based setups."
---

# Setup de API Hono com Drizzle e Better Auth no Next.js

> Integre uma API Hono completa dentro do App Router do Next.js usando catch-all route handlers, Drizzle ORM com Postgres, e BetterAuth para autenticacao.

## Rules

1. **API fica em `src/api/`, nao em `src/app/`** — porque o App Router cuida apenas do roteamento, a logica da API vive separada
2. **Use catch-all route handler `[...route]`** — porque todo path apos `/api/` deve ser delegado ao Hono, nao ao Next.js
3. **Exporte todos os metodos HTTP no route handler** — `GET`, `POST`, `PATCH`, `DELETE`, `PUT`, porque o wildcard recebe todas as chamadas
4. **Importe Hono via `hono/vercel`** — porque o Hono adapta ao runtime; use `hono/node` para Node puro, `hono/vercel` para deploy na Vercel
5. **Valide variaveis ambiente com Zod** — crie um `api-env.ts` dedicado, porque falhar cedo evita bugs silenciosos em runtime
6. **Fixe versoes de bibliotecas em evolucao rapida** — BetterAuth, Hono, Drizzle devem ter versao exata no package.json, porque breaking changes sao frequentes

## Prerequisites

- Docker instalado e configurado (para Postgres local)
- Node.js 18+
- pnpm (ou npm/yarn)
- Conta GitHub com OAuth App configurada

## Steps

### Step 1: Estrutura de pastas

```
src/
├── api/              # API Hono completa (copiada/criada separadamente)
│   ├── db/
│   │   ├── schema.ts
│   │   └── seed.ts
│   ├── routes/
│   └── index.ts      # Export default do app Hono
├── api-env.ts        # Validacao de env com Zod
└── app/
    └── api/
        └── [...route]/
            └── route.ts  # Wildcard route handler
```

### Step 2: Catch-all route handler

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

### Step 3: Validacao de ambiente

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

### Step 4: Docker Compose para Postgres

```yaml
# docker-compose.yml (raiz do projeto)
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

### Step 5: Variaveis ambiente

```env
POSTGRESQL=postgresql://postgres:postgres@localhost:5432/board
BETTER_AUTH_SECRET=<gerar em betterauth.com/docs - 32 chars>
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=<do OAuth App>
GITHUB_CLIENT_SECRET=<do OAuth App>
```

### Step 6: OAuth App no GitHub

1. GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
2. Homepage URL: qualquer valor
3. Authorization Callback URL: `http://localhost:3000/api/auth/callback/github` (exato)
4. Copiar Client ID e gerar Client Secret

### Step 7: Instalar dependencias e migrar

```bash
pnpm install
docker compose up -d
pnpm db:migrate
pnpm db:seed
```

## Output format

Apos completar o setup:
- `localhost:3000/api` — API funcionando (retorna unauthorized se auth necessaria)
- `localhost:3000/api/docs` — Documentacao Scalar navegavel
- Banco populado com dados fictícios via seed

## Error handling

- Se `internal server error` nas rotas: rodar `pnpm db:migrate` (tabelas nao criadas)
- Se seed falha com modulo nao encontrado: instalar `tsx` como devDependency
- Se seed falha com env nao carregado: instalar `dotenv` como devDependency
- Se banco bagunçado: rodar `pnpm db:seed` novamente (faz truncate automatico)
- Se OAuth falha: verificar callback URL exata no GitHub OAuth App

## Heuristics

| Situacao | Faca |
|----------|------|
| Deploy na Vercel | Import de `hono/vercel` |
| Deploy em Node puro | Import de `hono/node` |
| Projeto full-stack Next.js | BetterAuth funciona integrado |
| Backend separado do frontend | BetterAuth foi feito para isso (vantagem sobre NextAuth) |
| Biblioteca mudando rapido (BetterAuth, Hono) | Fixar versao exata no package.json |
| Biblioteca estavel (Zod, Scalar) | Pode usar `^` no package.json |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Colocar pasta `api/` dentro de `app/` | Colocar em `src/api/` separado |
| Exportar apenas `GET` no catch-all | Exportar todos os metodos HTTP |
| Usar NextAuth com backend separado | Usar BetterAuth (feito para esse cenario) |
| Instalar deps sem fixar versao | Fixar versoes de libs em evolucao rapida |
| Criar API estatica sem banco | Usar API real para exercitar cache do Next.js |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
