---
name: rs-api-com-bun-rota-envio-auth-link
description: "Applies Elysia route separation and Drizzle ORM query patterns when building authentication routes with Bun. Use when user asks to 'create auth route', 'send magic link', 'implement passwordless auth', 'query with Drizzle', or 'separate Elysia routes'. Covers route modularization, Drizzle select vs query API, URL constructor for auth links, and env-based redirect. Make sure to use this skill whenever implementing authentication or Drizzle queries in Elysia/Bun projects. Not for email sending implementation, session management, or cookie-based auth."
---

# Rota de Envio do Link de Autenticacao

> Separe rotas Elysia em arquivos individuais e use a query API do Drizzle para consultas simples, reservando select/from/where para queries complexas.

## Rules

1. **Separe cada rota em seu proprio arquivo** — crie uma nova instancia `new Elysia()` por arquivo e registre com `.use()` no server principal, porque isso mantem o server limpo e cada rota isolada
2. **Use `db.query.tabela.findFirst()` para queries simples** — a sintaxe com `where` como funcao e operators desestruturados e mais legivel que `db.select().from().where()`, porque se assemelha ao Prisma e evita desestruturacao de array
3. **Reserve `db.select().from().where()` para queries complexas** — joins, subqueries e operacoes avancadas precisam do controle fino do select builder, porque a query API nao suporta essas operacoes
4. **Use o construtor `URL` para montar links de autenticacao** — passe o path como primeiro argumento e o dominio como segundo, depois use `searchParams.set()` para code e redirect, porque isso evita concatenacao manual e garante encoding correto
5. **Valide variaveis de ambiente com schema** — `apiBaseUrl` e `authRedirectUrl` devem estar no schema de env, porque falhas silenciosas em URLs quebram todo o fluxo de auth
6. **Gere codigos de autenticacao com cuid2** — use `createId()` do `@paralleldrive/cuid2` para o campo `code` da tabela `auth_links`, porque ja esta no projeto e gera IDs unicos sem colisao

## How to write

### Rota separada em Elysia

```typescript
// src/http/routes/send-auth-link.ts
import Elysia, { t } from 'elysia'
import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'
import { createId } from '@paralleldrive/cuid2'
import { env } from '../../env'
import { eq } from 'drizzle-orm'

export const sendAuthLink = new Elysia().post(
  '/authenticate',
  async ({ body }) => {
    const { email } = body

    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    if (!userFromEmail) {
      throw new Error('User not found.')
    }

    const authLinkCode = createId()

    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
    })

    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)
    authLink.searchParams.set('code', authLinkCode)
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    // TODO: enviar email com authLink.toString()
    console.log(authLink.toString())
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
    }),
  },
)
```

### Registro no server principal

```typescript
// src/http/server.ts
import { sendAuthLink } from './routes/send-auth-link'

app.use(sendAuthLink)
```

### Drizzle: query API vs select builder

```typescript
// QUERY API — para consultas simples (findFirst/findMany)
const user = await db.query.users.findFirst({
  where(fields, { eq }) {
    return eq(fields.email, email)
  },
})
// Retorna objeto direto (ou undefined)

// SELECT BUILDER — para queries complexas
const [user] = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
// Retorna array, precisa desestruturar
```

## Example

**Before (tudo no server.ts, select builder para query simples):**
```typescript
app.post('/authenticate', async ({ body }) => {
  const [userFromEmail] = await db
    .select()
    .from(users)
    .where(eq(users.email, body.email))

  const link = `http://localhost:3333/auth-links/authenticate?code=${code}`
})
```

**After (rota separada, query API, URL constructor):**
```typescript
// routes/send-auth-link.ts
export const sendAuthLink = new Elysia().post(
  '/authenticate',
  async ({ body }) => {
    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, body.email)
      },
    })

    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)
    authLink.searchParams.set('code', authLinkCode)
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)
  },
)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Query com join ou subquery | Use `db.select().from().where()` |
| Buscar um registro por campo unico | Use `db.query.tabela.findFirst()` |
| Buscar varios registros simples | Use `db.query.tabela.findMany()` |
| Montar URL com query params | Use `new URL()` + `searchParams.set()` |
| Codigo/token unico | Use `createId()` do cuid2 |
| URL base da API | Coloque em variavel de ambiente, nunca hardcode |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Todas as rotas em `server.ts` | Um arquivo por rota, registre com `.use()` |
| `` `${base}/path?code=${code}` `` | `new URL('/path', base)` + `searchParams.set()` |
| `const [user] = await db.select()...` para query simples | `db.query.users.findFirst()` |
| `where: eq(users.email, email)` na query API | `where(fields, { eq }) { return eq(fields.email, email) }` |
| `http://localhost:3333` hardcoded no codigo | `env.API_BASE_URL` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-rota-envio-do-link-de-autenticacao/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-rota-envio-do-link-de-autenticacao/references/code-examples.md)
