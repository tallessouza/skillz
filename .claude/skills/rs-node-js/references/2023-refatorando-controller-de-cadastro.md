---
name: rs-node-js-2023-refatorando-controller
description: "Enforces controller refactoring pattern in NestJS Clean Architecture: replace direct ORM/Prisma calls with domain use cases. Use when user asks to 'refactor controller', 'use clean architecture in NestJS', 'replace Prisma in controller', 'connect use case to controller', or 'wire up NestJS endpoint'. Make sure to use this skill whenever refactoring NestJS controllers to use domain layer. Not for creating use cases, domain entities, or Prisma schema changes."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: controller-refactoring-register
  tags: [nestjs, controller, clean-architecture, use-case, refactoring, prisma-removal, result-pattern]
---

# Refatorando Controllers para Clean Architecture (NestJS)

> Controllers delegam para use cases do dominio, nunca acessam ORM/repositorio diretamente.

## Rules

1. **Controller chama use case, nunca ORM** — `this.registerStudent.execute()` nao `this.prisma.user.create()`, porque o controller pertence a camada de infraestrutura e nao deve conhecer detalhes de persistencia
2. **Trate o Result pattern no controller** — verifique `result.isLeft()` para erros e `result.isRight()` para sucesso, porque use cases retornam Either/Result, nao lancam excecoes
3. **Injete o use case pelo constructor** — use o DI do NestJS para injetar o use case, nao o service do Prisma
4. **Nomes podem divergir** — controller `CreateAccountController` pode usar use case `RegisterStudent`, porque sao camadas diferentes com vocabularios diferentes
5. **Valide com testes E2E apos refatorar** — rode `pnpm run test:e2e` E `pnpm run test` para garantir que a integracao continua funcionando

## How to write

### Controller refatorado

```typescript
@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      throw new ConflictException()
    }
  }
}
```

### Padrao de remocao do Prisma direto

```typescript
// REMOVER: import e injecao do PrismaService
// REMOVER: chamadas this.prisma.*.create/find/update
// ADICIONAR: import e injecao do UseCase
// ADICIONAR: tratamento do Result (isLeft/isRight)
```

## Example

**Before (acoplado ao Prisma):**
```typescript
@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = body

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    })
  }
}
```

**After (delegando para use case):**
```typescript
@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      throw new ConflictException()
    }
  }
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Controller usa `this.prisma` diretamente | Refatorar para use case |
| Use case retorna Result/Either | Tratar `isLeft()` e `isRight()` no controller |
| Logica de negocio no controller (hash, validacao) | Mover para o use case |
| Nomes controller vs use case diferentes | OK, camadas diferentes |
| Apos refatorar | Rodar testes E2E + unitarios |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `this.prisma.user.create(...)` no controller | `this.registerStudent.execute(...)` |
| `await hash(password, 8)` no controller | Hash dentro do use case |
| `throw new Error()` sem checar Result | `if (result.isLeft()) throw new ConflictException()` |
| Importar PrismaService no controller refatorado | Importar o UseCase correspondente |

## Troubleshooting

### Controller refatorado retorna 500 em vez de 409 Conflict
**Symptom:** Ao cadastrar usuario duplicado, a API retorna Internal Server Error em vez de Conflict
**Cause:** O controller usa `throw new Error()` generico em vez de `throw new ConflictException()` ao tratar `result.isLeft()`
**Fix:** Importe `ConflictException` do `@nestjs/common` e use `throw new ConflictException()` no bloco `if (result.isLeft())`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
