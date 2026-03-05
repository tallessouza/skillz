# Code Examples: Estrategia de Refresh Token

## Setup completo do app.ts

```typescript
import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { env } from './env'

export const app = fastify()

// 1. Registrar plugin de cookies (necessario antes do JWT cookie)
app.register(fastifyCookie)

// 2. Registrar JWT com configuracao de cookie e expiracao
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken', // nome do cookie que contem o refresh token
    signed: false,              // JWT ja e assinado internamente
  },
  sign: {
    expiresIn: '10m', // access token expira em 10 minutos
  },
})
```

## Controller de autenticacao completo

```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  // ... validacao de usuario e senha ...

  // Access token — expiracao curta (10min, configurado no app)
  const token = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id } },
  )

  // Refresh token — expiracao longa (7 dias)
  const refreshToken = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',        // todas as rotas podem ler
      secure: true,     // apenas HTTPS
      sameSite: true,   // apenas mesmo dominio
      httpOnly: true,   // inacessivel por JavaScript
    })
    .status(200)
    .send({ token })
}
```

## Rota de refresh (sera implementada na proxima aula)

```typescript
// Estrutura esperada da rota de refresh
export async function refresh(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // jwtVerify com cookie: true busca o token do cookie automaticamente
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user
  const { sub } = request.user

  // Gerar novo access token
  const token = await reply.jwtSign(
    { role },
    { sign: { sub } },
  )

  // Gerar novo refresh token (rotacao)
  const refreshToken = await reply.jwtSign(
    { role },
    { sign: { sub, expiresIn: '7d' } },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
```

## Instalacao das dependencias

```bash
npm install @fastify/jwt @fastify/cookie
```

## Integracao CORS para frontend separado

```typescript
import cors from '@fastify/cors'

// No app.ts
app.register(cors, {
  origin: true,       // aceita qualquer origem (restringir em producao)
  credentials: true,  // permite cookies cross-origin
})
```

```typescript
// No frontend (Axios)
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3333',
  withCredentials: true, // envia cookies automaticamente
})
```

## Verificando no Insomnia/Postman

Apos fazer POST para `/sessions` com email e senha:

1. **Body da resposta** contera: `{ "token": "eyJhbG..." }`
2. **Aba Cookies** mostrara: `refreshToken=eyJhbG...` com flags:
   - Secure: true
   - HttpOnly: true
   - SameSite: Strict
   - Domain: localhost
   - Path: /

O refresh token **nao aparece** no body — ele so existe no cookie.

## Estrutura do token JWT decodificado

```json
// Header
{ "alg": "HS256", "typ": "JWT" }

// Payload do access token
{
  "role": "ADMIN",
  "sub": "user-uuid-here",
  "iat": 1700000000,    // issued at (automatico)
  "exp": 1700000600     // expira em 10 minutos (iat + 600s)
}

// Payload do refresh token
{
  "role": "ADMIN",
  "sub": "user-uuid-here",
  "iat": 1700000000,
  "exp": 1700604800     // expira em 7 dias (iat + 604800s)
}
```

O campo `iat` (issuedAt) e gerado automaticamente em todo JWT — e o epochTimestamp (segundos desde 1 de janeiro de 1970) de quando o token foi criado. O backend compara `exp` com a data atual para determinar se o token ainda e valido.