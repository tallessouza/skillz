# Code Examples: Rota de Autenticacao via Senha

## Exemplo completo da rota

```typescript
import { compare } from 'bcryptjs'
import { z } from 'zod'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with email and password',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (!userFromEmail) {
        return reply.status(400).send({ message: 'invalidCredentials' })
      }

      if (userFromEmail.passwordHash === null) {
        return reply.status(400).send({
          message: 'User does not have a password. Use social login.',
        })
      }

      const isPasswordValid = await compare(
        password,
        userFromEmail.passwordHash,
      )

      if (!isPasswordValid) {
        return reply.status(400).send({ message: 'invalidCredentials' })
      }

      const token = await reply.jwtSign(
        { sub: userFromEmail.id },
        { sign: { expiresIn: '7d' } },
      )

      return reply.status(201).send({ token })
    },
  )
}
```

## Registro do FastifyJWT no server

```typescript
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'

const app = fastify()

app.register(fastifyJwt, {
  secret: 'myJWTsecret',
})

// Registrar rotas
app.register(authenticateWithPassword)
```

## Registro da rota no server

```typescript
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'

// No arquivo server.ts
app.register(authenticateWithPassword)
```

## Testando a rota

### Login com credenciais corretas
```bash
# POST /sessions/password
curl -X POST http://localhost:3333/sessions/password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "123456"}'

# Response 201:
# { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

### Login com senha incorreta
```bash
curl -X POST http://localhost:3333/sessions/password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "wrong"}'

# Response 400:
# { "message": "invalidCredentials" }
```

### Verificando o token no jwt.io

Ao decodificar o token gerado, o payload contem:
```json
{
  "sub": "clxxxxxxxx-user-id",
  "iat": 1700000000,
  "exp": 1700604800
}
```

- `sub`: ID do usuario (subject)
- `iat`: timestamp de criacao (issued at)
- `exp`: timestamp de expiracao (7 dias apos criacao)

## Instalacao do @fastify/jwt

```bash
npm install @fastify/jwt
```

## Variacao: JWT com mais claims (nao recomendado pelo instrutor)

```typescript
// O instrutor opta por manter o payload minimo
// mas tecnicamente voce poderia incluir mais dados:
const token = await reply.jwtSign(
  {
    sub: userFromEmail.id,
    // NAO recomendado — JWT e decodificavel por qualquer pessoa
    // email: userFromEmail.email,
    // role: userFromEmail.role,
  },
  { sign: { expiresIn: '7d' } },
)
```