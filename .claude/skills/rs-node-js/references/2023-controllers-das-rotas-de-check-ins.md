---
name: rs-node-js-2023-controllers-das-rotas-de-check-ins
description: "Generates RESTful controllers for resource routes in Fastify/Node.js APIs following SOLID patterns. Use when user asks to 'create a controller', 'add routes', 'create check-in endpoint', 'implement CRUD routes', or 'setup resource controllers'. Applies patterns: Zod schema validation per source (body/params/query), use case factory injection, route grouping with auth hooks, correct HTTP verbs and status codes. Make sure to use this skill whenever creating new API controllers or routes in Fastify. Not for frontend components, database schemas, or use case business logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: api-solid
  tags: [nestjs, controller, clean-architecture, e2e-test, rest-api]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Controllers de Rotas por Recurso

> Cada controller valida input com Zod, chama o use case via factory, e retorna o status code semanticamente correto.

## Rules

1. **Um controller por acao** — `create.ts`, `history.ts`, `metrics.ts`, `validate.ts`, porque cada arquivo tem responsabilidade unica e facilita testes
2. **Schemas separados por fonte** — body, params e query tem schemas Zod distintos, porque misturar fontes causa bugs silenciosos (ex: usar `body` quando deveria ser `query` em GET)
3. **IDs de recurso pai na URL, nao no body** — `POST /gyms/:gymId/check-ins` em vez de enviar gymId no body, porque o check-in sempre pertence a uma academia e a URL expressa essa relacao
4. **Use case via factory** — sempre `makeXxxUseCase()` dentro do controller, porque isola a construcao de dependencias e facilita troca de implementacao
5. **Status codes semanticos** — 201 para criacao, 200 para listagem, 204 para atualizacao sem corpo de resposta, porque cada codigo comunica a semantica da operacao
6. **PATCH para atualizacao parcial** — validar check-in e PATCH (nao PUT), porque altera apenas um campo de um recurso existente
7. **Auth hook no arquivo de rotas** — `app.addHook('onRequest', verifyJwt)` no topo do routes.ts, porque todas as rotas do recurso exigem autenticacao

## How to write

### Estrutura de pastas por recurso

```
src/http/controllers/
├── users/
│   ├── routes.ts
│   ├── register.ts
│   └── authenticate.ts
├── gyms/
│   ├── routes.ts
│   ├── create.ts
│   └── search.ts
└── check-ins/
    ├── routes.ts
    ├── create.ts
    ├── history.ts
    ├── metrics.ts
    └── validate.ts
```

### Controller com validacao por fonte

```typescript
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCreateCheckInUseCase } from '@/use-cases/factories/make-create-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const createCheckInUseCase = makeCreateCheckInUseCase()

  await createCheckInUseCase.execute({
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
    userId: request.user.sub,
  })

  return reply.status(201).send()
}
```

### Arquivo de rotas do recurso

```typescript
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { history } from './history'
import { metrics } from './metrics'
import { validate } from './validate'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms/:gymId/check-ins', create)
  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)
  app.patch('/check-ins/:checkInId/validate', validate)
}
```

## Example

**Before (controller monolitico sem separacao):**
```typescript
// Tudo num arquivo so, sem validacao, sem factory
app.post('/check-ins', async (req, reply) => {
  const { gymId, latitude, longitude } = req.body
  const result = await prisma.checkIn.create({ data: { gymId, userId: req.user.sub } })
  return reply.send(result)
})
```

**After (com este skill aplicado):**
```typescript
// create.ts — controller isolado
const paramsSchema = z.object({ gymId: z.string().uuid() })
const bodySchema = z.object({
  latitude: z.number().refine((v) => Math.abs(v) <= 90),
  longitude: z.number().refine((v) => Math.abs(v) <= 180),
})

const { gymId } = paramsSchema.parse(request.params)
const { latitude, longitude } = bodySchema.parse(request.body)

const useCase = makeCreateCheckInUseCase()
await useCase.execute({ gymId, userLatitude: latitude, userLongitude: longitude, userId: request.user.sub })

return reply.status(201).send()
```

## Heuristics

| Situation | Do |
|-----------|-----|
| GET com filtros (search, page) | Validar com `request.query`, nunca `request.body` |
| ID de recurso pai | Colocar na URL como param (`:gymId`) |
| ID do usuario logado | Extrair de `request.user.sub`, nunca receber do client |
| Atualizacao parcial (ex: validar) | Usar PATCH, retornar 204 |
| Listagem com paginacao | Receber `page` via query, default para 1 com `z.coerce.number()` |
| Controller sem dados de retorno | Retornar `reply.status(204).send()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const { gymId } = req.body` em rota aninhada | `const { gymId } = paramsSchema.parse(request.params)` |
| `req.body.page` em rota GET | `querySchema.parse(request.query)` |
| `new CreateCheckInUseCase(new Repo())` no controller | `makeCreateCheckInUseCase()` |
| `app.put('/check-ins/:id')` para validar | `app.patch('/check-ins/:id/validate')` |
| `reply.status(200).send()` apos criacao | `reply.status(201).send()` |
| `reply.send({ ok: true })` sem corpo real | `reply.status(204).send()` |

## Troubleshooting

### Erro inesperado ao seguir este padrao
**Symptom:** Codigo segue o padrao mas comportamento nao e o esperado
**Cause:** Dependencia nao registrada no modulo ou configuracao incompleta
**Fix:** Verificar registro completo no modulo (controllers, providers, imports) e dependencias instaladas

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-controllers-das-rotas-de-check-ins/references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-controllers-das-rotas-de-check-ins/references/code-examples.md) — Todos os exemplos de código expandidos com variações
