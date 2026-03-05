---
name: rs-saas-nextjs-rbac-auth-senha
description: "Applies password authentication route pattern with Fastify, JWT token generation, and bcrypt password comparison. Use when user asks to 'create login route', 'implement authentication', 'generate JWT token', 'password login endpoint', or 'authenticate user with email and password'. Enforces credential validation flow, proper error responses, and JWT subject convention. Make sure to use this skill whenever building auth routes in Fastify with Zod validation. Not for OAuth/social login, session-based auth, or frontend auth components."
---

# Rota de Autenticacao via Senha (Fastify + JWT)

> Implementar autenticacao por senha seguindo o fluxo: validar email, verificar existencia de hash, comparar senha com bcrypt, gerar JWT com subject.

## Rules

1. **Valide email antes da senha** — busque o usuario por email primeiro, retorne erro generico `invalidCredentials` se nao existir, porque nao revelar qual campo falhou impede enumeracao de usuarios
2. **Verifique se o usuario tem password hash** — se `passwordHash` for null, o usuario logou via social login e nao tem senha, retorne mensagem especifica orientando usar login social
3. **Use `bcrypt.compare` para verificar senha** — nunca compare strings diretamente, porque bcrypt lida com salt e timing-safe comparison
4. **Erro de senha incorreta retorna mesmo erro generico** — use `invalidCredentials` para senha errada, identico ao erro de usuario nao encontrado, porque impede distinguir qual campo falhou
5. **JWT subject (`sub`) recebe o ID do usuario** — e o padrao JWT para identificar a quem o token pertence, nao coloque dados sensiveis no payload
6. **Configure `expiresIn` no sign, nao no register** — permite flexibilidade por rota, porque diferentes tokens podem ter duracao diferente

## How to write

### Rota de autenticacao com senha

```typescript
import { compare } from 'bcryptjs'

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
        return reply
          .status(400)
          .send({ message: 'User does not have a password. Use social login.' })
      }

      const isPasswordValid = await compare(password, userFromEmail.passwordHash)

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

### Configuracao do FastifyJWT no server

```typescript
import fastifyJwt from '@fastify/jwt'

app.register(fastifyJwt, {
  secret: 'myJWTsecret', // em producao, use env var
})
```

## Example

**Before (sem validacao adequada):**
```typescript
app.post('/login', async (request, reply) => {
  const { email, password } = request.body as any
  const user = await prisma.user.findUnique({ where: { email } })
  if (user?.password === password) {
    return { token: 'some-token' }
  }
  return reply.status(401).send({ error: 'Wrong password' })
})
```

**After (com esta skill aplicada):**
```typescript
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

    const userFromEmail = await prisma.user.findUnique({ where: { email } })

    if (!userFromEmail) {
      return reply.status(400).send({ message: 'invalidCredentials' })
    }

    if (userFromEmail.passwordHash === null) {
      return reply.status(400).send({ message: 'User does not have a password. Use social login.' })
    }

    const isPasswordValid = await compare(password, userFromEmail.passwordHash)

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
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario nao encontrado por email | Retorne erro generico `invalidCredentials` |
| Usuario existe mas sem passwordHash | Retorne mensagem orientando login social |
| Senha incorreta | Retorne mesmo erro generico `invalidCredentials` |
| Autenticacao bem-sucedida | Gere JWT com `sub: userId`, retorne status 201 |
| Dados no payload JWT | Minimo possivel — apenas `sub` com ID do usuario |
| Secret do JWT | Em dev pode ser string fixa, em producao use variavel de ambiente |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `if (user.password === password)` | `await compare(password, user.passwordHash)` |
| `return { error: 'Wrong password' }` | `return { message: 'invalidCredentials' }` (generico) |
| `request.body as any` | Valide com Zod schema no config da rota |
| JWT sem `sub` | Sempre inclua `sub: userId` no payload |
| JWT sem `expiresIn` | Sempre defina expiracao (`'7d'`, `'1h'`, etc.) |
| Revelar se email existe ou nao | Mesma mensagem de erro para email e senha invalidos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
