---
name: rs-node-js-2023-factory-pattern
description: "Applies Factory Pattern to centralize use-case instantiation with their dependencies in Node.js applications. Use when user asks to 'create a use case', 'organize dependencies', 'instantiate service', 'refactor controller', or 'add factory'. Ensures all use-case creation goes through factory functions prefixed with 'make', eliminating scattered dependency wiring across controllers. Make sure to use this skill whenever creating or refactoring use cases in Node.js/TypeScript projects. Not for dependency injection containers, IoC frameworks, or frontend component factories."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: factory-pattern
  tags: [factory, use-case, dependency-injection, solid, clean-architecture, make]
---

# Factory Pattern para Use Cases

> Centralize a criacao de use cases em funcoes factory para que dependencias sejam gerenciadas em um unico lugar.

## Rules

1. **Crie uma funcao factory para cada use case** — prefixada com `make`, porque centraliza todas as dependencias e evita duplicacao em cada controller que usa o mesmo use case
2. **Factory nao tem regra de negocio** — serve exclusivamente para instanciar dependencias e retornar o use case pronto, porque misturar logica aqui quebra a separacao de responsabilidades
3. **Controllers nunca instanciam repositorios diretamente** — sempre usam a factory, porque quando o use case ganhar novas dependencias, voce muda em um lugar so
4. **Factories ficam em `use-cases/factories/`** — colocadas junto dos use cases que fabricam, porque pertencem ao mesmo dominio
5. **Nomenclatura: `make-{nome}-use-case.ts`** — exportando `make{Nome}UseCase`, porque o prefixo `make` sinaliza que e uma factory

## How to write

### Factory basica

```typescript
// use-cases/factories/make-register-use-case.ts
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  return registerUseCase
}
```

### Controller usando factory

```typescript
// http/controllers/register.ts
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request, reply) {
  const registerUseCase = makeRegisterUseCase()
  // usar o use case diretamente
}
```

## Example

**Before (dependencias espalhadas no controller):**
```typescript
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '@/use-cases/register'

export async function register(request, reply) {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)
  // ...
}
```

**After (factory centraliza):**
```typescript
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request, reply) {
  const registerUseCase = makeRegisterUseCase()
  // ...
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case tem 1+ dependencias | Criar factory |
| Use case usado em 2+ controllers | Factory obrigatoria |
| Nova dependencia adicionada ao use case | Atualizar apenas a factory |
| Use case sem dependencias | Factory opcional, mas consistente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new PrismaRepo()` dentro do controller | `makeXxxUseCase()` |
| Factory com `if/else` ou logica de negocio | Factory so instancia e retorna |
| Factory que recebe parametros de request | Factory recebe no maximo config de ambiente |
| Dependencias duplicadas em 3 controllers | Uma factory reutilizada nos 3 |

## Troubleshooting

### Use case recebe dependencia undefined no controller
**Symptom:** `TypeError: Cannot read properties of undefined` ao chamar metodo do repositorio dentro do use case
**Cause:** O controller esta instanciando o use case diretamente sem passar as dependencias, em vez de usar a factory
**Fix:** Substitua `new RegisterUseCase()` por `makeRegisterUseCase()` que instancia o repositorio internamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
