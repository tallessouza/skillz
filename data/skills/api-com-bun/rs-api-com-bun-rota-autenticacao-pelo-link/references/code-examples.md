# Code Examples: Autenticacao por Magic Link (ElysiaJS)

## Exemplo completo: auth.ts (modulo compartilhado)

```typescript
// src/http/auth.ts
import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { env } from '../env'

export const auth = new Elysia().use(
  jwt({
    secret: env.JWT_SECRET_KEY,
    schema: t.Object({
      sub: t.String(),
      restaurantId: t.Optional(t.String()),
    }),
  }),
)
```

**Nota:** Nas versoes atuais do ElysiaJS, nao e necessario instalar `@elysiajs/cookie`. Cookies sao nativos do framework.

## Exemplo completo: authenticateFromLink

```typescript
// src/http/routes/authenticate-from-link.ts
import { Elysia, t } from 'elysia'
import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { auth } from '../auth'
import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'

export const authenticateFromLink = new Elysia().use(auth).get(
  '/auth-links/authenticate',
  async ({ query, jwt, cookie: { auth }, set }) => {
    const { code, redirect } = query

    // 1. Buscar auth link pelo codigo
    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code)
      },
    })

    if (!authLinkFromCode) {
      throw new Error('Auth link not found.')
    }

    // 2. Verificar expiracao (7 dias)
    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.createdAt,
      'days',
    )

    if (daysSinceAuthLinkWasCreated > 7) {
      throw new Error('Auth link expired, please generate a new one.')
    }

    // 3. Buscar restaurante gerenciado (opcional)
    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId)
      },
    })

    // 4. Gerar JWT
    const token = await jwt.sign({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id,
    })

    // 5. Salvar token no cookie
    auth.value = token
    auth.httpOnly = true
    auth.maxAge = 60 * 60 * 24 * 7 // 7 days
    auth.path = '/'

    // 6. Deletar auth link (single-use)
    await db.delete(authLinks).where(eq(authLinks.code, code))

    // 7. Redirecionar usuario
    set.redirect = redirect
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)
```

## Registro da rota no server

```typescript
// src/http/server.ts
import { Elysia } from 'elysia'
import { authenticateFromLink } from './routes/authenticate-from-link'

const app = new Elysia()
  .use(authenticateFromLink)
  // ... outras rotas
  .listen(3333)
```

## Testando a rota

### Via browser (recomendado para esta rota)

Acesse diretamente no navegador:
```
http://localhost:3333/auth-links/authenticate?code=SEU_CODIGO&redirect=http://localhost:5173
```

O navegador redireciona para o `redirect` URL e salva o cookie automaticamente.

### Via HTTPie

```bash
# Primeiro, gere o auth link
http POST localhost:3333/authenticate email=user@example.com

# Copie o codigo do console.log e use na rota
http GET "localhost:3333/auth-links/authenticate?code=CODIGO&redirect=http://localhost:5173"
```

### Verificando o cookie

1. Abra DevTools no navegador (F12)
2. Va em Application > Cookies
3. Verifique o cookie `auth` com o JWT
4. Copie o JWT e cole em jwt.io para inspecionar o payload

## Schema do JWT payload

```typescript
// O schema define o formato do payload
t.Object({
  sub: t.String(),                    // userId (obrigatorio)
  restaurantId: t.Optional(t.String()), // restaurantId (opcional)
})

// Resultado decodificado no jwt.io:
{
  "sub": "clx1abc123...",           // ID do usuario
  "restaurantId": "clx2def456...", // ID do restaurante (ou undefined)
  "iat": 1234567890                 // issued at (automatico)
}
```

## Fluxo completo de autenticacao

```
1. Usuario informa email → POST /authenticate
2. Backend gera auth link com codigo unico
3. Backend "envia email" com URL contendo code + redirect
4. Usuario clica no link → GET /auth-links/authenticate?code=X&redirect=Y
5. Backend valida codigo, verifica expiracao
6. Backend gera JWT com userId + restaurantId
7. Backend salva JWT no cookie httpOnly
8. Backend deleta auth link do banco (single-use)
9. Backend redireciona usuario para redirect URL
10. Browser carrega redirect URL ja com cookie de autenticacao
```