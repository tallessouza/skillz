# Code Examples: Factories dos Casos de Uso

## Lista completa de factories criadas na aula

### 1. makeGetUserProfileUseCase

```typescript
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile-use-case'

export function makeGetUserProfileUseCase() {
  const repository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(repository)

  return useCase
}
```

### 2. makeGetUserMetricsUseCase

```typescript
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics-use-case'

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new GetUserMetricsUseCase(checkInsRepository)

  return useCase
}
```

Nota: este use case usa `CheckInsRepository`, nao `UsersRepository`, porque metricas do usuario sao calculadas a partir dos check-ins.

### 3. makeCheckInUseCase (multiplas dependencias)

```typescript
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in-use-case'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return useCase
}
```

### 4. makeFetchUserCheckInsHistoryUseCase

```typescript
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history-use-case'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

  return useCase
}
```

### 5. makeValidateCheckInUseCase

```typescript
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in-use-case'

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInUseCase(checkInsRepository)

  return useCase
}
```

### 6. makeSearchGymsUseCase

```typescript
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms-use-case'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new SearchGymsUseCase(gymsRepository)

  return useCase
}
```

### 7. makeFetchNearbyGymsUseCase

```typescript
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms-use-case'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseCase(gymsRepository)

  return useCase
}
```

### 8. makeCreateGymUseCase

```typescript
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym-use-case'

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(gymsRepository)

  return useCase
}
```

## Padrao de uso no controller (proximo passo)

```typescript
// http/controllers/check-in-controller.ts
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function checkIn(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeCheckInUseCase()

  const result = await useCase.execute({
    userId: request.user.sub,
    gymId: request.params.gymId,
    userLatitude: request.body.latitude,
    userLongitude: request.body.longitude,
  })

  return reply.status(201).send()
}
```

## Factory ja existente (referencia — authenticate)

A factory de `authenticate` ja existia antes desta aula e serviu de modelo para copiar:

```typescript
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate-use-case'

export function makeAuthenticateUseCase() {
  const repository = new PrismaUsersRepository()
  const useCase = new AuthenticateUseCase(repository)

  return useCase
}
```