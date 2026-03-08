---
name: rs-node-js-2023-buscar-pergunta-pelo-slug
description: "Applies the Get By Slug use case pattern when implementing DDD query use cases in Node.js/TypeScript. Use when user asks to 'create a use case', 'find by slug', 'get by slug', 'implement a query use case', or 'search by slug'. Enforces repository method creation, null handling with thrown errors, Value Object access patterns, and in-memory repository testing with pre-seeded data. Make sure to use this skill whenever building read/query use cases in Clean Architecture. Not for CRUD creation use cases, database queries, or REST endpoint implementation."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-use-cases
  tags: [ddd, use-case, slug, query, repository, value-object, clean-architecture]
---

# Caso de Uso: Buscar por Slug (Query Use Case Pattern)

> Ao implementar um caso de uso de busca, crie o metodo no repositorio, trate o caso nulo com erro explicito, e teste com dados pre-existentes no repositorio in-memory.

## Rules

1. **Crie o metodo no repositorio antes do use case** — `findBySlug(slug: string): Promise<Entity | null>`, porque o use case depende do contrato do repositorio
2. **Retorne null do repositorio quando nao encontrar** — nunca lance erro no repositorio, porque a decisao de erro pertence ao use case
3. **Lance erro no use case quando entidade nao existir** — `throw new Error('question not found')`, porque o use case decide a regra de negocio
4. **Acesse Value Objects pela propriedade .value** — `item.slug.value`, porque slug e um Value Object com encapsulamento
5. **Crie metodo estatico `create` no Value Object para valores ja formatados** — alem do `createFromText`, porque facilita testes com valores exatos
6. **Torne o constructor do Value Object privado** — force uso via metodos estaticos `create` e `createFromText`, porque garante consistencia

## How to write

### Repository interface

```typescript
// Adicione o metodo de busca ao repositorio existente
export interface QuestionsRepository {
  create(question: Question): Promise<void>
  findBySlug(slug: string): Promise<Question | null>
}
```

### Use case

```typescript
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({ slug }: { slug: string }) {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      throw new Error('Resource not found.')
    }

    return { question }
  }
}
```

### In-memory repository (metodo findBySlug)

```typescript
async findBySlug(slug: string): Promise<Question | null> {
  const question = this.items.find((item) => item.slug.value === slug)

  if (!question) {
    return null
  }

  return question
}
```

### Value Object com metodo create

```typescript
export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  static createFromText(text: string) {
    const slugValue = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugValue)
  }
}
```

## Example

**Before (teste sem dados pre-existentes — falha):**
```typescript
it('should get a question by slug', async () => {
  const result = await sut.execute({ slug: 'example-question' })
  // FALHA: nenhuma question existe no repositorio
})
```

**After (com pre-seed no repositorio):**
```typescript
it('should be able to get a question by slug', async () => {
  const newQuestion = makeQuestion({
    slug: Slug.create('example-question'),
  })

  await inMemoryQuestionsRepository.create(newQuestion)

  const result = await sut.execute({ slug: 'example-question' })

  expect(result.value.question.title).toEqual(newQuestion.title)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Use case de busca por campo unico | Crie `findByX` no repositorio retornando `Entity \| null` |
| Entidade nao encontrada | Lance erro no use case, retorne null no repositorio |
| Teste de busca | Pre-seed o repositorio in-memory com `repository.create()` antes de buscar |
| Value Object em comparacao | Acesse `.value` para comparar com primitivo |
| Slug exato em testes | Use `Slug.create('valor-exato')` em vez de `Slug.createFromText()` |
| Constructor de Value Object | Torne privado, exponha metodos estaticos |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `throw new Error()` dentro do repositorio | Retorne `null` do repositorio, lance erro no use case |
| `item.slug === slug` (comparar Value Object direto) | `item.slug.value === slug` |
| Testar busca sem criar dados antes | `repository.create(entity)` antes de chamar o use case |
| `new Slug('valor')` com constructor publico | `Slug.create('valor')` via metodo estatico |
| Retornar `undefined` do repositorio | Retorne `null` para padronizar |

## Troubleshooting

### Use case lanca erro inesperado
**Symptom:** Teste falha com erro nao tratado no use case
**Cause:** Entidade dependente nao foi criada no repositorio in-memory antes de executar
**Fix:** Pre-seed o repositorio com todas as entidades necessarias usando factories antes de chamar `sut.execute()`

### Comparacao de ID falha silenciosamente
**Symptom:** `authorId !== entity.authorId` sempre retorna true mesmo com IDs corretos
**Cause:** `entity.authorId` e um UniqueEntityID, nao uma string
**Fix:** Use `.toString()` na comparacao: `entity.authorId.toString() !== authorId`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-buscar-pergunta-pelo-slug/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-buscar-pergunta-pelo-slug/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
