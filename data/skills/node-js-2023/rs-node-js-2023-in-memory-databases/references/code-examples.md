# Code Examples: In-Memory Test Database Pattern

## 1. Interface do Repositorio (contrato)

```typescript
// src/repositories/users-repository.ts
import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
```

## 2. Repositorio Real (Prisma)

```typescript
// src/repositories/prisma/prisma-users-repository.ts
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data })
    return user
  }
}
```

## 3. Repositorio In-Memory (completo)

```typescript
// src/repositories/in-memory/in-memory-users-repository.ts
import { User } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
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

## 4. Use Case que recebe o repositorio via construtor

```typescript
// src/use-cases/register.ts
import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { hash } from 'bcryptjs'

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
```

## 5. Suite de testes completa

```typescript
// src/use-cases/register.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from './register'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  // Teste de sucesso: verifica que o usuario foi criado com um ID
  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // expect.any(String) valida que e qualquer string, nao null/undefined
    expect(user.id).toEqual(expect.any(String))
  })

  // Teste de erro: verifica que email duplicado gera erro especifico
  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    // Primeiro cadastro: sucesso
    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    // Segundo cadastro com mesmo email: deve rejeitar
    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
```

## 6. Variacao: In-Memory para outra entidade

```typescript
// src/repositories/in-memory/in-memory-gyms-repository.ts
import { Gym } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id)
    if (!gym) return null
    return gym
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? 'gym-1',
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    }

    this.items.push(gym)
    return gym
  }
}
```

## 7. Pattern de teste com rejects e resolves

```typescript
// Testando que uma Promise REJEITA com erro especifico
await expect(() =>
  useCase.execute(invalidData),
).rejects.toBeInstanceOf(SpecificError)

// Testando que uma Promise RESOLVE com sucesso
await expect(
  useCase.execute(validData),
).resolves.toBeTruthy()

// Usando expect.any() para validar tipos sem valores exatos
expect(user.id).toEqual(expect.any(String))
expect(user.created_at).toEqual(expect.any(Date))
```