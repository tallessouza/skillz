# Code Examples: Outros Controllers da Academia

## Exemplo completo: Search Controller

```typescript
// src/http/controllers/gyms/search.ts
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymsQuerySchema.parse(request.query)

  const searchGymsUseCase = makeSearchGymsUseCase()

  const { gyms } = await searchGymsUseCase.execute({
    query: q,
    page,
  })

  return reply.status(200).send({
    gyms,
  })
}
```

## Exemplo completo: Nearby Controller

```typescript
// src/http/controllers/gyms/nearby.ts
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({
    gyms,
  })
}
```

## Exemplo completo: Arquivo de rotas

```typescript
// src/http/controllers/gyms/routes.ts
import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
  app.post('/gyms', create)
}
```

## Comparacao: Body validation vs Query validation

### POST (body — JSON automaticamente converte tipos)
```typescript
const createGymBodySchema = z.object({
  title: z.string(),
  latitude: z.number().refine((value) => Math.abs(value) <= 90),
  longitude: z.number().refine((value) => Math.abs(value) <= 180),
})

const data = createGymBodySchema.parse(request.body)
```

### GET (query — tudo e string, precisa coerce)
```typescript
const nearbyGymsQuerySchema = z.object({
  latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
  longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
})

const data = nearbyGymsQuerySchema.parse(request.query)
```

A unica diferenca e `z.number()` vs `z.coerce.number()`. No body, o JSON parser ja converte. No query, precisa do coerce.

## Variacao: Adicionando limit ao search

```typescript
const searchGymsQuerySchema = z.object({
  q: z.string(),
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
})
```

## Variacao: Controller nearby com raio customizado

```typescript
const nearbyGymsQuerySchema = z.object({
  latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
  longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  radiusInKm: z.coerce.number().min(1).max(50).default(10),
})
```

## Padrao de teste E2E para esses controllers

```typescript
// search.spec.ts
it('should be able to search gyms by title', async () => {
  // Cria gyms primeiro
  await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'JavaScript Gym', latitude: -23.55, longitude: -46.63 })

  await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'TypeScript Gym', latitude: -23.55, longitude: -46.63 })

  // Busca
  const response = await request(app.server)
    .get('/gyms/search')
    .query({ q: 'JavaScript', page: 1 })
    .set('Authorization', `Bearer ${token}`)

  expect(response.statusCode).toEqual(200)
  expect(response.body.gyms).toHaveLength(1)
  expect(response.body.gyms[0].title).toEqual('JavaScript Gym')
})
```

```typescript
// nearby.spec.ts
it('should be able to list nearby gyms', async () => {
  // Gym perto
  await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Near Gym', latitude: -23.55, longitude: -46.63 })

  // Gym longe
  await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Far Gym', latitude: -23.00, longitude: -46.00 })

  const response = await request(app.server)
    .get('/gyms/nearby')
    .query({ latitude: -23.55, longitude: -46.63 })
    .set('Authorization', `Bearer ${token}`)

  expect(response.statusCode).toEqual(200)
  expect(response.body.gyms).toHaveLength(1)
  expect(response.body.gyms[0].title).toEqual('Near Gym')
})
```