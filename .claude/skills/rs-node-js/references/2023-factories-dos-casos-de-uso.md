---
name: rs-node-js-2023-factories-casos-de-uso
description: "Enforces the Factory pattern for use case instantiation in Node.js SOLID architecture. Use when user asks to 'create a use case', 'add a new feature', 'implement a service', or 'wire up dependencies'. Ensures every use case has a dedicated make function that encapsulates dependency resolution. Make sure to use this skill whenever creating or refactoring use cases with repository dependencies. Not for HTTP controllers, route definitions, or middleware configuration."
---

# Factories dos Casos de Uso

> Todo caso de uso deve ter uma factory function dedicada que encapsula a criacao de suas dependencias, nunca instancie repositorios diretamente no controller.

## Rules

1. **Uma factory por caso de uso** — cada use case ganha um arquivo `make-{use-case-name}.ts` dentro de `use-cases/factories/`, porque centraliza a resolucao de dependencias em um unico lugar
2. **Nomeie com prefixo `make`** — `makeCheckInUseCase`, `makeSearchGymsUseCase`, porque o prefixo `make` comunica que a funcao e uma factory que retorna uma instancia pronta
3. **Instancie repositorios concretos dentro da factory** — `new PrismaUsersRepository()` dentro da factory, nunca no controller, porque isso isola a decisao de qual implementacao usar
4. **Retorne o caso de uso pronto** — a factory retorna a instancia do use case com todas as dependencias injetadas, porque o consumidor nao precisa conhecer as dependencias
5. **Multiplas dependencias na mesma factory** — se o use case depende de 2+ repositorios, todos sao instanciados na mesma factory, porque a factory e o unico lugar que conhece o grafo de dependencias
6. **Factory nao recebe parametros** — a factory nao aceita argumentos externos, porque ela encapsula completamente a configuracao de producao

## How to write

### Factory simples (uma dependencia)

```typescript
// use-cases/factories/make-get-user-profile-use-case.ts
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile-use-case'

export function makeGetUserProfileUseCase() {
  const repository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(repository)

  return useCase
}
```

### Factory com multiplas dependencias

```typescript
// use-cases/factories/make-check-in-use-case.ts
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in-use-case'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return useCase
}
```

## Example

**Before (dependencias no controller):**

```typescript
// controller instanciando repositorios — acoplamento direto
app.post('/check-ins', async (req, res) => {
  const checkInsRepo = new PrismaCheckInsRepository()
  const gymsRepo = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(checkInsRepo, gymsRepo)
  const result = await useCase.execute(req.body)
  return res.json(result)
})
```

**After (usando factory):**

```typescript
// controller limpo — nao conhece dependencias
app.post('/check-ins', async (req, res) => {
  const useCase = makeCheckInUseCase()
  const result = await useCase.execute(req.body)
  return res.json(result)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Novo use case criado | Criar factory correspondente imediatamente |
| Use case com 1 dependencia | Factory com um repositorio, retorna use case |
| Use case com N dependencias | Todos os N repositorios na mesma factory |
| Trocar de ORM/banco | Alterar apenas as factories, nao os controllers |
| Testes unitarios | Nao usam factories — injetam in-memory repositories direto |
| Testes E2E | Usam as factories reais (Prisma) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new PrismaUsersRepository()` no controller | `makeGetUserProfileUseCase()` |
| Factory que recebe repositorio como parametro | Factory sem parametros, instancia internamente |
| Um arquivo factory para multiplos use cases | Um arquivo factory por use case |
| `const repo = req.app.get('repo')` | Factory encapsula a resolucao |
| Instanciar use case sem factory fora de testes | Sempre usar `make*UseCase()` em codigo de producao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-factories-dos-casos-de-uso/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-factories-dos-casos-de-uso/references/code-examples.md)
