---
name: rs-node-js-2023-repository-pattern
description: "Applies the Repository Pattern to abstract database operations into dedicated classes when writing Node.js/TypeScript backend code. Use when user asks to 'create a repository', 'abstract database logic', 'separate database code', 'implement SOLID', or 'organize backend architecture'. Enforces: all DB operations go through repository classes, use ORM-generated types for method parameters, return created entities from mutation methods. Make sure to use this skill whenever generating backend code that interacts with a database. Not for frontend code, API route handlers, or business logic in use cases."
---

# Repository Pattern

> Toda comunicacao com o banco de dados passa por classes repositorio dedicadas, nunca diretamente nos casos de uso.

## Rules

1. **Crie uma pasta `repositories/`** — cada entidade tem seu proprio arquivo `{orm}-{entity}-repository.ts`, porque quando trocar de ORM so esses arquivos mudam
2. **Use classes, nao funcoes soltas** — `class PrismaUsersRepository` agrupa todos os metodos de uma entidade, porque facilita instanciacao e futura injecao de dependencia
3. **Nomeie arquivos com prefixo do ORM** — `prisma-users-repository.ts`, nao `users-repository.ts`, porque voce tera multiplas implementacoes do mesmo repositorio
4. **Type parametros com tipos gerados pelo ORM** — `Prisma.UserCreateInput` em vez de recriar a tipagem manualmente, porque o ORM ja gera tipos exatos para cada operacao (create, update, etc.)
5. **Retorne a entidade criada/modificada** — `return await prisma.user.create({ data })`, porque o caso de uso pode precisar trabalhar com o resultado
6. **Casos de uso instanciam repositorios, nunca acessam ORM diretamente** — toda query/mutation passa pelo repositorio, porque isola o codigo especifico de ferramenta

## How to write

### Classe repositorio

```typescript
// repositories/prisma-users-repository.ts
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data })
    return user
  }
}
```

### Caso de uso consumindo o repositorio

```typescript
// use-cases/register.ts
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

export async function registerUseCase({ name, email, password }: RegisterInput) {
  const passwordHash = await hash(password, 6)

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    name,
    email,
    password_hash: passwordHash,
  })
}
```

## Example

**Before (ORM acoplado no caso de uso):**
```typescript
export async function registerUseCase({ name, email, password }: RegisterInput) {
  const passwordHash = await hash(password, 6)

  await prisma.user.create({
    data: { name, email, password_hash: passwordHash },
  })
}
```

**After (com Repository Pattern):**
```typescript
// repositories/prisma-users-repository.ts
export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data })
    return user
  }
}

// use-cases/register.ts
export async function registerUseCase({ name, email, password }: RegisterInput) {
  const passwordHash = await hash(password, 6)
  const usersRepository = new PrismaUsersRepository()

  await usersRepository.create({
    name, email, password_hash: passwordHash,
  })
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo metodo de acesso ao banco | Adicione ao repositorio da entidade, nunca no caso de uso |
| Trocar ORM no futuro | Crie nova classe (ex: `TypeormUsersRepository`), so mude os imports |
| Metodo precisa de tipagem | Use `Prisma.{Entity}{Operation}Input` gerado automaticamente |
| Repositorio ficando grande | Um repositorio por entidade, nunca misture entidades |
| Caso de uso precisa do resultado | Capture o retorno do metodo do repositorio |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `prisma.user.create()` dentro do caso de uso | `usersRepository.create()` |
| `data: { name: string, email: string }` tipagem manual | `data: Prisma.UserCreateInput` |
| `users-repository.ts` sem prefixo de ORM | `prisma-users-repository.ts` |
| Funcoes exportadas soltas para cada operacao | Classe com metodos agrupados |
| Repositorio que nao retorna a entidade criada | `return await prisma.user.create({ data })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
