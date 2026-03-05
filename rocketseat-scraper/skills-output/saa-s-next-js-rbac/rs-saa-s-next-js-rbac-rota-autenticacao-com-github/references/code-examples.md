# Code Examples: Autenticacao com GitHub OAuth

## Rota completa: authenticate-with-github.ts

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { env } from '@saas/env'
import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with GitHub',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      // Step 1: Trocar code por access token
      const githubAuthUrl = new URL(
        'https://github.com/login/oauth/access_token',
      )
      githubAuthUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
      githubAuthUrl.searchParams.set(
        'client_secret',
        env.GITHUB_OAUTH_CLIENT_SECRET,
      )
      githubAuthUrl.searchParams.set(
        'redirect_uri',
        env.GITHUB_OAUTH_REDIRECT_URI,
      )
      githubAuthUrl.searchParams.set('code', code)

      const githubAccessTokenResponse = await fetch(githubAuthUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const githubAccessTokenData = await githubAccessTokenResponse.json()

      const { accessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('bearer'),
          scope: z.string(),
        })
        .transform((data) => ({
          accessToken: data.access_token,
        }))
        .parse(githubAccessTokenData)

      // Step 2: Buscar dados do usuario
      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const githubUserData = await githubUserResponse.json()

      const {
        id: githubId,
        name,
        email,
        avatarUrl,
      } = z
        .object({
          id: z.number().int().transform(String),
          avatar_url: z.string().url(),
          name: z.string().nullable(),
          email: z.string().email().nullable(),
        })
        .transform((data) => ({
          ...data,
          avatarUrl: data.avatar_url,
        }))
        .parse(githubUserData)

      if (!email) {
        throw new BadRequestError(
          'Your GitHub account must have an email to authenticate.',
        )
      }

      // Step 3: Criar ou vincular usuario
      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GITHUB',
            userId: user.id,
          },
        },
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

      // Step 4: Gerar JWT
      const token = await reply.jwtSign(
        { sub: user.id },
        { sign: { expiresIn: '7d' } },
      )

      return reply.status(201).send({ token })
    },
  )
}
```

## Registrando a rota no server.ts

```typescript
import { authenticateWithGithub } from './routes/auth/authenticate-with-github'

// ... dentro do setup do app
app.register(authenticateWithGithub)
```

## URL de autorizacao para o frontend redirecionar

```
https://github.com/login/oauth/authorize?client_id=SEU_CLIENT_ID&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email
```

## Variaveis de ambiente necessarias

```env
GITHUB_OAUTH_CLIENT_ID=seu_client_id_aqui
GITHUB_OAUTH_CLIENT_SECRET=seu_client_secret_aqui
GITHUB_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

## Schema Prisma relevante (Account)

```prisma
model Account {
  id                String   @id @default(uuid())
  provider          String   // 'GITHUB', 'GOOGLE', etc.
  providerAccountId String   @map("provider_account_id")
  userId            String   @map("user_id")
  user              User     @relation(fields: [userId], references: [id])

  @@unique([provider, userId])
  @@map("accounts")
}
```

## Padrao: new URL() vs concatenacao

```typescript
// Desorganizado — dificil manter com muitos params
const url = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${secret}&code=${code}&redirect_uri=${redirectUri}`

// Organizado — cada param em sua propria linha
const url = new URL('https://github.com/login/oauth/access_token')
url.searchParams.set('client_id', clientId)
url.searchParams.set('client_secret', secret)
url.searchParams.set('code', code)
url.searchParams.set('redirect_uri', redirectUri)
// fetch aceita o objeto URL diretamente
await fetch(url, { method: 'POST' })
```

## Padrao: Zod transform para snake_case → camelCase

```typescript
// API retorna snake_case, app usa camelCase
const schema = z.object({
  access_token: z.string(),
  avatar_url: z.string().url(),
}).transform((data) => ({
  accessToken: data.access_token,
  avatarUrl: data.avatar_url,
}))

// Apos .parse(), voce recebe { accessToken, avatarUrl }
```

## Teste manual do fluxo

1. Acesse no navegador: `https://github.com/login/oauth/authorize?client_id=XXX&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email`
2. Autorize a aplicacao
3. Copie o `code` da URL de callback
4. Envie POST para `/sessions/github` com `{ "code": "CODIGO_COPIADO" }`
5. Receba o JWT na resposta