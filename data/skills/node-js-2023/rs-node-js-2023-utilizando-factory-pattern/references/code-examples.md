# Code Examples: Factory Pattern para Use Cases

## Exemplo 1: Factory do RegisterUseCase

```typescript
// src/use-cases/factories/make-register-use-case.ts
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new RegisterUseCase(usersRepository)

  return useCase
}
```

## Exemplo 2: Factory do AuthenticateUseCase

```typescript
// src/use-cases/factories/make-authenticate-use-case.ts
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new AuthenticateUseCase(usersRepository)

  return useCase
}
```

## Exemplo 3: Controller ANTES da factory

```typescript
// src/http/controllers/register.ts
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '@/use-cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = request.body

  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  await registerUseCase.execute({ name, email, password })

  return reply.status(201).send()
}
```

## Exemplo 4: Controller DEPOIS da factory

```typescript
// src/http/controllers/register.ts
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = request.body

  const registerUseCase = makeRegisterUseCase()

  await registerUseCase.execute({ name, email, password })

  return reply.status(201).send()
}
```

## Exemplo 5: Controller do Authenticate com factory

```typescript
// src/http/controllers/authenticate.ts
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body

  const authenticateUseCase = makeAuthenticateUseCase()

  const { user } = await authenticateUseCase.execute({ email, password })

  return reply.status(200).send()
}
```

## Exemplo 6: Factory com multiplas dependencias (cenario futuro)

```typescript
// src/use-cases/factories/make-check-in-use-case.ts
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return useCase
}
```

## Estrutura de pastas

```
src/
├── use-cases/
│   ├── register.ts
│   ├── authenticate.ts
│   ├── check-in.ts
│   └── factories/
│       ├── make-register-use-case.ts
│       ├── make-authenticate-use-case.ts
│       └── make-check-in-use-case.ts
├── http/
│   └── controllers/
│       ├── register.ts        # usa makeRegisterUseCase()
│       └── authenticate.ts    # usa makeAuthenticateUseCase()
└── repositories/
    └── prisma/
        ├── prisma-users-repository.ts
        ├── prisma-check-ins-repository.ts
        └── prisma-gyms-repository.ts
```