---
name: rs-node-js-2023-outros-controllers
description: "Applies pattern for creating search and nearby controllers with query params validation in Fastify/Express APIs. Use when user asks to 'create a search endpoint', 'add nearby controller', 'implement query params validation', 'list with pagination', or 'geolocation endpoint'. Enforces Zod coerce for numeric query params, default values, and use case delegation. Make sure to use this skill whenever creating GET controllers with query parameters in Node.js APIs. Not for POST/PUT body validation, authentication, or database query logic."
---

# Outros Controllers — Search e Nearby

> Ao criar controllers GET com query params, valide e converta tipos com Zod coerce, delegue logica ao use case, e devolva apenas o resultado.

## Rules

1. **Query params sao sempre strings** — use `z.coerce.number()` para converter numericos, porque `request.query` retorna tudo como string
2. **Paginacao tem minimo e default** — `.min(1).default(1)` para page, porque pagina 0 ou negativa nao faz sentido
3. **Um controller por arquivo** — search, nearby e create sao controllers separados, porque facilita testes e manutencao
4. **Controller nao contem logica de negocio** — valida input, chama use case via factory, retorna resultado
5. **Nomeie o schema pelo contexto** — `SearchGymsQuerySchema`, `NearbyGymsQuerySchema`, porque schemas genericos causam confusao
6. **Rotas GET usam query params, POST usam body** — nunca misture, porque segue convencao REST

## How to write

### Controller de busca com paginacao

```typescript
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

  const { gyms } = await searchGymsUseCase.execute({ query: q, page })

  return reply.status(200).send({ gyms })
}
```

### Controller de busca por proximidade

```typescript
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
```

### Registro de rotas

```typescript
import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'

export async function gymsRoutes(app: FastifyInstance) {
  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
  app.post('/gyms', create)
}
```

## Example

**Before (query params sem validacao):**
```typescript
export async function search(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query.q
  const page = request.query.page || 1 // string "1", nao number 1

  const gyms = await searchInDatabase(query, page) // page eh "1" string
  return reply.send({ gyms })
}
```

**After (com Zod coerce e validacao):**
```typescript
export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymsQuerySchema.parse(request.query)

  const searchGymsUseCase = makeSearchGymsUseCase()
  const { gyms } = await searchGymsUseCase.execute({ query: q, page })

  return reply.status(200).send({ gyms })
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Query param numerico (page, limit, offset) | `z.coerce.number()` com `.min()` e `.default()` |
| Query param de busca textual | `z.string()` simples, pode abreviar para `q` |
| Latitude/longitude via query | `z.coerce.number()` com `.refine()` para range valido |
| Mesmo recurso, operacoes diferentes | Controllers separados, rotas separadas |
| Controller precisa de logica complexa | Delegue ao use case, controller so valida e repassa |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const page = Number(request.query.page) \|\| 1` | `z.coerce.number().min(1).default(1)` |
| `const lat = parseFloat(req.query.lat)` | `z.coerce.number().refine(v => Math.abs(v) <= 90)` |
| Logica de busca dentro do controller | Use case factory + execute |
| Um controller gigante com switch/if | Um arquivo por controller |
| `app.get('/gyms', handleAllGymOperations)` | Rotas separadas: `/gyms/search`, `/gyms/nearby` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-outros-controllers-da-academia/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-outros-controllers-da-academia/references/code-examples.md)
