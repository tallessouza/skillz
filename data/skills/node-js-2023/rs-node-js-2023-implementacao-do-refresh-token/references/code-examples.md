# Code Examples: Implementacao do Refresh Token

## Exemplo completo do controller

```typescript
// src/http/controllers/refresh.ts
import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  // onlyCookie: true → ignora Authorization header, valida apenas cookie
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
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

## Registro da rota (sem middleware de auth)

```typescript
// src/http/routes.ts
import { refresh } from './controllers/refresh'

export async function appRoutes(app: FastifyInstance) {
  // ... outras rotas

  // Rota de refresh SEM o hook de verificacao de autenticacao
  // Porque essa rota e chamada justamente quando o token expirou
  app.patch('/token/refresh', refresh)
}
```

## Comparacao: authenticate vs refresh

```typescript
// authenticate.ts — gera tokens a partir de credenciais (email/senha)
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  // Valida credenciais via use case (bate no banco)
  const { user } = await authenticateUseCase.execute({
    email: request.body.email,
    password: request.body.password,
  })

  const token = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id } },
  )

  const refreshToken = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id, expiresIn: '7d' } },
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

// refresh.ts — gera tokens a partir do refresh token (NÃO bate no banco)
export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    { sign: { sub: request.user.sub } },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    { sign: { sub: request.user.sub, expiresIn: '7d' } },
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

## Teste E2E completo

```typescript
// src/http/controllers/__tests__/refresh.spec.ts
import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    // 1. Criar usuario
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // 2. Fazer login para obter tokens
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    // 3. Capturar cookies da resposta (contem o refresh token)
    const cookies = authResponse.get('Set-Cookie')

    // 4. Chamar rota de refresh enviando os cookies
    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    // 5. Validar resposta
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
```

## Demonstracao no Insomnia

O instrutor demonstra:
1. Criar rota `PATCH http://localhost:3333/token/refresh`
2. **Nao enviar nada no header Authorization** — campo vazio
3. Enviar request → recebe novo token no body
4. Na aba Cookies do Insomnia, verificar que um novo cookie `refreshToken` foi criado
5. Chamar a rota novamente → funciona infinitamente, sempre gerando tokens novos

## Estrategia futura: refresh token no banco

```typescript
// Estrategia mencionada pelo instrutor para invalidacao de usuarios
// NAO implementada nesta aula, mas sugerida como evolucao

// Na criacao do refresh token:
await prisma.refreshToken.create({
  data: {
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
})

// Para invalidar um usuario:
await prisma.refreshToken.updateMany({
  where: { userId: targetUserId },
  data: { revoked: true },
})

// Na validacao, alem do JWT, checar no banco:
const storedToken = await prisma.refreshToken.findFirst({
  where: { token: refreshTokenValue, revoked: false },
})
if (!storedToken) throw new UnauthorizedError()
```