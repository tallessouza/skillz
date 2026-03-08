---
name: rs-node-js-2023-validando-distancia-check-in
description: "Enforces geolocation distance validation patterns when implementing check-in, proximity, or location-based features in Node.js/TypeScript. Use when user asks to 'validate distance', 'check proximity', 'implement check-in', 'geofencing', or 'calculate distance between coordinates'. Applies Haversine formula, named constants for magic numbers, and TDD approach for geo-validation. Make sure to use this skill whenever building location-based business rules. Not for map rendering, GPS tracking, or frontend geolocation APIs."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: validacao-distancia
  tags: [geolocation, haversine, distance, check-in, coordinates, tdd, prisma-decimal]
---

# Validando Distancia em Check-ins

> Regras de negocio baseadas em localizacao usam a formula Haversine, constantes nomeadas com unidade, e testes com coordenadas reais.

## Rules

1. **Extraia o calculo de distancia para uma funcao utilitaria** — `getDistanceBetweenCoordinates(from, to)` em `utils/`, porque calculos matematicos complexos nao pertencem ao use-case
2. **Nunca use numeros magicos para distancias** — `maxDistanceInKilometers = 0.1` nao `0.1` inline, porque `0.1` nao comunica que sao 100 metros
3. **Inclua a unidade no nome da constante** — `maxDistanceInKilometers`, `timeoutInMs`, porque evita ambiguidade entre metros, quilometros e milhas
4. **Converta tipos do ORM antes de calcular** — Prisma `Decimal` precisa de `.toNumber()` antes de passar para funcoes matematicas, porque tipos custom do ORM nao sao `number` primitivo
5. **Teste com coordenadas reais do Google Maps** — use coordenadas distantes (>100m) para testar rejeicao, e coordenadas identicas para testar aceitacao, porque coordenadas inventadas podem gerar falsos positivos
6. **Nomeie testes pela regra, nao pela distancia exata** — `should not be able to check in on distant gym` nao `should not check in beyond 100m`, porque o limite pode mudar

## How to write

### Funcao de distancia (Haversine)

```typescript
// utils/get-distance-between-coordinates.ts
export interface Coordinate {
  latitude: number
  longitude: number
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
): number {
  // Retorna distancia em QUILOMETROS
  // 0.1 = 100 metros
}
```

### Validacao no use-case

```typescript
const MAX_DISTANCE_IN_KILOMETERS = 0.1

const distance = getDistanceBetweenCoordinates(
  { latitude: userLatitude, longitude: userLongitude },
  { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
)

if (distance > MAX_DISTANCE_IN_KILOMETERS) {
  throw new MaxDistanceError()
}
```

### Teste unitario com coordenadas reais

```typescript
it('should not be able to check in on distant gym', async () => {
  // Academia com coordenadas distantes (>100m do usuario)
  gymsRepository.items.push({
    id: 'gym-02',
    latitude: new Decimal(-27.0610928),
    longitude: new Decimal(-49.3416015),
  })

  await expect(() =>
    sut.execute({
      gymId: 'gym-02',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    }),
  ).rejects.toBeInstanceOf(MaxDistanceError)
})
```

## Example

**Before (numero magico, sem extracao):**
```typescript
// Dentro do use-case, inline
const fromRadian = (Math.PI * userLatitude) / 180
// ... 20 linhas de calculo naval ...
if (dist > 0.1) {
  throw new Error()
}
```

**After (com esta skill aplicada):**
```typescript
// Use-case limpo
const MAX_DISTANCE_IN_KILOMETERS = 0.1

const distance = getDistanceBetweenCoordinates(
  { latitude: userLatitude, longitude: userLongitude },
  { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
)

if (distance > MAX_DISTANCE_IN_KILOMETERS) {
  throw new MaxDistanceError()
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Calculo matematico complexo | Extraia para `utils/` com interface tipada |
| Valor numerico com significado de negocio | Crie constante com unidade no nome |
| Tipo do ORM nao e primitivo | Converta com `.toNumber()` antes de usar |
| Teste de geolocalizacao | Use coordenadas reais do Maps, nao inventadas |
| Testes existentes quebram apos adicionar validacao | Atualize fixtures para usar coordenadas validas |
| Limite de distancia pode mudar | Nomeie teste pela regra, nao pelo valor |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `if (dist > 0.1)` | `if (distance > MAX_DISTANCE_IN_KILOMETERS)` |
| `gym.latitude` (Decimal do Prisma em calculo) | `gym.latitude.toNumber()` |
| Calculo Haversine inline no use-case | `getDistanceBetweenCoordinates(from, to)` |
| `should not check in beyond 100m` | `should not be able to check in on distant gym` |
| Coordenadas `{ latitude: 0, longitude: 0 }` em todos os testes | Coordenadas reais consistentes entre usuario e academia |
| `throw new Error()` generico | `throw new MaxDistanceError()` especifico |

## Troubleshooting

### Calculo de distancia retorna NaN ou erro de tipo
**Symptom:** `getDistanceBetweenCoordinates` retorna `NaN` ou `TypeError: latitude.toFixed is not a function`
**Cause:** Os campos latitude/longitude do Prisma sao do tipo `Decimal`, nao `number`, e funcoes matematicas nao aceitam Decimal
**Fix:** Converta com `.toNumber()` antes de passar para a funcao: `gym.latitude.toNumber()`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
