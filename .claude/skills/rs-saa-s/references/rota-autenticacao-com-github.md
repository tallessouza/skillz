---
name: rs-saas-nextjs-rbac-auth-github
description: "Applies GitHub OAuth authentication flow when building backend auth routes with Node.js/Fastify. Use when user asks to 'implement GitHub login', 'add OAuth authentication', 'create social login', 'integrate GitHub auth', or 'build OAuth callback route'. Covers token exchange, user data fetching, account linking with Prisma, and JWT generation. Make sure to use this skill whenever implementing OAuth provider authentication in Node.js backends. Not for frontend OAuth UI, session management, or non-GitHub OAuth providers."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: api-routes
  tags: [saas, fastify, api, routes, prisma, nextjs, zod, jwt, oauth, github]
---

# Rota: Autenticacao com GitHub (OAuth)

> Implemente autenticacao OAuth com GitHub seguindo o fluxo completo: receber code, trocar por access token, buscar dados do usuario, criar/vincular conta, e retornar JWT.

## Rules

1. **Receba apenas o `code` no body** — o frontend envia o code recebido do callback do GitHub, porque o backend faz a troca segura pelo access token
2. **Use o construtor `new URL()` para montar URLs com query params** — `githubAuthUrl.searchParams.set('key', value)` em vez de concatenar strings, porque fica organizado e seguro com muitos parametros
3. **Envie `Accept: application/json` no header** — a API do GitHub retorna texto por padrao, porque sem esse header voce recebe formato URL-encoded em vez de JSON
4. **Valide respostas da API com Zod** — parse tanto o access token response quanto o user data, porque garante tipagem e falha rapido se a API mudar
5. **Trate email nulo como erro** — mesmo pedindo scope `user:email`, algumas contas nao tem email publico, porque o GitHub permite email privado
6. **Use indices unicos do Prisma no `where`** — busque account por `{ provider, userId }` usando o indice composto, porque torna a query mais performatica
7. **Reutilize usuario existente pelo email** — se o usuario ja existe (login por senha), vincule a account GitHub ao usuario existente em vez de criar duplicata

## Steps

### Step 1: Receber o code e trocar pelo access token

```typescript
import { z } from 'zod'

const bodySchema = z.object({
  code: z.string(),
})

const { code } = bodySchema.parse(request.body)

const githubAuthUrl = new URL('https://github.com/login/oauth/access_token')
githubAuthUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
githubAuthUrl.searchParams.set('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET)
githubAuthUrl.searchParams.set('redirect_uri', env.GITHUB_OAUTH_REDIRECT_URI)
githubAuthUrl.searchParams.set('code', code)

const githubAccessTokenResponse = await fetch(githubAuthUrl, {
  method: 'POST',
  headers: { Accept: 'application/json' },
})

const githubAccessTokenData = await githubAccessTokenResponse.json()

const { accessToken } = z.object({
  access_token: z.string(),
  token_type: z.literal('bearer'),
  scope: z.string(),
}).transform((data) => ({
  accessToken: data.access_token,
})).parse(githubAccessTokenData)
```

### Step 2: Buscar dados do usuario no GitHub

```typescript
const githubUserResponse = await fetch('https://api.github.com/user', {
  headers: { Authorization: `Bearer ${accessToken}` },
})

const githubUserData = await githubUserResponse.json()

const { id: githubId, name, email, avatarUrl } = z.object({
  id: z.number().int().transform(String),
  avatar_url: z.string().url(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
}).transform((data) => ({
  ...data,
  avatarUrl: data.avatar_url,
})).parse(githubUserData)

if (!email) {
  throw new BadRequestError('Your GitHub account must have an email to authenticate.')
}
```

### Step 3: Criar ou vincular usuario e account

```typescript
let user = await prisma.user.findUnique({ where: { email } })

if (!user) {
  user = await prisma.user.create({
    data: { name, email, avatarUrl },
  })
}

let account = await prisma.account.findUnique({
  where: { provider_userId: { provider: 'GITHUB', userId: user.id } },
})

if (!account) {
  account = await prisma.account.create({
    data: {
      provider: 'GITHUB',
      providerAccountId: githubId,
      userId: user.id,
    },
  })
}
```

### Step 4: Gerar e retornar JWT

```typescript
const token = await reply.jwtSign(
  { sub: user.id },
  { sign: { expiresIn: '7d' } },
)

return reply.status(201).send({ token })
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario ja existe por email (login senha) | Vincule account GitHub, nao crie usuario novo |
| Account GitHub ja existe para o usuario | Nao crie duplicata, apenas gere o token |
| Email veio nulo do GitHub | Retorne erro claro pedindo email publico |
| Code do GitHub expirou (1 min TTL) | Refaca o fluxo de autorizacao completo |
| Precisa de dados alem do perfil publico | Adicione scopes separados por virgula na URL de autorizacao |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Concatenar query params na URL manualmente | Use `new URL()` + `searchParams.set()` |
| Confiar que email sempre vem do GitHub | Valide com `.nullable()` e trate o caso nulo |
| Salvar `providerAccountId` como number | Converta para string com `.transform(String)` |
| Usar `fetch(url)` sem `Accept: application/json` | Sempre envie o header para receber JSON |
| Criar usuario novo sem checar email existente | Busque por email primeiro, vincule se existir |
| Guardar client_id/secret no codigo | Use variaveis de ambiente |

## Troubleshooting

### Erro de foreign key constraint
**Symptom:** Prisma lanca erro ao criar registro com referencia invalida
**Cause:** O ID referenciado nao existe na tabela relacionada
**Fix:** Verifique que o registro pai existe antes de criar o registro filho

### Token invalido ou expirado
**Symptom:** Requisicao autenticada retorna 401
**Cause:** Token JWT expirou ou foi assinado com secret diferente
**Fix:** Verifique que o JWT_SECRET e o mesmo entre geracao e verificacao, e que o token nao expirou

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
