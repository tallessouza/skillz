---
name: rs-node-js-2023-factories-de-testes
description: "Applies the Factory pattern to generate test entities when writing or refactoring tests in TypeScript/Node.js. Use when user asks to 'write tests', 'create test helpers', 'generate test data', 'add test coverage', or 'refactor test setup'. Generates makeEntity functions with Partial override support for flexible, DRY test creation. Make sure to use this skill whenever creating multiple test entities or reducing test boilerplate. Not for production code factories, database seeders, or fixture files for E2E tests."
---

# Factories de Testes

> Criar funcoes factory para cada entidade de dominio, com override parcial, eliminando duplicacao nos testes e permitindo cobertura massiva.

## Rules

1. **Uma factory por entidade** — `makeQuestion`, `makeAnswer`, `makeUser`, porque cada entidade tem props diferentes e a factory encapsula os defaults
2. **Receba `Partial<EntityProps>` como override** — porque permite sobrescrever apenas os campos relevantes ao teste, mantendo defaults para o resto
3. **Defaults devem ser valores validos mas genericos** — porque o teste so deve explicitar o que esta testando, nao preencher campos irrelevantes
4. **Spread override por ultimo** — `{ ...defaults, ...override }`, porque garante que valores passados pelo teste sempre vencem
5. **Exporte o tipo Props da entidade** — porque a factory precisa importar `EntityProps` para tipar o `Partial`
6. **Coloque factories em `test/factories/`** — `make-question.ts`, `make-answer.ts`, porque sao helpers de teste, nao codigo de producao

## How to write

### Factory basica com override

```typescript
// test/factories/make-question.ts
import { Question, QuestionProps } from '@/domain/forum/enterprise/entities/question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityID(),
      title: 'Example Question',
      slug: Slug.create('example-question'),
      content: 'Example content',
      ...override,
    },
    id,
  )

  return question
}
```

### Uso no teste — campo explicito

```typescript
it('should find question by slug', async () => {
  const newQuestion = makeQuestion({
    slug: Slug.create('example-question'),
  })

  await repository.create(newQuestion)

  const result = await sut.execute({ slug: 'example-question' })

  expect(result.value?.question.id).toEqual(newQuestion.id)
})
```

### Uso em massa — paginacao

```typescript
it('should paginate results', async () => {
  for (let i = 0; i < 22; i++) {
    await repository.create(makeQuestion())
  }

  const result = await sut.execute({ page: 2 })

  expect(result.value?.questions).toHaveLength(2)
})
```

## Example

**Before (duplicacao massiva):**
```typescript
const question1 = Question.create({
  authorId: new UniqueEntityID(),
  title: 'Question 1',
  slug: Slug.create('question-1'),
  content: 'Content 1',
})
const question2 = Question.create({
  authorId: new UniqueEntityID(),
  title: 'Question 2',
  slug: Slug.create('question-2'),
  content: 'Content 2',
})
// ... repete 20x para testar paginacao
```

**After (com factory):**
```typescript
for (let i = 0; i < 22; i++) {
  await repository.create(makeQuestion())
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Teste precisa de 1 entidade com campo especifico | `makeEntity({ campo: valor })` |
| Teste precisa de N entidades genericas | Loop com `makeEntity()` sem override |
| Entidade tem ID especifico necessario | Passe como segundo argumento `makeEntity({}, id)` |
| Campo e exatamente o que o teste valida | Sempre passe explicito no override, mesmo que o default funcione |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Copiar `Entity.create({...})` em cada teste | `makeEntity()` com factory |
| Defaults diferentes em cada arquivo de teste | Factory centralizada em `test/factories/` |
| Override com spread manual no teste | `makeEntity({ field: value })` |
| Factory sem tipar override | `override: Partial<EntityProps> = {}` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
