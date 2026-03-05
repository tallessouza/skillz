# Code Examples: Rota de Logout e Derivação no ElysiaJS

## Exemplo 1: Modulo auth completo com derive

```typescript
// src/auth.ts
import Elysia, { Static } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { env } from './env'

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayload,
    }),
  )
  .derive({ as: 'scoped' }, ({ jwt, cookie: { auth } }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload)

        auth.value = token
        auth.httpOnly = true
        auth.maxAge = 60 * 60 * 24 * 7 // 7 days
        auth.path = '/'
      },

      signOut: () => {
        auth.remove()
      },
    }
  })
```

## Exemplo 2: Rota de logout

```typescript
// src/routes/sign-out.ts
import Elysia from 'elysia'
import { auth } from '../auth'

export const signout = new Elysia()
  .use(auth)
  .post('/sign-out', async ({ signOut }) => {
    signOut()
  })
```

## Exemplo 3: Rota de autenticacao consumindo signUser

```typescript
// src/routes/authenticate-from-link.ts
import Elysia from 'elysia'
import { auth } from '../auth'

export const authenticateFromLink = new Elysia()
  .use(auth)
  .get('/auth-links/authenticate', async ({ signUser, query }) => {
    // ... validacao do codigo do link ...

    const authLinkFromCode = /* busca do link */
    const managedRestaurant = /* busca do restaurante */

    await signUser({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id,
    })

    // redirect...
  })
```

## Exemplo 4: Registrando no server

```typescript
// src/server.ts
import { signout } from './routes/sign-out'

const app = new Elysia()
  .use(signout)
  // ... outras rotas
  .listen(3000)
```

## Exemplo 5: Derive simples (demonstracao do conceito)

O instrutor demonstra que derive pode retornar qualquer coisa:

```typescript
// Demonstracao — retornando dados simples
export const auth = new Elysia()
  .derive({ as: 'scoped' }, () => {
    return {
      name: 'Diego', // qualquer rota que usar .use(auth) tera acesso a { name }
    }
  })

// Na rota consumidora:
.get('/test', ({ name }) => {
  // name === 'Diego'
})
```

## Exemplo 6: Tipagem com Static do TypeBox

```typescript
import { Static } from 'elysia'
import { t } from 'elysia'

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

// ERRADO — retorna tipo TypeBox (TObject<...>)
type Wrong = typeof jwtPayload

// CORRETO — retorna tipo TypeScript nativo ({ sub: string, restaurantId?: string })
type Correct = Static<typeof jwtPayload>
```