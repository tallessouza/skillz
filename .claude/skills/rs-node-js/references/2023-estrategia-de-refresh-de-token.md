---
name: 2023-estrategia-de-refresh-de-token
description: "Implements JWT refresh token strategy with short-lived access tokens in response body and long-lived refresh tokens in HttpOnly cookies using Fastify JWT and @fastify/cookie. Use when user asks to 'implement refresh token', 'set up JWT with cookies', 'configure token rotation', or 'add persistent authentication'. Make sure to use this skill whenever implementing authentication that needs to persist user sessions beyond a single access token lifetime in Fastify. Not for session-based auth, OAuth2 flows, or non-Fastify frameworks."
category: coding-lens
tags: [cookies, fastify, jwt, refresh-token, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: autenticacao-jwt
  tags: [jwt, refresh-token, cookies, httpOnly, fastify, authentication, security]
---

# Estrategia de Refresh Token com JWT

> Ao implementar autenticacao JWT, use dois tokens: um access token de curta duracao visivel ao frontend, e um refresh token de longa duracao enviado via cookie HttpOnly invisivel ao cliente.

## Rules

1. **Access token com expiracao curta** — configure `expiresIn` entre 5-15 minutos, porque se alguem obtiver acesso malicioso, o dano e limitado a esse intervalo
2. **Refresh token com expiracao longa mas finita** — use 7-30 dias, nunca infinito, porque se alguem tiver acesso ao refresh token com duracao infinita, tera acesso permanente a conta
3. **Refresh token via cookie HttpOnly** — nunca retorne o refresh token no body da resposta, porque cookies HttpOnly nao sao acessiveis por JavaScript no browser, protegendo contra XSS
4. **Configure todas as opcoes de seguranca do cookie** — `path`, `secure`, `sameSite`, `httpOnly`, porque cada opcao protege contra um vetor de ataque diferente
5. **Access token no body, refresh token no cookie** — essa separacao e intencional, porque o access token precisa ser lido pelo frontend para headers de autorizacao, mas o refresh token nao

## How to write

### Configuracao do Fastify JWT com expiracao

```typescript
// app.ts — registrar JWT com expiracao curta
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m', // access token expira em 10 minutos
  },
})
```

### Registrar o plugin de cookies

```typescript
import fastifyCookie from '@fastify/cookie'

app.register(fastifyCookie)
```

### Controller de autenticacao com dois tokens

```typescript
// authenticate.controller.ts
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
```

## Example

**Before (token unico sem refresh):**
```typescript
const token = await reply.jwtSign({}, { sign: { sub: user.id } })
return reply.status(200).send({ token })
// Usuario perde acesso quando token expira, precisa logar de novo
```

**After (com refresh token strategy):**
```typescript
const token = await reply.jwtSign(
  { role: user.role },
  { sign: { sub: user.id } }, // expira em 10m (configurado no app)
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
// Usuario so perde acesso se ficar 7 dias sem entrar
```

## Heuristics

| Situacao | Acao |
|----------|------|
| App onde usuario fica logado permanentemente | Refresh token com 7-30 dias de expiracao |
| App com dados sensiveis (banco, saude) | Access token 5min, refresh token 1-7 dias |
| Ambiente localhost sem HTTPS | `secure: true` ainda assim, cookie visivel no dev tools mas protegido em producao |
| Integracao com frontend (Axios/fetch) | Servidor: `credentials: true` no CORS. Cliente: `withCredentials: true` |
| Usuario fez logout | Invalidar refresh token (salvar em banco ou blacklist) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `expiresIn: '999d'` ou sem expiracao | `expiresIn: '7d'` com limite razoavel |
| Retornar refresh token no body JSON | Enviar via `setCookie` com `httpOnly: true` |
| Cookie sem `httpOnly` | Sempre `httpOnly: true` para impedir acesso JS |
| Cookie sem `secure` | Sempre `secure: true` para encriptar via HTTPS |
| Cookie sem `sameSite` | Sempre `sameSite: true` para prevenir CSRF |
| `signed: true` sem configurar secret do cookie | `signed: false` ou configurar cookie secret separadamente |

## Troubleshooting

### Refresh token nao e enviado nas requisicoes subsequentes
**Symptom:** Cookie `refreshToken` aparece no response mas nao e reenviado pelo frontend nas proximas requisicoes
**Cause:** Frontend nao esta configurado com `withCredentials: true` (Axios) ou `credentials: 'include'` (fetch), e/ou o CORS do servidor nao tem `credentials: true`
**Fix:** Configure `withCredentials: true` no cliente e `credentials: true` no CORS do servidor Fastify

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
