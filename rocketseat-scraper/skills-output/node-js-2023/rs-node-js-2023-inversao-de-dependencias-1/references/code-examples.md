# Code Examples: Inversao de Dependencias

## 1. InMemoryUsersRepository (repositorio alternativo)

O instrutor cria este repositorio para demonstrar que a troca deve ser transparente:

```typescript
// src/repositories/in-memory/in-memory-users-repository.ts
export class InMemoryUsersRepository {
  public users: any[] = []

  async create(data: any) {
    this.users.push(data)
  }
}
```

Mesma interface que o `PrismaUsersRepository`, mas salva em array ao inves de banco.

## 2. PrismaUsersRepository (repositorio original)

```typescript
// src/repositories/prisma/prisma-users-repository.ts
import { prisma } from '@/lib/prisma'

export class PrismaUsersRepository {
  async create(data: any) {
    await prisma.user.create({ data })
  }
}
```

## 3. Use case ANTES da inversao (acoplado)

```typescript
// src/use-cases/register.ts — ANTES
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export async function registerUseCase({ name, email, password_hash }) {
  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}
```

Problema: `PrismaUsersRepository` instanciado diretamente. Para trocar, precisa editar este arquivo.

## 4. Use case DEPOIS da inversao (desacoplado)

```typescript
// src/use-cases/register.ts — DEPOIS
export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password_hash }) {
    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
```

Nenhuma referencia ao Prisma. Recebe qualquer repositorio pelo construtor.

## 5. Controller injetando a dependencia

```typescript
// src/http/controllers/register.ts
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '@/use-cases/register'

export async function register(request, reply) {
  const { name, email, password } = request.body

  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  await registerUseCase.execute({ name, email, password })

  return reply.status(201).send()
}
```

A decisao de qual repositorio usar fica no controller, nao no use case.

## 6. Trocando repositorio (uma linha)

```typescript
// Para trocar de Prisma para InMemory, mude apenas isto:
// const usersRepository = new PrismaUsersRepository()
const usersRepository = new InMemoryUsersRepository()

// O use case continua identico
const registerUseCase = new RegisterUseCase(usersRepository)
```

## 7. Hack TypeScript — com e sem

### Sem o hack (verbose):

```typescript
class RegisterUseCase {
  private usersRepository: any

  constructor(usersRepository: any) {
    this.usersRepository = usersRepository
  }
}
```

### Com o hack (conciso):

```typescript
class RegisterUseCase {
  constructor(private usersRepository: any) {}
}
```

Ambos produzem o mesmo resultado. A keyword `private`/`public`/`protected` no parametro do construtor cria automaticamente a propriedade.

## 8. ESLint: desabilitar useless-constructor

O ESLint reclama que o construtor e "useless" porque o corpo esta vazio. Desabilite:

```json
// .eslintrc.json
{
  "rules": {
    "no-useless-constructor": "off"
  }
}
```

Ou com comentario inline:

```typescript
// eslint-disable-next-line no-useless-constructor
constructor(private usersRepository: any) {}
```