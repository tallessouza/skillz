---
name: rs-node-js-2023-interface-do-repositorio
description: "Enforces repository interface pattern and Dependency Inversion when writing Node.js backend code. Use when user asks to 'create a repository', 'implement SOLID', 'decouple from database', 'invert dependencies', or 'create use case'. Applies contract-first design: interface defines methods, concrete classes implement, use cases depend only on abstractions. Make sure to use this skill whenever creating repositories, use cases, or data access layers in TypeScript/Node.js. Not for frontend components, UI patterns, or REST controller design."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: solid-patterns
  tags: [repository-pattern, dependency-inversion, solid, interface, typescript, use-case, clean-architecture]
---

# Interface do Repositório — Dependency Inversion

> Use cases nunca importam implementacoes concretas de banco de dados — dependem apenas de interfaces (contratos) que definem metodos, parametros e retornos.

## Rules

1. **Comece sempre pela interface** — ela e o contrato entre use case e repositorio, porque define quais metodos existem, quais parametros recebem e o que devolvem
2. **Use case importa apenas a interface** — nunca o repositorio concreto (ex: PrismaUsersRepository), porque o use case deve ficar totalmente desacoplado do ORM/banco
3. **Repositorios concretos implementam a interface** — usando `implements`, porque o TypeScript forca a implementacao de todos os metodos do contrato
4. **Metodos do repositorio sao especificos, nao genericos** — `findByEmail()` em vez de `findUnique()`, porque metodos especificos comunicam intencao e sao mais seguros
5. **Retornos nullable sao explicitos** — `Promise<User | null>` quando busca pode nao encontrar, porque forca o consumidor a tratar o caso nulo
6. **Organize repositorios por provider** — pasta `repositories/prisma/` para Prisma, `repositories/in-memory/` para testes, porque separa contrato de implementacao

## How to write

### Interface (contrato)

```typescript
// repositories/users-repository.ts
export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
}
```

### Repositorio concreto

```typescript
// repositories/prisma/prisma-users-repository.ts
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({ data })
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    return user
  }
}
```

### Use case (depende so da interface)

```typescript
// use-cases/register.ts
import { UsersRepository } from '../repositories/users-repository'

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterInput) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6),
    })

    return { user }
  }
}
```

## Example

**Before (use case acoplado ao Prisma):**
```typescript
import { prisma } from '../lib/prisma'

export class RegisterUseCase {
  async execute({ name, email, password }) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: { email },
    })
    const user = await prisma.user.create({
      data: { name, email, password_hash },
    })
    return { user }
  }
}
```

**After (desacoplado via interface):**
```typescript
import { UsersRepository } from '../repositories/users-repository'

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    const user = await this.usersRepository.create({
      name, email, password_hash,
    })
    return { user }
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case precisa acessar banco | Crie interface primeiro, depois implemente |
| Metodo generico como `findUnique` | Renomeie para metodo especifico: `findByEmail`, `findById` |
| Novo provider (outro banco/API) | Crie nova classe que implementa a mesma interface |
| Testes unitarios | Crie `InMemoryRepository implements Interface` |
| Use case importa Prisma/TypeORM | Extraia para interface — violacao de Dependency Inversion |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import { prisma } from` no use case | `import { UsersRepository } from` (interface) |
| `repository.findUnique({ where: { email } })` | `repository.findByEmail(email)` |
| Classe repositorio sem `implements` | `class PrismaUsersRepo implements UsersRepository` |
| `Promise<User>` quando busca pode falhar | `Promise<User \| null>` |
| Repositorios soltos na raiz de `repositories/` | Subpasta por provider: `repositories/prisma/` |

## Troubleshooting

### Use case importa diretamente o Prisma ao inves da interface
**Symptom:** Use case nao pode ser testado sem banco de dados real
**Cause:** O use case importa `PrismaUsersRepository` diretamente em vez da interface `UsersRepository`
**Fix:** Troque o import para a interface e receba o repositorio via construtor: `constructor(private usersRepository: UsersRepository)`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
