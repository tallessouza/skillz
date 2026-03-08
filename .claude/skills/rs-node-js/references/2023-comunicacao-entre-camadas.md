---
name: rs-node-js-2023-comunicacao-entre-camadas
description: "Enforces NestJS dependency injection patterns between Clean Architecture layers when wiring controllers to domain use cases. Use when user asks to 'inject use case', 'wire controller to domain', 'configure providers', 'use abstract class instead of interface', or 'setup DI in NestJS'. Applies rules: @Injectable on use cases (trade-off), abstract classes over interfaces for DI tokens, provide/useClass pattern for repositories, register use cases in providers array. Make sure to use this skill whenever wiring NestJS controllers to domain use cases or configuring module providers. Not for general TypeScript patterns (use rs-clean-code), testing (use rs-testes-e), or non-NestJS DI frameworks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [nestjs, dependency-injection, clean-architecture, providers, abstract-class, injectable]
  mind-lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
---

# Comunicacao entre Camadas no NestJS

> Controllers dependem de use cases, use cases dependem de repositorios abstratos, e o modulo do NestJS resolve as dependencias concretas via providers.

## Rules

1. **Use `@Injectable()` nos use cases do dominio** — mesmo ferindo parcialmente a Clean Architecture, porque o decorator nao modifica comportamento da classe (testes unitarios continuam passando) e evita criar wrappers desnecessarios para cada use case
2. **Use abstract classes, nunca interfaces, para injecao de dependencia** — porque interfaces TypeScript sao eliminadas no build para JavaScript, e o container de DI do Nest executa em runtime (JavaScript), entao a referencia simplesmente nao existe
3. **Registre use cases nos `providers` do modulo** — porque o Nest so injeta classes que estao declaradas como providers no modulo
4. **Use `provide/useClass` para repositorios abstratos** — para mapear a classe abstrata do dominio para a implementacao concreta do Prisma
5. **Exporte a classe abstrata, nao a concreta** — no `exports` do database module, exporte `QuestionsRepository` (abstrato), nao `PrismaQuestionsRepository`
6. **Controllers nunca dependem do Prisma diretamente** — o controller chama o use case, o use case usa o repositorio abstrato, o Nest injeta a implementacao concreta

## How to write

### Repositorio abstrato (dominio)

```typescript
// Trocar interface por abstract class
export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>
  abstract findBySlug(slug: string): Promise<Question | null>
}
```

### Use case com @Injectable (dominio)

```typescript
import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ title, content, authorId }: CreateQuestionRequest) {
    const question = Question.create({ title, content, authorId })
    await this.questionsRepository.create(question)
    return { question }
  }
}
```

### Controller consumindo use case

```typescript
@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(@Body() body: CreateQuestionBody) {
    await this.createQuestion.execute({
      title: body.title,
      content: body.content,
      authorId: body.userId,
      attachmentsIds: [],
    })
  }
}
```

### Database module com provide/useClass

```typescript
@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,      // classe abstrata
      useClass: PrismaQuestionsRepository, // implementacao concreta
    },
  ],
  exports: [QuestionsRepository], // exporta o abstrato, nao o concreto
})
export class DatabaseModule {}
```

### HTTP module registrando use cases

```typescript
@Module({
  imports: [DatabaseModule],
  controllers: [CreateQuestionController],
  providers: [CreateQuestionUseCase], // use case precisa estar aqui
})
export class HttpModule {}
```

## Example

**Before (controller acoplado ao Prisma):**
```typescript
@Controller('/questions')
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body() body) {
    await this.prisma.question.create({ data: { ... } })
  }
}
```

**After (fluxo completo Clean Architecture):**
```typescript
// Controller -> UseCase -> Repository(abstract) -> PrismaRepository(concreto)
@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(@Body() body) {
    await this.createQuestion.execute({ title: body.title, content: body.content, authorId: body.userId, attachmentsIds: [] })
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Use case do dominio precisa de DI no Nest | Adicione `@Injectable()` direto no use case |
| Repositorio usado como dependencia | Declare como `abstract class`, nunca `interface` |
| Erro "can't resolve dependencies" | Verifique se o use case esta nos `providers` do modulo |
| Erro de dependencia de repositorio | Verifique se o database module usa `provide/useClass` e exporta a classe abstrata |
| Novo use case criado | Registre no `providers` do HTTP module |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `export interface QuestionsRepository` | `export abstract class QuestionsRepository` |
| `exports: [PrismaQuestionsRepository]` | `exports: [QuestionsRepository]` |
| `constructor(private prisma: PrismaService)` no controller | `constructor(private createQuestion: CreateQuestionUseCase)` |
| Criar `NestCreateQuestionUseCase extends CreateQuestionUseCase` wrapper | Colocar `@Injectable()` direto no use case (trade-off aceitavel) |
| Esquecer de registrar use case nos providers | Sempre adicionar use case em `providers: [CreateQuestionUseCase]` |

## Troubleshooting

### Erro "Nest can't resolve dependencies of CreateQuestionUseCase"
**Symptom:** Aplicacao nao inicia, erro de injecao de dependencia no console
**Cause:** O repositorio que o use case depende nao esta disponivel no modulo — pode faltar o DatabaseModule no imports ou o provide/useClass
**Fix:** Verificar que o DatabaseModule esta importado no HttpModule e usa `provide/useClass` para mapear a classe abstrata

### Interface desaparece no runtime
**Symptom:** Erro de tipo ou undefined ao tentar injetar repositorio declarado como interface
**Cause:** Interfaces TypeScript nao existem em JavaScript — sao eliminadas na compilacao
**Fix:** Trocar `interface` por `abstract class` em todos os repositorios usados como tokens de DI

### Provider nao encontrado apos mudar para provide/useClass
**Symptom:** Erro ao importar modulo — o export nao encontra o provider
**Cause:** O `exports` ainda referencia a classe concreta em vez da abstrata
**Fix:** Mudar exports para a classe abstrata: `exports: [QuestionsRepository]`

## Deep reference library

- [deep-explanation.md](../../../data/skills/node-js-2023/rs-node-js-2023-comunicacao-entre-camadas/references/deep-explanation.md) — Raciocinio completo do instrutor, analogias e edge cases
- [code-examples.md](../../../data/skills/node-js-2023/rs-node-js-2023-comunicacao-entre-camadas/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
