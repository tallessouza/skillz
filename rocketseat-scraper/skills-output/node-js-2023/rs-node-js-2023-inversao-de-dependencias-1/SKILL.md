---
name: rs-node-js-2023-inversao-de-dependencias
description: "Enforces Dependency Inversion Principle (DIP) when structuring use cases and repositories in Node.js/TypeScript. Use when user asks to 'create a use case', 'implement a service', 'refactor dependencies', 'apply SOLID', or 'decouple from database'. Applies constructor injection, removes direct instantiation of dependencies inside use cases, and ensures classes receive dependencies as parameters. Make sure to use this skill whenever creating use cases or service classes. Not for UI components, route definitions, or database schema design."
---

# Inversao de Dependencias (DIP)

> Use cases nunca instanciam suas dependencias — recebem por parametro do construtor.

## Rules

1. **Nunca instancie dependencias dentro do use case** — `new PrismaUsersRepository()` dentro do use case acopla a logica de negocio a uma ferramenta especifica, impossibilitando troca sem editar o use case
2. **Receba dependencias pelo construtor** — use constructor injection para que quem chama o use case decida qual implementacao passar, porque isso inverte o controle: o use case nao sabe qual repositorio concreto usa
3. **Use o hack do TypeScript para propriedades** — declare `private` no parametro do construtor para criar a propriedade automaticamente, porque elimina boilerplate de atribuicao manual
4. **Um metodo publico por use case** — `execute()` ou `handle()`, porque cada classe de use case representa uma unica operacao da aplicacao
5. **A instanciacao concreta fica no controller** — o controller (ou factory) e quem decide qual repositorio concreto criar e passar ao use case, porque e a camada que conhece a infraestrutura
6. **Nomes genericos no use case** — use `usersRepository` nao `prismaUsersRepository` dentro do use case, porque o use case nao deve saber da ferramenta

## How to write

### Use case com constructor injection

```typescript
export class RegisterUseCase {
  // private no parametro = propriedade automatica (hack TypeScript)
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error('E-mail already exists.')
    }

    await this.usersRepository.create({ name, email, password })
  }
}
```

### Controller instanciando e injetando

```typescript
export async function register(request: FastifyRequest, reply: FastifyReply) {
  // A dependencia concreta e decidida AQUI, nao no use case
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  await registerUseCase.execute({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password,
  })

  return reply.status(201).send()
}
```

### Trocar de repositorio = mudar UMA linha

```typescript
// Antes: Prisma
const usersRepository = new PrismaUsersRepository()

// Depois: InMemory (ou qualquer outro)
const usersRepository = new InMemoryUsersRepository()

// O use case NAO muda nada
const registerUseCase = new RegisterUseCase(usersRepository)
```

## Example

**Before (use case acoplado):**
```typescript
export async function registerUseCase({ name, email, password }) {
  const prismaUsersRepository = new PrismaUsersRepository()
  // Se trocar de banco, precisa editar TODOS os use cases
  await prismaUsersRepository.create({ name, email, password })
}
```

**After (com DIP aplicado):**
```typescript
export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    await this.usersRepository.create({ name, email, password })
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Use case precisa de repositorio | Receber via construtor, nunca instanciar |
| Trocar de banco/ORM/API | Mudar apenas no controller/factory, use case intocado |
| Testar use case | Passar InMemoryRepository no construtor |
| Parametro do construtor vira propriedade | Usar `private` na frente do parametro |
| Use case tem muitos metodos | Manter apenas `execute()` — um metodo por use case |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const repo = new PrismaUsersRepository()` dentro do use case | `constructor(private usersRepository: UsersRepository)` |
| `import { prisma } from '../lib/prisma'` no use case | Receber repositorio como dependencia |
| `registerUseCase(data, repository)` como funcao | `class RegisterUseCase` com construtor |
| `this.usersRepository = usersRepository` manual no construtor | `constructor(private usersRepository)` com keyword |
| Use case com multiplos metodos publicos | Um unico `execute()` ou `handle()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
