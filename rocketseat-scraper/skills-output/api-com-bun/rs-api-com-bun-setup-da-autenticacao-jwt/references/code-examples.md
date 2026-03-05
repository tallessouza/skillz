# Code Examples: Setup da Autenticação JWT no Elysia

## Exemplo completo da aula

### 1. Instalação dos pacotes

```bash
bun add @elysiajs/jwt @elysiajs/cookie
```

### 2. Variável de ambiente

```env
# .env
JWT_SECRET_KEY=minha-chave-super-secreta-gerada-aleatoriamente
```

Formas de gerar um secret seguro:
```bash
# Via openssl
openssl rand -hex 32

# Via node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Via bun
bun -e "console.log(crypto.randomUUID())"
```

### 3. Configuração no server.ts

```typescript
import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { cookie } from '@elysiajs/cookie'
import { env } from '../env'

const app = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: t.Object({
        sub: t.String(),
        restaurantId: t.Optional(t.String()),
      }),
    })
  )
  .use(cookie())
```

### 4. Schema do payload detalhado

```typescript
// sub = subject — a quem pertence o token (padrão JWT)
// restaurantId = opcional, preenchido se o usuário for manager de um restaurante

schema: t.Object({
  sub: t.String(),                      // ID do usuário (obrigatório)
  restaurantId: t.Optional(t.String()), // ID do restaurante (se for manager)
})
```

## Variações e contextos

### Se precisasse de mais claims no payload:

```typescript
schema: t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
  role: t.Optional(t.Union([
    t.Literal('manager'),
    t.Literal('customer'),
  ])),
})
```

### Se usasse RS256 ao invés de HS256:

```typescript
import { readFileSync } from 'fs'

jwt({
  algorithm: 'RS256',
  privateKey: readFileSync('./keys/private.pem', 'utf-8'),
  publicKey: readFileSync('./keys/public.pem', 'utf-8'),
  schema: t.Object({
    sub: t.String(),
  }),
})
```

### Uso futuro em uma rota (preview):

```typescript
app.post('/authenticate', async ({ jwt, setCookie, body }) => {
  const token = await jwt.sign({
    sub: user.id,
    restaurantId: managedRestaurant?.id,
  })

  setCookie('auth', token, {
    httpOnly: true,
    maxAge: 7 * 86400, // 7 dias
    path: '/',
  })
})
```

### Validação futura em uma rota (preview):

```typescript
app.get('/orders', async ({ jwt, cookie }) => {
  const payload = await jwt.verify(cookie.auth)

  if (!payload) {
    throw new UnauthorizedError()
  }

  // payload.sub → string (tipado!)
  // payload.restaurantId → string | undefined (tipado!)
  const orders = await db.query.orders.findMany({
    where: eq(orders.restaurantId, payload.restaurantId),
  })
})
```