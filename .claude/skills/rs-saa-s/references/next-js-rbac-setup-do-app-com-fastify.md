---
name: rs-saas-nextjs-rbac-setup-fastify
description: "Applies Fastify API setup patterns when creating a new Node.js API server with Fastify, Zod validation, and CORS. Use when user asks to 'create an API', 'setup Fastify', 'configure a server', 'add route validation with Zod', or 'start a new backend project'. Enforces modular route registration, Zod type provider integration, and schema-based request validation. Make sure to use this skill whenever scaffolding a Fastify project or adding validated routes. Not for frontend code, database setup, or authentication logic."
---

# Setup de API com Fastify

> Configurar servidor Fastify com validacao Zod integrada, CORS habilitado e rotas organizadas em modulos.

## Rules

1. **Separe o servidor das rotas** — crie `http/server.ts` para o servidor e `http/routes/` para as rotas, porque misturar setup com logica de rota torna o arquivo impossivel de manter
2. **Configure Zod como type provider** — use `withTypeProvider<ZodTypeProvider>()` tanto no app quanto em cada rota, porque isso habilita validacao automatica e tipagem end-to-end
3. **Registre validador e serializador** — chame `setValidatorCompiler` e `setSerializerCompiler` no setup, porque sem isso o Zod nao intercepta os dados de entrada/saida
4. **Rotas sao funcoes async que recebem app** — exporte cada rota como `async function nomeDaRota(app: FastifyInstance)`, porque o Fastify exige que plugins sejam async
5. **Defina schema no objeto de configuracao entre path e handler** — passe `{ schema: { body: z.object({...}) } }` como segundo argumento, porque isso valida antes de entrar no handler
6. **Registre rotas com app.register** — importe cada rota no server e use `app.register(createAccount)`, porque isso mantem as rotas desacopladas do servidor
7. **Use import type para tipagens** — importe tipagens com `import type { }` porque sao removidas no bundle e nao geram codigo JavaScript

## How to write

### Server setup

```typescript
import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

// Register routes
app.register(createAccount)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
```

### Route with Zod validation

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body
      // handler logic
      return reply.status(201).send()
    },
  )
}
```

## Example

**Before (tudo no mesmo arquivo, sem validacao):**
```typescript
import fastify from 'fastify'
const app = fastify()

app.post('/users', async (req, reply) => {
  const data = req.body as any
  // sem validacao, sem tipagem
  return 'created'
})

app.listen({ port: 3333 })
```

**After (com this skill applied):**
```typescript
// http/server.ts
import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { createAccount } from './routes/auth/create-account'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.register(fastifyCors)
app.register(createAccount)

app.listen({ port: 3333 }).then(() => console.log('HTTP server running!'))

// http/routes/auth/create-account.ts
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/users', {
    schema: {
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    },
  }, async (request) => {
    const { name, email, password } = request.body
    return 'User created'
  })
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova rota na API | Criar arquivo separado em `routes/{modulo}/`, exportar funcao async |
| Body precisa de validacao | Usar `schema.body` com `z.object()` no config da rota |
| Query params precisam de validacao | Usar `schema.querystring` com `z.object()` |
| Muitas rotas no server.ts | Aceitar — desde que sejam apenas `app.register()` calls, arquivo grande nao e problema |
| Importando tipagem TypeScript | Usar `import type` para nao gerar codigo no bundle |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `req.body as any` | `schema: { body: z.object({...}) }` no config da rota |
| Rota definida direto no server.ts | Funcao async separada em `routes/` registrada com `app.register()` |
| `app.post('/users', handler)` sem schema | `app.withTypeProvider<ZodTypeProvider>().post('/users', { schema }, handler)` |
| `import { FastifyInstance }` (sem type) | `import type { FastifyInstance }` |
| Funcao de rota sincrona | Funcao de rota `async` (obrigatorio no Fastify) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-setup-do-app-com-fastify/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-setup-do-app-com-fastify/references/code-examples.md)
