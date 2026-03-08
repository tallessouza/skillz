---
name: rs-node-js-2023-in-memory-databases
description: "Applies the In-Memory Test Database pattern when writing unit tests for use cases in Node.js/TypeScript. Use when user asks to 'write unit tests', 'test a use case', 'create test doubles', 'mock a repository', or 'test without database'. Implements in-memory repositories that mirror real database operations using plain arrays. Make sure to use this skill whenever creating unit tests for application use cases or implementing the repository pattern. Not for integration tests, e2e tests, or actual database configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: unit-testing
  tags: [in-memory, test-doubles, repository-pattern, unit-tests, vitest, typescript]
---

# In-Memory Test Database Pattern

> Criar repositorios em memoria que espelham o comportamento real do banco de dados para testes unitarios rapidos e determinísticos.

## Rules

1. **Implemente a mesma interface do repositorio real** — `InMemoryUsersRepository implements UsersRepository`, porque o use case nao deve saber se esta usando banco real ou em memoria
2. **Use um array publico como armazenamento** — `public items: User[] = []`, porque permite inspecionar o estado interno nos testes
3. **Replique a logica com JavaScript puro** — findByEmail usa `Array.find()`, create usa `Array.push()`, porque testa a logica do use case sem depender de banco
4. **Retorne null (nao undefined) quando nao encontrar** — normalize o retorno de `find()` que retorna undefined, porque a interface do repositorio espera null
5. **Crie o repositorio em pasta dedicada** — `repositories/in-memory/in-memory-users-repository.ts`, porque sera reusado em multiplos testes
6. **Nunca teste o banco de dados em teste unitario** — o proposito e testar a logica do use case, nao a conexao com banco

## How to write

### Repositorio In-Memory

```typescript
import { User } from '@/entities/user'
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

### Teste usando In-Memory Repository

```typescript
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

beforeEach(() => {
  usersRepository = new InMemoryUsersRepository()
  sut = new RegisterUseCase(usersRepository)
})

it('should be able to register', async () => {
  const { user } = await sut.execute({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  expect(user.id).toEqual(expect.any(String))
})

it('should not be able to register with same email twice', async () => {
  const email = 'johndoe@example.com'

  await sut.execute({ name: 'John Doe', email, password: '123456' })

  await expect(() =>
    sut.execute({ name: 'John Doe', email, password: '123456' }),
  ).rejects.toBeInstanceOf(UserAlreadyExistsError)
})
```

## Example

**Before (repositorio fake inline no teste):**
```typescript
it('should register', async () => {
  const fakeRepo = {
    items: [],
    async findByEmail(email) { return null },
    async create(data) { return { id: '1', ...data } },
  }
  const useCase = new RegisterUseCase(fakeRepo)
  // ...
})
```

**After (In-Memory Repository reutilizavel):**
```typescript
it('should register', async () => {
  const usersRepository = new InMemoryUsersRepository()
  const useCase = new RegisterUseCase(usersRepository)
  const { user } = await useCase.execute({ name: 'John', email: 'j@e.com', password: '123' })
  expect(user.id).toEqual(expect.any(String))
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo use case criado | Criar In-Memory repository correspondente |
| Metodo novo no repository interface | Implementar tambem no In-Memory com Array methods |
| Teste precisa verificar estado do banco | Inspecionar `repository.items` diretamente |
| Teste de erro (duplicata, not found) | Usar `expect().rejects.toBeInstanceOf(ErrorClass)` |
| Teste de sucesso simples | Usar `expect(value).toEqual(expect.any(String))` para IDs |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Repositorio fake inline em cada teste | `InMemoryXxxRepository` em arquivo dedicado |
| `find()` retornando undefined direto | Checar undefined e retornar null |
| Testar conexao com banco em teste unitario | Testar apenas logica do use case |
| `items` como variavel privada | `public items` para inspecao nos testes |
| Recriar repositorio manualmente em cada it() | Usar `beforeEach` para instanciar |

## Troubleshooting

### In-Memory repository retorna undefined ao inves de null
**Symptom:** Teste falha porque o use case espera `null` mas recebe `undefined` ao buscar entidade inexistente
**Cause:** `Array.find()` retorna `undefined` quando nao encontra, mas a interface do repositorio espera `null`
**Fix:** Normalize o retorno: `const user = this.items.find(...); if (!user) return null; return user`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
