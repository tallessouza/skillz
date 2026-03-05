# Code Examples: Validando Distancia do Check-in

## Funcao Haversine completa

```typescript
// src/utils/get-distance-between-coordinates.ts
export interface Coordinate {
  latitude: number
  longitude: number
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  const fromRadian = (Math.PI * from.latitude) / 180
  const toRadian = (Math.PI * to.latitude) / 180

  const theta = from.longitude - to.longitude
  const radTheta = (Math.PI * theta) / 180

  let dist =
    Math.sin(fromRadian) * Math.sin(toRadian) +
    Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta)

  if (dist > 1) {
    dist = 1
  }

  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344 // Converte milhas para quilometros

  return dist
}
```

## Use-case com validacao de distancia

```typescript
// src/use-cases/check-in.ts
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

const MAX_DISTANCE_IN_KILOMETERS = 0.1

// Dentro do execute():
const gym = await this.gymsRepository.findById(gymId)

if (!gym) {
  throw new ResourceNotFoundError()
}

const distance = getDistanceBetweenCoordinates(
  { latitude: userLatitude, longitude: userLongitude },
  { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
)

if (distance > MAX_DISTANCE_IN_KILOMETERS) {
  throw new MaxDistanceError()
}
```

## Teste: nao pode fazer check-in em academia distante

```typescript
it('should not be able to check in on distant gym', async () => {
  gymsRepository.items.push({
    id: 'gym-02',
    title: 'Far Away Gym',
    description: '',
    phone: '',
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

## Correcao das fixtures existentes

```typescript
// ANTES: academia com coordenadas zero (quebra com validacao de distancia)
gymsRepository.items.push({
  id: 'gym-01',
  latitude: new Decimal(0),
  longitude: new Decimal(0),
})

// DEPOIS: academia com mesmas coordenadas do usuario
gymsRepository.items.push({
  id: 'gym-01',
  latitude: new Decimal(-27.2092052),
  longitude: new Decimal(-49.6401091),
})
```

## Teste: pode fazer check-in (academia proxima)

```typescript
it('should be able to check in', async () => {
  // Academia e usuario com MESMAS coordenadas = distancia 0
  gymsRepository.items.push({
    id: 'gym-01',
    title: 'Nearby Gym',
    latitude: new Decimal(-27.2092052),
    longitude: new Decimal(-49.6401091),
  })

  const { checkIn } = await sut.execute({
    gymId: 'gym-01',
    userId: 'user-01',
    userLatitude: -27.2092052,
    userLongitude: -49.6401091,
  })

  expect(checkIn.id).toEqual(expect.any(String))
})
```