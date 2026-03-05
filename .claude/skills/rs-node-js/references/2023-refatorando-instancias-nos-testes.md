---
name: rs-nodejs-refatorando-instancias-testes
description: "Enforces beforeEach test isolation pattern when writing unit tests in TypeScript/JavaScript. Use when user asks to 'write tests', 'create test file', 'add unit tests', 'refactor tests', or any test creation task. Applies rules: declare variables with let outside describe, instantiate inside beforeEach, never share state between tests, import beforeEach from vitest not node:test. Make sure to use this skill whenever generating or refactoring test files. Not for production code, integration tests with real databases, or E2E tests."
---

# Isolamento de Testes com beforeEach

> Cada teste unitario deve executar em um contexto totalmente zerado, sem interferencia de testes anteriores.

## Rules

1. **Declare variaveis com `let` fora do `describe`, sem inicializar** — `let sut: RegisterUseCase`, porque o escopo precisa ser visivel para todos os testes mas a instancia precisa ser renovada
2. **Inicialize dentro do `beforeEach`** — crie novas instancias antes de cada teste, porque reusar repositorios entre testes causa resultados inconsistentes dependendo da ordem de execucao
3. **Importe `beforeEach` do vitest** — `import { describe, it, expect, beforeEach } from 'vitest'`, porque `node:test` ainda e experimental e tem API diferente
4. **Nomeie o subject under test como `sut`** — convencao que identifica imediatamente o que esta sendo testado
5. **Nunca compartilhe estado entre testes** — repositorios in-memory acumulam dados entre testes se nao forem recriados, causando falsos positivos ou negativos

## How to write

### Estrutura padrao de arquivo de teste

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { RegisterUseCase } from './register'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
```

## Example

**Before (instancias repetidas e compartilhadas):**
```typescript
describe('Register Use Case', () => {
  it('should register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)
    // ... test
  })

  it('should hash password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)
    // ... test
  })

  it('should not allow duplicate email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)
    // ... test
  })
})
```

**After (beforeEach com contexto isolado):**
```typescript
let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should register', async () => {
    const { user } = await sut.execute({ /* ... */ })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash password', async () => {
    const { user } = await sut.execute({ /* ... */ })
    // assert on password hash
  })

  it('should not allow duplicate email', async () => {
    await sut.execute({ email: 'john@example.com', /* ... */ })
    await expect(() =>
      sut.execute({ email: 'john@example.com', /* ... */ }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case recebe 1-2 repositorios | `let` + `beforeEach` padrao |
| Use case recebe 5-6 dependencias | `beforeEach` e ainda mais critico — evita 30+ linhas repetidas |
| Teste precisa de dados pre-existentes | Crie os dados DENTRO do `it`, nao no `beforeEach` |
| Multiplos describes aninhados | Cada nivel pode ter seu proprio `beforeEach` |
| Variavel usada em apenas 1 teste | Declare dentro do `it`, nao no escopo externo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const repo = new Repo()` no topo do describe (sem beforeEach) | `let repo` no topo + `repo = new Repo()` no beforeEach |
| `import { beforeEach } from 'node:test'` | `import { beforeEach } from 'vitest'` |
| `let sut = new UseCase(repo)` (inicializado na declaracao) | `let sut: UseCase` (sem inicializar) |
| Reutilizar nome generico como `useCase` | Usar `sut` (subject under test) |
| Criar dados de setup no `beforeEach` que so um teste usa | Criar dados especificos dentro do proprio `it` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-refatorando-instancias-nos-testes/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-refatorando-instancias-nos-testes/references/code-examples.md)
