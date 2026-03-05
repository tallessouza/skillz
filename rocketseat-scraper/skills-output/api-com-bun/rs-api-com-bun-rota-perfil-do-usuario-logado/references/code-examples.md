# Code Examples: Rota de Perfil do Usuario Autenticado

## Exemplo completo do plugin de autenticacao

```typescript
// src/http/authentication.ts
import Elysia from 'elysia'
import jwt from '@elysiajs/jwt'
import cookie from '@elysiajs/cookie'

export const auth = new Elysia()
  .use(jwt({ secret: process.env.JWT_SECRET! }))
  .use(cookie())
  .derive(({ jwt, cookie }) => {
    return {
      signUser: async (payload: { sub: string; restaurantId: string }) => {
        const token = await jwt.sign(payload)
        cookie.auth = token
      },

      signOut: () => {
        cookie.auth = ''
      },

      getCurrentUser: async () => {
        const payload = await jwt.verify(cookie.auth)

        if (!payload) {
          throw new Error('Unauthorized')
        }

        return {
          userId: payload.sub,
          restaurantId: payload.restaurantId,
        }
      },
    }
  })
```

## Exemplo completo da rota getProfile

```typescript
// src/http/routes/get-profile.ts
import Elysia from 'elysia'
import { auth } from '../authentication'
import { db } from '../../db/connection'
import { eq } from 'drizzle-orm'

export const getProfile = new Elysia()
  .use(auth)
  .get('/me', async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    const user = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId)
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  })
```

## Registrando a rota no server

```typescript
// src/http/server.ts
import Elysia from 'elysia'
import { getProfile } from './routes/get-profile'
import { sendAuthLink } from './routes/send-auth-link'
import { authenticateFromLink } from './routes/authenticate-from-link'

const app = new Elysia()
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(getProfile)
  .listen(3333)

console.log('HTTP server running on port 3333')
```

## Consulta com Drizzle ORM — variacao com select especifico

```typescript
// Se quiser retornar apenas campos especificos (nao mostrado na aula,
// mas util para nao expor dados sensiveis)
const user = await db.query.users.findFirst({
  columns: {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    // password hash, tokens, etc. ficam de fora
  },
  where(fields, { eq }) {
    return eq(fields.id, userId)
  },
})
```

## Testando via httpie (CLI)

```bash
# Autenticar primeiro (pegar o link do console)
http POST localhost:3333/authenticate email=admin@admin.com

# Copiar o URL de autenticacao do log e acessar
# O problema: httpie nao gerencia cookies facilmente entre requisicoes

# Com sessao salva (mais trabalhoso):
http --session=pizzashop GET localhost:3333/authenticate-from-link?token=...&redirect=...
http --session=pizzashop GET localhost:3333/me
```

## Testando via Hopscotch

1. Criar requisicao POST `http://localhost:3333/authenticate` com body `{ "email": "admin@admin.com" }`
2. Copiar URL de autenticacao da resposta
3. Criar requisicao GET com essa URL
4. Copiar o valor do header `Set-Cookie` da resposta
5. Em Cookies > adicionar dominio `localhost`
6. Colar o cookie string
7. Criar requisicao GET `http://localhost:3333/me`
8. Enviar — deve retornar dados do usuario