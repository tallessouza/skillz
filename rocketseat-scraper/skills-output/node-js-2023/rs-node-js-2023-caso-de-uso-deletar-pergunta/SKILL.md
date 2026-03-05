---
name: rs-node-js-2023-deletar-pergunta
description: "Applies DDD delete use case pattern with authorization when writing Node.js domain logic. Use when user asks to 'delete an entity', 'remove a resource', 'create a delete use case', 'add permission check', or 'implement authorization in use case'. Enforces author-only deletion, repository method ordering, and proper error handling. Make sure to use this skill whenever implementing delete operations in domain-driven design. Not for HTTP/controller layer, database queries, or authentication (login/signup)."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
