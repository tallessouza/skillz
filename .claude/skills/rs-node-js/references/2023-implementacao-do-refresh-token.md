---
name: rs-node-js-2023-refresh-token
description: "Generates refresh token controller and route implementation for Fastify JWT applications. Use when user asks to 'implement refresh token', 'create token refresh route', 'handle JWT renewal', 'revalidate user token', or 'implement token rotation'. Applies cookie-based refresh token pattern with Fastify jwtVerify onlyCookie option. Make sure to use this skill whenever implementing authentication token renewal in Node.js APIs. Not for OAuth flows, session-based auth, or third-party auth providers."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: refresh-token
  tags: [jwt, refresh-token, fastify, authentication, cookies, security]
---

# Implementacao do Refresh Token

> Crie uma rota dedicada que revalida o JWT do usuario a partir do refresh token armazenado nos cookies, sem exigir o token de autorizacao no header.

## Rules

1. **Use metodo PATCH para a rota de refresh** — `PATCH /token/refresh`, porque semanticamente e uma atualizacao de recurso unico (o token), nao criacao de recurso novo
2. **Nunca exija autenticacao via header na rota de refresh** — essa rota existe justamente para quando o token do header ja expirou, o frontend chama ela quando o usuario perdeu a autenticacao
3. **Use `onlyCookie: true` no jwtVerify** — valida o refresh token nos cookies em vez do bearer token no header Authorization, porque o refresh token vive nos cookies HttpOnly
4. **Gere novo token E novo refresh token a cada refresh** — rotacao completa garante que o refresh token tambem se renova, mantendo a janela de validade deslizante
5. **Nao acesse o banco de dados na rota de refresh** — a validacao e puramente via JWT, tornando a rota rapida e leve em recursos
6. **Retorne o novo JWT no body e o novo refresh token como cookie** — separacao clara: token de acesso no body para o frontend usar, refresh token no cookie HttpOnly para seguranca

## How to write

### Controller de Refresh Token

```typescript
// src/http/controllers/refresh.ts
import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  // Valida APENAS pelo cookie, ignora header Authorization
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user

  // Gera novo token de acesso
  const token = await reply.jwtSign(
    { role },
    { sign: { sub: request.user.sub } },
  )

  // Gera novo refresh token (rotacao)
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

### Registro da rota

```typescript
// No arquivo de rotas
import { refresh } from './controllers/refresh'

// SEM middleware de autenticacao — intencional
app.patch('/token/refresh', refresh)
```

## Example

**Before (erro comum — exigir auth no refresh):**
```typescript
// ERRADO: coloca middleware de auth na rota de refresh
app.patch('/token/refresh', { onRequest: [verifyJWT] }, refresh)

// Dentro do controller, tenta ler do header
await request.jwtVerify() // Falha porque o token expirou
```

**After (com esta skill aplicada):**
```typescript
// CORRETO: sem middleware de auth
app.patch('/token/refresh', refresh)

// Dentro do controller, le do cookie
await request.jwtVerify({ onlyCookie: true })
// Continua = refresh token valido, gera novos tokens
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Frontend detecta token expirado (401) | Chamar PATCH /token/refresh antes de redirecionar para login |
| Precisa invalidar login de usuario especifico | Salvar refresh token no banco e invalidar o registro |
| Rota de refresh retorna 401 | Refresh token tambem expirou, redirecionar para login |
| Precisa de RBAC no refresh | Inclua `role` no payload do sign, leia de `request.user` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Exigir Bearer token na rota de refresh | Usar `jwtVerify({ onlyCookie: true })` |
| Retornar refresh token no body da resposta | Retornar refresh token como cookie HttpOnly |
| Consultar banco de dados para validar refresh token simples | Confiar na validacao JWT (sem banco) |
| Usar GET para rota de refresh | Usar PATCH (atualizacao de recurso) |
| Manter o mesmo refresh token apos uso | Gerar novo refresh token (rotacao) |

## Teste E2E

```typescript
test('should be able to refresh a token', async () => {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'john@example.com',
    password: '123456',
  })

  const cookies = authResponse.get('Set-Cookie')

  const response = await request(app.server)
    .patch('/token/refresh')
    .set('Cookie', cookies)
    .send()

  expect(response.status).toBe(200)
  expect(response.body).toEqual({ token: expect.any(String) })
  expect(response.get('Set-Cookie')).toEqual([
    expect.stringContaining('refreshToken='),
  ])
})
```

## Troubleshooting

### Rota de refresh retorna 401 mesmo com cookie valido
**Symptom:** A requisicao PATCH /token/refresh falha com Unauthorized
**Cause:** A rota tem middleware de autenticacao (verifyJWT) que exige Bearer token no header, conflitando com o proposito do refresh
**Fix:** Remova o middleware de autenticacao da rota de refresh e use request.jwtVerify({ onlyCookie: true }) dentro do controller

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
