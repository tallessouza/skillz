---
name: rs-node-js-2023-jwt-fastify
description: "Applies JWT authentication patterns with Fastify when implementing auth routes, login endpoints, or protected routes. Use when user asks to 'add authentication', 'protect a route', 'implement login', 'generate JWT token', or 'validate token' in Fastify/Node.js apps. Enforces JWT isolation in HTTP layer, never in use cases. Make sure to use this skill whenever building auth flows in Fastify applications. Not for OAuth, API tokens, session-based auth, or non-Fastify frameworks."
---

# Implementando JWT no Fastify

> JWT pertence exclusivamente a camada HTTP (controllers) — nunca dentro de use cases, porque use cases sao funcionalidades puras desconectadas do meio externo.

## Rules

1. **JWT somente na camada HTTP** — nunca em use cases, porque se o use case for chamado fora do contexto HTTP (integracao, CLI, fila), o JWT sera inutil ou vai atrapalhar
2. **Secret via variavel ambiente** — nunca hardcoded, porque nem desenvolvedores devem conhecer a chave em producao
3. **Nunca coloque dados sensiveis no payload** — email, senha, dados pessoais sao proibidos no JWT, porque o payload nao e criptografado, apenas encoded (qualquer pessoa decodifica em jwt.io)
4. **Use somente o `sub` para identificar o usuario** — coloque o user.id no campo `sign.sub`, nao no payload, porque e a convencao padrao do JWT
5. **Valide antes de acessar** — chame `request.jwtVerify()` antes de acessar `request.user`, porque ela bloqueia execucao se o token for invalido ou ausente
6. **Declare tipos do FastifyJWT** — crie arquivo `.d.ts` com a interface `FastifyJWT` para que o TypeScript reconheca `request.user.sub`

## How to write

### Setup do modulo

```typescript
// app.ts — registrar ANTES das rotas
import fastifyJwt from '@fastify/jwt'
import { env } from './env'

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
```

### Variavel ambiente

```typescript
// env/index.ts (schema zod)
const envSchema = z.object({
  JWT_SECRET: z.string(),
  // ...outras envs
})
```

### Geracao do token (controller de autenticacao)

```typescript
// http/controllers/authenticate.ts
const { user } = await authenticateUseCase.execute({ email, password })

const token = await reply.jwtSign(
  {},  // payload vazio — sem dados sensiveis
  { sign: { sub: user.id } },
)

return reply.status(200).send({ token })
```

### Protecao de rota (controller que exige auth)

```typescript
// http/controllers/profile.ts
export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify() // bloqueia se token invalido

  const userId = request.user.sub // id do usuario autenticado
  // ... buscar dados do usuario
}
```

### Declaracao de tipos

```typescript
// @types/fastify-jwt.d.ts
import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
    }
  }
}
```

## Example

**Before (JWT dentro do use case — errado):**
```typescript
// use-cases/authenticate.ts
export class AuthenticateUseCase {
  async execute({ email, password }) {
    const user = await this.usersRepo.findByEmail(email)
    // ... validacao
    const token = jwt.sign({ sub: user.id }, secret) // JWT no use case!
    return { token }
  }
}
```

**After (JWT isolado no controller):**
```typescript
// use-cases/authenticate.ts
export class AuthenticateUseCase {
  async execute({ email, password }) {
    const user = await this.usersRepo.findByEmail(email)
    // ... validacao
    return { user } // retorna o usuario, sem JWT
  }
}

// http/controllers/authenticate.ts
const { user } = await authenticateUseCase.execute({ email, password })
const token = await reply.jwtSign({}, { sign: { sub: user.id } })
return reply.status(200).send({ token })
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota precisa saber quem e o usuario | `await request.jwtVerify()` + `request.user.sub` |
| Rota e publica (registro, login) | Nao chame `jwtVerify` |
| Use case precisa do userId | Receba como parametro, nao extraia do token dentro do use case |
| Front-end envia token | Header `Authorization: Bearer <token>` |
| TypeScript nao reconhece `request.user.sub` | Crie arquivo `@types/fastify-jwt.d.ts` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `jwt.sign({ email, password, sub })` | `reply.jwtSign({}, { sign: { sub: user.id } })` |
| JWT dentro de use case | JWT somente no controller |
| `secret: 'minha-chave'` hardcoded | `secret: env.JWT_SECRET` via variavel ambiente |
| Acessar `request.user` sem verificar | Sempre `await request.jwtVerify()` antes |
| Payload com dados sensiveis | Payload vazio, apenas `sub` no sign |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
