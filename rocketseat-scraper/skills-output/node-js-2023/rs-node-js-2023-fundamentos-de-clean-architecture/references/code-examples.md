# Code Examples: Fundamentos de Clean Architecture

## Exemplo do curso — Use Case importando entidade

O instrutor referencia o codigo ja existente no projeto do curso:

```typescript
// src/domain/use-cases/answer-question.ts
// O use case importa a entidade Answer — isso e permitido
// porque use cases podem depender de entities (flecha aponta para dentro)
import { Answer } from '../entities/answer'

export class AnswerQuestionUseCase {
  async execute(input: { questionId: string; authorId: string; content: string }) {
    const answer = Answer.create({
      questionId: input.questionId,
      authorId: input.authorId,
      content: input.content,
    })
    return answer
  }
}
```

## Dependencia correta vs incorreta

### INCORRETO — Use case depende de infraestrutura
```typescript
// ERRADO: use case importa diretamente uma lib de banco de dados
import { PrismaClient } from '@prisma/client'
import { MongoClient } from 'mongodb'

export class CreateUserUseCase {
  private prisma = new PrismaClient()

  async execute(data: CreateUserInput) {
    // Acoplado a Prisma — se trocar banco, este codigo quebra
    return this.prisma.user.create({ data })
  }
}
```

### CORRETO — Use case depende de contrato (interface)
```typescript
// Contrato na camada de dominio
export interface UserRepository {
  create(user: User): Promise<void>
  findById(id: string): Promise<User | null>
}

// Use case depende do contrato, nao da implementacao
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: CreateUserInput) {
    const user = User.create(data)
    await this.userRepository.create(user)
    return user
  }
}

// Implementacao concreta fica na camada de INFRAESTRUTURA
// src/infra/database/prisma-user-repository.ts
import { PrismaClient } from '@prisma/client'
import { UserRepository } from '../../domain/repositories/user-repository'

export class PrismaUserRepository implements UserRepository {
  private prisma = new PrismaClient()

  async create(user: User): Promise<void> {
    await this.prisma.user.create({ data: { ... } })
  }

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } })
    return raw ? UserMapper.toDomain(raw) : null
  }
}
```

## Fluxo completo de uma requisicao

```typescript
// 1. INFRAESTRUTURA — Route (framework-specific)
// src/infra/http/routes/create-user.route.ts
app.post('/users', async (req, res) => {
  const controller = makeCreateUserController()
  const result = await controller.handle(req.body)
  return res.status(result.statusCode).json(result.body)
})

// 2. INTERFACE ADAPTER — Controller (adapta HTTP para use case)
// src/adapters/controllers/create-user.controller.ts
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  async handle(input: { name: string; email: string }) {
    // Adapta dados do formato HTTP para formato do use case
    const user = await this.createUser.execute({
      name: input.name,
      email: input.email,
    })
    // Presenter: formata saida
    return { statusCode: 201, body: { userId: user.id } }
  }
}

// 3. USE CASE — Logica pura (nao sabe de HTTP, banco, framework)
// src/domain/use-cases/create-user.ts
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: { name: string; email: string }): Promise<User> {
    const user = User.create(input)
    await this.userRepository.create(user)
    return user
  }
}

// 4. ENTITY — Regra de negocio pura
// src/domain/entities/user.ts
export class User {
  readonly id: string
  readonly name: string
  readonly email: string

  static create(props: { name: string; email: string }): User {
    // Validacoes de dominio aqui
    return new User(props)
  }
}
```

## Teste de desacoplamento — trocando banco sem alterar dominio

```typescript
// Antes: Postgres via Prisma
// src/infra/database/prisma-user-repository.ts
export class PrismaUserRepository implements UserRepository {
  async create(user: User) { /* prisma.user.create */ }
  async findById(id: string) { /* prisma.user.findUnique */ }
}

// Depois: MongoDB via Mongoose — SEM alterar use case ou entity
// src/infra/database/mongo-user-repository.ts
export class MongoUserRepository implements UserRepository {
  async create(user: User) { /* UserModel.create */ }
  async findById(id: string) { /* UserModel.findById */ }
}

// O use case continua IDENTICO:
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}
  // Nenhuma linha muda aqui
}
```

## Mapa de dependencias permitidas

```
Entity        → nada (camada mais interna)
Use Case      → Entity, contratos (interfaces)
Adapter       → Use Case, Entity, contratos
Infraestrutura → Adapter, Use Case, Entity, contratos, libs externas

PROIBIDO:
Entity        → Use Case, Adapter, Infraestrutura
Use Case      → Adapter, Infraestrutura
Adapter       → Infraestrutura (implementacao direta)
```