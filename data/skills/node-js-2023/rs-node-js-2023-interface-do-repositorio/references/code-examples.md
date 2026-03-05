# Code Examples: Interface do Repositório

## Exemplo 1: Criando a interface

```typescript
// src/repositories/users-repository.ts
import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
}
```

**Nota:** Os tipos `Prisma.UserCreateInput` e `User` vem do Prisma Client, mas a interface em si e agniostica — qualquer implementacao pode mapear esses tipos.

## Exemplo 2: Repositorio Prisma implementando o contrato

```typescript
// src/repositories/prisma/prisma-users-repository.ts
import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
}
```

**Ponto chave:** `implements UsersRepository` faz o TypeScript validar que todos os metodos do contrato estao presentes. Se voce remover `findByEmail`, o compilador acusa erro imediatamente.

## Exemplo 3: Use case desacoplado

```typescript
// src/use-cases/register.ts
import { UsersRepository } from '../repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
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

**Observe:** nenhum import de `prisma`, `@prisma/client` diretamente no use case. Apenas a interface `UsersRepository`.

## Exemplo 4: Controller instanciando o repositorio concreto

```typescript
// src/http/controllers/register.ts
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../../use-cases/register'

export async function register(request, reply) {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  const { name, email, password } = request.body

  await registerUseCase.execute({ name, email, password })

  return reply.status(201).send()
}
```

**Ponto chave:** A escolha de QUAL implementacao usar acontece no controller (ou em um factory/container), nunca no use case.

## Exemplo 5: Usando CTRL+. para implementar metodos faltantes

Quando voce adiciona `implements UsersRepository` a uma classe vazia:

```typescript
export class PrismaUsersRepository implements UsersRepository {
  // TypeScript mostra erro: faltam create e findByEmail
}
```

Usando CTRL+. (quick fix do VS Code), o TypeScript gera:

```typescript
export class PrismaUsersRepository implements UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User> {
    throw new Error('Method not implemented.')
  }
  findByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }
}
```

Ai voce substitui cada `throw` pela implementacao real.

## Estrutura final de pastas

```
src/
├── repositories/
│   ├── users-repository.ts              # Interface (contrato)
│   └── prisma/
│       └── prisma-users-repository.ts   # Implementacao Prisma
├── use-cases/
│   └── register.ts                      # Depende so da interface
└── http/
    └── controllers/
        └── register.ts                  # Instancia o concreto
```