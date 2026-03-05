---
name: rs-node-js-2023-controller-criacao-academia
description: "Enforces route separation by resource and controller creation patterns in Fastify with Zod validation. Use when user asks to 'create a controller', 'add routes', 'organize routes by resource', 'validate latitude longitude', or 'apply auth middleware to route group'. Applies patterns: route files per resource, group-level auth hooks, Zod refine for custom validation, factory use-case injection. Make sure to use this skill whenever creating new Fastify controllers or reorganizing route files. Not for database schema design, use-case implementation, or test writing."
---

# Controller por Recurso com Validacao Zod

> Separe rotas por recurso em arquivos dedicados e crie controllers com validacao Zod completa, delegando ao use case via factory.

## Rules

1. **Um arquivo de rotas por recurso** — `users/routes.ts`, `gyms/routes.ts`, porque misturar recursos num unico arquivo de rotas torna impossivel aplicar middleware por grupo
2. **Auth middleware no nivel do grupo** — use `app.addHook('onRequest', verifyJWT)` no topo do arquivo de rotas, porque todas as rotas daquele arquivo herdam a autenticacao automaticamente
3. **Rotas publicas ficam separadas** — se um recurso tem rotas publicas e privadas, as publicas vao antes do hook ou em arquivo separado, porque o hook afeta tudo abaixo dele
4. **Validacao com Zod no controller** — parse o body com schema Zod no inicio do controller, porque validacao pertence a camada HTTP, nao ao use case
5. **Use `refine()` para validacoes customizadas** — latitude/longitude, ranges especiais, regras de negocio no schema, porque o Zod nao tem validacoes nativas para tudo
6. **Controller chama factory, nao instancia direto** — `makeCreateGymUseCase()` no controller, porque o factory encapsula as dependencias
7. **Omita try/catch se nao ha erro especifico** — quando o use case nao lanca erros customizados, o global error handler cuida, porque try/catch desnecessario e ruido

## How to write

### Estrutura de pastas

```
src/http/controllers/
├── users/
│   ├── register.ts
│   ├── authenticate.ts
│   ├── profile.ts
│   ├── routes.ts
│   └── register.spec.ts
└── gyms/
    ├── create.ts
    ├── routes.ts
    └── create.spec.ts
```

### Arquivo de rotas com auth no grupo

```typescript
// src/http/controllers/gyms/routes.ts
import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms', create)
}
```

### Controller com Zod refine

```typescript
// src/http/controllers/gyms/create.ts
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
```

### Registro das rotas no app

```typescript
// src/app.ts
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'

app.register(usersRoutes)
app.register(gymsRoutes)
```

## Example

**Before (tudo num arquivo so):**
```typescript
// src/http/routes.ts
export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.get('/me', { onRequest: [verifyJWT] }, profile)
  app.post('/gyms', { onRequest: [verifyJWT] }, createGym)
  app.get('/gyms/search', { onRequest: [verifyJWT] }, searchGyms)
}
```

**After (separado por recurso):**
```typescript
// users/routes.ts — mix de publico e privado
export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}

// gyms/routes.ts — tudo autenticado
export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.post('/gyms', create)
  app.get('/gyms/search', search)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Todas as rotas do recurso exigem auth | `addHook('onRequest', verifyJWT)` no topo |
| Mix de rotas publicas e privadas | `onRequest` inline apenas nas rotas privadas |
| Validacao de range numerico especial | `z.number().refine(v => ...)` com `Math.abs()` |
| Use case nao lanca erros customizados | Omita try/catch, confie no global error handler |
| Novo recurso na API | Nova pasta em controllers/ com routes.ts proprio |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Um unico `routes.ts` com todas as rotas | Um `routes.ts` por recurso |
| `onRequest: [verifyJWT]` repetido em cada rota | `addHook` no nivel do grupo |
| Validacao de latitude com `min(-90).max(90)` | `refine(v => Math.abs(v) <= 90)` |
| `new CreateGymUseCase(new GymRepo())` no controller | `makeCreateGymUseCase()` via factory |
| try/catch generico sem erros customizados | Deixar o global error handler atuar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-controller-de-criacao-de-academia/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-controller-de-criacao-de-academia/references/code-examples.md)
