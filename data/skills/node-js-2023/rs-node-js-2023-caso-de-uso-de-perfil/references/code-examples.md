# Code Examples: Caso de Uso de Perfil

## Exemplo completo: Interface do repositorio atualizada

```typescript
// src/repositories/users-repository.ts
import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
```

## Exemplo completo: In-Memory Repository com findById

```typescript
// src/repositories/in-memory/in-memory-users-repository.ts
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)
    if (!user) {
      return null
    }
    return user
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)
    if (!user) {
      return null
    }
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
```

## Exemplo completo: ResourceNotFoundError

```typescript
// src/use-cases/errors/resource-not-found-error.ts
export class ResourceNotFoundError extends Error {
  constructor() {
    super('Resource not found.')
  }
}
```

## Exemplo completo: GetUserProfileUseCase

```typescript
// src/use-cases/get-user-profile.ts
import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
```

## Exemplo completo: Teste unitario

```typescript
// src/use-cases/get-user-profile.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { hash } from 'bcryptjs'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
```

## Nota sobre o Prisma Repository

O instrutor menciona que o `PrismaUsersRepository` tambem precisa implementar `findById`, mas nao faz neste momento. A implementacao seria:

```typescript
// src/repositories/prisma/prisma-users-repository.ts
async findById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  return user
}
```

Ele deixa isso para quando for implementar a camada HTTP/infra.

## Padrao de nomenclatura do use case

O instrutor segue o padrao consistente:
- Arquivo: `get-user-profile.ts`
- Classe: `GetUserProfileUseCase`
- Request type: `GetUserProfileUseCaseRequest`
- Response type: `GetUserProfileUseCaseResponse`
- Teste: `get-user-profile.spec.ts`