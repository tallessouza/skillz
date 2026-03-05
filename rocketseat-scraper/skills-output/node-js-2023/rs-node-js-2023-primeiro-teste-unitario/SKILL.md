---
name: rs-node-js-2023-primeiro-teste-unitario
description: "Enforces unit testing patterns with dependency inversion and fake repositories when writing Node.js tests. Use when user asks to 'write a unit test', 'test a use case', 'create test for service', 'mock repository', or 'test without database'. Applies rules: never use real database in unit tests, create in-memory fake repositories, test one unit in isolation, return named objects from use cases. Make sure to use this skill whenever generating unit tests for use cases or services with repository dependencies. Not for end-to-end tests, integration tests, or API route testing."
---

# Primeiro Teste Unitario

> Testes unitarios testam uma unidade isolada do codigo, sem tocar em banco de dados ou camadas externas.

## Rules

1. **Nunca use repositorio real em teste unitario** — use um objeto fake que imita a interface do repositorio, porque testes unitarios nao podem depender de banco de dados (ficam lentos e geram conflitos entre execucoes)
2. **Crie repositorios fake inline ou em arquivo separado** — implemente apenas os metodos necessarios com retornos ficticios, porque a inversao de dependencia permite substituir a implementacao real sem alterar o caso de uso
3. **Cada regra de negocio exige pelo menos um teste** — identifique requisitos funcionais, nao-funcionais e regras de negocio; cada um vira no minimo um teste
4. **Retorne objetos nomeados dos use cases** — `return { user }` ao inves de `return user`, porque facilita adicionar novos campos no futuro sem quebrar a estrutura de retorno
5. **Use nomes semanticos para variaveis de teste** — `isPasswordCorrectlyHashed` ao inves de `result` ou `check`, porque o nome da variavel documenta a intencao do teste
6. **Metodos nao utilizados no fake podem ser minimos** — se o teste nao usa `findByEmail`, retorne apenas `null`; nao implemente logica desnecessaria

## How to write

### Repositorio fake inline

```typescript
const usersRepository: UsersRepository = {
  async create(data) {
    return {
      id: 'user-1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }
  },
  async findByEmail() {
    return null
  },
}
```

### Teste unitario com fake repository

```typescript
import { describe, it, expect } from 'vitest'
import { compare } from 'bcryptjs'
import { RegisterUseCase } from './register'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const usersRepository: UsersRepository = {
      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
      async findByEmail() {
        return null
      },
    }

    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
```

### Retorno nomeado no use case

```typescript
interface RegisterUseCaseResponse {
  user: User
}

async execute(data): Promise<RegisterUseCaseResponse> {
  // ... logica
  return { user }
}
```

## Example

**Before (teste de integracao disfarçado de unitario):**
```typescript
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'

it('should register user', async () => {
  const prismaRepo = new PrismaUsersRepository()
  const useCase = new RegisterUseCase(prismaRepo)
  // Bate no banco real, lento, conflitos entre execucoes
  const { user } = await useCase.execute({ ... })
})
```

**After (teste unitario real com fake):**
```typescript
it('should register user', async () => {
  const fakeRepo: UsersRepository = {
    async create(data) {
      return { id: 'user-1', ...data, created_at: new Date() }
    },
    async findByEmail() { return null },
  }
  const useCase = new RegisterUseCase(fakeRepo)
  // Sem banco, 20ms, sem conflitos
  const { user } = await useCase.execute({ ... })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Testando logica de negocio (hash, validacao, calculo) | Teste unitario com fake repository |
| Testando comunicacao entre camadas (use case + banco) | Teste de integracao (outra categoria) |
| Testando fluxo completo HTTP → DB | Teste end-to-end (outra categoria) |
| Metodo do fake nao e usado no teste | Retorne valor minimo (null, [], etc) |
| Use case retorna dado unico | Retorne em objeto nomeado `{ user }` |
| Precisa verificar hash de senha | Use `compare` do bcryptjs, nunca tente descriptografar |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new PrismaUsersRepository()` em teste unitario | Objeto fake implementando a interface |
| `const result = await useCase.execute(...)` | `const { user } = await useCase.execute(...)` |
| `return user` direto no use case | `return { user }` em objeto nomeado |
| `const res = await compare(...)` | `const isPasswordCorrectlyHashed = await compare(...)` |
| Rodar teste unitario contra banco real | Fake repository que retorna dados ficticios |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
