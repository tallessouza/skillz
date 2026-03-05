---
name: rs-node-js-2023-academias-proximas
description: "Applies geolocation-based filtering pattern when implementing 'find nearby' or 'fetch nearby' features in Node.js APIs. Use when user asks to 'find nearby locations', 'filter by distance', 'geolocation query', 'list places within radius', or 'proximity search'. Enforces SOLID repository pattern with coordinate params, distance calculation, and in-memory testing strategy. Make sure to use this skill whenever building location-based filtering in backend APIs. Not for frontend map rendering, GPS hardware integration, or database-specific geospatial indexes like PostGIS."
---

# Caso de Uso de Busca por Proximidade (Nearby)

> Ao implementar busca por proximidade, encapsule o calculo de distancia no repositorio e filtre por raio maximo em quilometros.

## Rules

1. **Nomeie pelo comportamento do usuario** — `FetchNearbyGyms` nao `GetGymsInRadius`, porque o nome reflete a acao do usuario, nao a implementacao tecnica
2. **Prefixe coordenadas com o dono** — `userLatitude`/`userLongitude`, porque evita confusao entre coordenadas do usuario e da entidade
3. **Receba coordenadas como objeto nomeado** — `findManyNearby({ latitude, longitude })` nao `findManyNearby(lat, lng)`, porque parametros posicionais sao ambiguos
4. **Exporte a interface de params do repositorio** — outros arquivos que usam o metodo precisam conhecer o contrato tipado
5. **Defina o raio maximo como constante explicita** — `distance <= 10` (km) deve estar visivel no filtro, porque e uma regra de negocio, nao um detalhe de implementacao
6. **Converta tipos do ORM antes de calcular** — `item.latitude.toNumber()` para Decimal do Prisma, porque operacoes matematicas falham silenciosamente com tipos errados

## How to write

### Interface de parametros no repositorio

```typescript
export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
}
```

### Use case recebendo coordenadas do usuario

```typescript
interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
```

### Implementacao in-memory com filtro por distancia

```typescript
async findManyNearby(params: FindManyNearbyParams) {
  return this.items.filter((item) => {
    const distance = getDistanceBetweenCoordinates(
      { latitude: params.latitude, longitude: params.longitude },
      {
        latitude: item.latitude.toNumber(),
        longitude: item.longitude.toNumber(),
      },
    )

    return distance <= 10 // 10 km
  })
}
```

## Example

**Before (parametros posicionais, sem tipagem):**
```typescript
// Repositorio
async findNearby(lat: number, lng: number) {
  return this.items.filter((item) => {
    const d = getDistance(lat, lng, item.lat, item.lng)
    return d < 10
  })
}

// Use case
async execute(lat: number, lng: number) {
  const gyms = await this.repo.findNearby(lat, lng)
  return gyms
}
```

**After (com esta skill aplicada):**
```typescript
// Interface exportada
export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

// Repositorio tipado
async findManyNearby(params: FindManyNearbyParams) {
  return this.items.filter((item) => {
    const distance = getDistanceBetweenCoordinates(
      { latitude: params.latitude, longitude: params.longitude },
      { latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber() },
    )
    return distance <= 10
  })
}

// Use case com nomes descritivos
async execute({ userLatitude, userLongitude }: FetchNearbyGymsUseCaseRequest) {
  const gyms = await this.gymsRepository.findManyNearby({
    latitude: userLatitude,
    longitude: userLongitude,
  })
  return { gyms }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mais de 2 parametros numericos no metodo | Agrupe em objeto com interface exportada |
| Coordenada vem do usuario vs da entidade | Prefixe com `user` nas do usuario |
| Raio de busca e regra de negocio | Documente no README do projeto (ex: "ate 10km") |
| Tipo Decimal do Prisma em calculo | Converta com `.toNumber()` antes de operar |
| Teste de proximidade | Crie entidade "near" e "far" com coordenadas reais |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `findNearby(lat, lng)` | `findManyNearby({ latitude, longitude })` |
| `latitude: number, longitude: number` como params soltos | `params: FindManyNearbyParams` com interface |
| `item.latitude` direto em calculo (Prisma Decimal) | `item.latitude.toNumber()` |
| Raio hardcoded sem comentario | `distance <= 10 // 10 km` com regra documentada |
| Teste com coordenadas inventadas | Teste com coordenadas reais de locais conhecidos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-de-academias-proximas/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-de-academias-proximas/references/code-examples.md)
