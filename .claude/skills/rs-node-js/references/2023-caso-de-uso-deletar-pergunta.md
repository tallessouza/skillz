---
name: rs-node-js-2023-deletar-pergunta
description: "Applies DDD delete use case pattern with authorization when writing Node.js domain logic. Use when user asks to 'delete an entity', 'remove a resource', 'create a delete use case', 'add permission check', or 'implement authorization in use case'. Enforces author-only deletion, repository method ordering, and proper error handling. Make sure to use this skill whenever implementing delete operations in domain-driven design. Not for HTTP/controller layer, database queries, or authentication (login/signup)."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-use-cases
  tags: [ddd, delete, use-case, authorization, repository, clean-architecture, ownership]
---

# Caso de Uso: Deletar Entidade com Autorização

> Toda operação de deleção em DDD valida existência da entidade e permissão do autor antes de executar.

## Rules

1. **Receba authorId junto com entityId** — porque deleção sem verificação de autoria é falha de segurança por design
2. **Busque a entidade antes de deletar** — `findById` antes de `delete`, porque precisa validar existência e comparar autoria
3. **Compare authorId com toString()** — UniqueEntityId não compara direto com string, use `.toString()` para igualdade
4. **Retorne erro específico ao invés de silenciar** — `throw new Error('Not allowed')` quando autor não bate, porque falhas silenciosas escondem bugs
5. **Repository recebe a entidade, não o id** — `delete(question)` não `delete(questionId)`, porque o domínio trabalha com objetos ricos
6. **Retorno vazio como objeto** — `return {}` mesmo sem dados, porque mantém consistência com outros use cases e permite extensão futura

## How to write

### Use Case de Deleção

```typescript
interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

interface DeleteQuestionUseCaseResponse {}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Not allowed.')
    }

    await this.questionsRepository.delete(question)

    return {}
  }
}
```

### Repository com findById e delete

```typescript
export interface QuestionsRepository {
  findBySlug(slug: string): Promise<Question | null>
  findById(id: string): Promise<Question | null>
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
}
```

### InMemory delete e findById

```typescript
async findById(id: string) {
  const question = this.items.find(
    (item) => item.id.toString() === id,
  )
  return question ?? null
}

async delete(question: Question) {
  const itemIndex = this.items.findIndex(
    (item) => item.id === question.id,
  )
  this.items.splice(itemIndex, 1)
}
```

## Example

**Teste: autor pode deletar sua pergunta:**
```typescript
it('should be able to delete a question', async () => {
  const newQuestion = makeQuestion(
    { authorId: new UniqueEntityId('author-1') },
    new UniqueEntityId('question-1'),
  )

  await inMemoryRepo.create(newQuestion)

  await sut.execute({
    questionId: 'question-1',
    authorId: 'author-1',
  })

  expect(inMemoryRepo.items).toHaveLength(0)
})
```

**Teste: autor diferente é rejeitado:**
```typescript
it('should not be able to delete a question from another user', async () => {
  const newQuestion = makeQuestion(
    { authorId: new UniqueEntityId('author-1') },
    new UniqueEntityId('question-1'),
  )

  await inMemoryRepo.create(newQuestion)

  await expect(
    sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
    }),
  ).rejects.toBeInstanceOf(Error)
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Qualquer deleção de entidade com dono | Receba authorId e valide antes de deletar |
| Entidade não encontrada | Throw error antes de qualquer outra validação |
| Comparação de UniqueEntityId com string | Use `.toString()` no UniqueEntityId |
| InMemory delete | Use `findIndex` + `splice(index, 1)` |
| Retorno de use case sem dados | `return {}` — objeto vazio, não void |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `delete(questionId: string)` no repo | `delete(question: Question)` — entidade inteira |
| `if (authorId !== question.authorId)` | `if (authorId !== question.authorId.toString())` |
| Deletar sem buscar antes | `findById` → validar → `delete` |
| Retornar silenciosamente quando não permitido | `throw new Error('Not allowed.')` |
| `this.items = this.items.filter(...)` | `splice(index, 1)` — mutação in-place no InMemory |

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

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-deletar-pergunta/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-deletar-pergunta/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
