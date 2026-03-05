# Code Examples: Controllers das Rotas de Check-ins

## Controller: Create Check-in (create.ts)

```typescript
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

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

  const checkInUseCase = makeCheckInUseCase()

  await checkInUseCase.execute({
    gymId,
    userLatitude: latitude,
    userLongitude: longitude,
    userId: request.user.sub,
  })

  return reply.status(201).send()
}
```

## Controller: History (history.ts)

```typescript
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({ checkIns })
}
```

## Controller: Metrics (metrics.ts)

```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({ checkInsCount })
}
```

Nota: o controller de metrics nao tem schema de validacao porque nao recebe nenhum parametro alem do usuario logado (que vem do JWT).

## Controller: Validate (validate.ts)

```typescript
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase()

  await validateCheckInUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
```

Nota: retorna 204 (No Content) em vez de 201, porque nao esta criando um recurso novo — esta atualizando um existente.

## Arquivo de rotas (routes.ts)

```typescript
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'

import { create } from './create'
import { validate } from './validate'
import { history } from './history'
import { metrics } from './metrics'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms/:gymId/check-ins', create)
  app.patch('/check-ins/:checkInId/validate', validate)
  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)
}
```

## Mapeamento completo: verbo HTTP → status code → semantica

| Rota | Verbo | Status | Semantica |
|------|-------|--------|-----------|
| `/gyms/:gymId/check-ins` | POST | 201 | Criacao de novo recurso |
| `/check-ins/history` | GET | 200 | Listagem com paginacao |
| `/check-ins/metrics` | GET | 200 | Leitura de dados agregados |
| `/check-ins/:checkInId/validate` | PATCH | 204 | Atualizacao parcial sem corpo |

## Correcao: body vs query em rotas GET

```typescript
// ERRADO (bug que o instrutor encontrou ao vivo)
const nearbyGymsBodySchema = z.object({ ... })
const { latitude, longitude } = nearbyGymsBodySchema.parse(request.body) // body em GET!

// CORRETO
const nearbyGymsQuerySchema = z.object({ ... })
const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)
```

Rotas GET nao devem usar `request.body`. Filtros e parametros de busca sempre vem via `request.query`.