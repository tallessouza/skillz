# Code Examples: API Node.js com SOLID

## Nota sobre esta aula

A aula de introducao nao contem codigo — e uma visao geral do que sera construido. Os exemplos abaixo ilustram os patterns mencionados pelo instrutor para dar contexto pratico.

## Repository Pattern

### Interface (contrato)
```typescript
// src/repositories/users-repository.ts
export interface UsersRepository {
  create(data: {
    name: string
    email: string
    password_hash: string
  }): Promise<User>
  
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}
```

### Implementacao concreta (Prisma)
```typescript
// src/repositories/prisma/prisma-users-repository.ts
import { prisma } from '@/lib/prisma'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async create(data) {
    const user = await prisma.user.create({ data })
    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    return user
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })
    return user
  }
}
```

### In-Memory (testes)
```typescript
// src/repositories/in-memory/in-memory-users-repository.ts
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(data) {
    const user = {
      id: randomUUID(),
      ...data,
      created_at: new Date(),
    }
    this.items.push(user)
    return user
  }

  async findByEmail(email: string) {
    return this.items.find(item => item.email === email) ?? null
  }

  async findById(id: string) {
    return this.items.find(item => item.id === id) ?? null
  }
}
```

## Use Case com Dependency Inversion

```typescript
// src/use-cases/create-user.ts
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

export class CreateUserUseCase {
  // Recebe interface, nao implementacao concreta
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: CreateUserInput) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
```

## Factory Pattern

```typescript
// src/use-cases/factories/make-create-user-use-case.ts
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { CreateUserUseCase } from '../create-user'

export function makeCreateUserUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new CreateUserUseCase(usersRepository)
  return useCase
}
```

## Teste unitario com in-memory

```typescript
// src/use-cases/create-user.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { CreateUserUseCase } from './create-user'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(usersRepository)
  })

  it('should create a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not allow duplicate email', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
```

## Piramide de testes na pratica

```
Testes unitarios (use cases com in-memory repos)
  → Rapidos (~ms cada)
  → Rodam a cada save
  → Cobrem regras de negocio isoladas

Testes de integracao (controllers + banco)
  → Medios (~100ms cada)  
  → Rodam antes de push
  → Cobrem fluxo HTTP + persistencia

Testes E2E (fluxo completo)
  → Lentos (~1s+ cada)
  → Rodam no CI/CD
  → Cobrem cenarios de usuario real
```