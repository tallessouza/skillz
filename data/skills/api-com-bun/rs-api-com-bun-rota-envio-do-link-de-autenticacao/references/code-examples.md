# Code Examples: Rota de Envio do Link de Autenticacao

## Exemplo completo: arquivo de rota separado

```typescript
// src/http/routes/send-auth-link.ts
import Elysia, { t } from 'elysia'
import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'
import { createId } from '@paralleldrive/cuid2'
import { env } from '../../env'

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

    console.log(authLink.toString())
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
    }),
  },
)
```

## Registro no server

```typescript
// src/http/server.ts
import { sendAuthLink } from './routes/send-auth-link'
import { registerRestaurant } from './routes/register-restaurant'

const app = new Elysia()
  .use(registerRestaurant)
  .use(sendAuthLink)
  .listen(3333)
```

## Validacao de env

```typescript
// src/env.ts
import { z } from 'zod' // ou t do elysia

const envSchema = z.object({
  API_BASE_URL: z.string().url(),
  AUTH_REDIRECT_URL: z.string().url(),
  // ... outras vars
})

export const env = envSchema.parse(process.env)
```

## .env

```env
API_BASE_URL=http://localhost:3333
AUTH_REDIRECT_URL=http://localhost:5173
```

## Drizzle: select builder (query complexa)

```typescript
import { eq } from 'drizzle-orm'
import { users } from '../db/schema'

// Retorna array — precisa desestruturar
const [userFromEmail] = await db
  .select()
  .from(users)
  .where(eq(users.email, email))

// Para selecionar campos especificos:
const [result] = await db
  .select({ id: users.id, name: users.name })
  .from(users)
  .where(eq(users.email, email))
```

## Drizzle: query API (query simples)

```typescript
// findFirst — retorna objeto ou undefined
const userFromEmail = await db.query.users.findFirst({
  where(fields, { eq }) {
    return eq(fields.email, email)
  },
})

// findMany — retorna array
const allManagers = await db.query.users.findMany({
  where(fields, { eq }) {
    return eq(fields.role, 'manager')
  },
})
```

## Testando com httpie

```bash
# Enviar requisicao de autenticacao
http POST localhost:3333/authenticate email=admin@admin.com
```

## URL constructor — anatomia

```typescript
const authLink = new URL('/auth-links/authenticate', 'http://localhost:3333')
// authLink.href = "http://localhost:3333/auth-links/authenticate"

authLink.searchParams.set('code', 'abc123')
// authLink.href = "http://localhost:3333/auth-links/authenticate?code=abc123"

authLink.searchParams.set('redirect', 'http://localhost:5173')
// authLink.href = "http://localhost:3333/auth-links/authenticate?code=abc123&redirect=http%3A%2F%2Flocalhost%3A5173"

console.log(authLink.toString())
// Output completo com encoding correto
```