---
name: rs-node-js-2023-delete-comment-use-case
description: "Applies DDD delete use case pattern with authorization check when writing Node.js domain logic. Use when user asks to 'delete entity', 'remove resource', 'create delete use case', 'implement soft delete', or any removal operation with ownership validation. Enforces author-only deletion, repository contract-first design, and proper error handling. Make sure to use this skill whenever implementing delete operations in clean architecture projects. Not for database queries, REST endpoints, or UI deletion confirmations."
---

# Caso de Uso: Delete com Validacao de Autoria

> Toda operacao de delecao em DDD comeca pelo contrato do repositorio, valida autoria antes de executar, e testa tanto o caminho feliz quanto o bloqueio de acesso.

## Rules

1. **Contrato primeiro, implementacao depois** — adicione `findById` e `delete` no repositorio abstrato antes de criar o use case, porque o dominio depende de contratos, nao de implementacoes
2. **Sempre valide existencia antes de deletar** — busque a entidade com `findById`, lance erro se nao encontrar, porque deletar algo inexistente e um bug silencioso
3. **Valide autoria no use case, nao no controller** — compare `entity.authorId` com o `authorId` recebido dentro do use case, porque regra de negocio pertence ao dominio
4. **Delete nao retorna dados** — o metodo execute de um delete use case retorna `void` ou `Either<Error, void>`, porque nao ha informacao util apos remocao
5. **Teste os dois caminhos** — teste o caminho feliz (deletou) E o caminho de erro (autor diferente rejeita), porque autorizacao sem teste e vulnerabilidade

## How to write

### Contrato do repositorio

```typescript
// Adicione findById e delete ao contrato abstrato
export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract delete(questionComment: QuestionComment): Promise<void>
  abstract create(questionComment: QuestionComment): Promise<void>
}
```

### Use case com validacao de autoria

```typescript
interface DeleteQuestionCommentUseCaseRequest {
  questionCommentId: string
  authorId: string
}

export class DeleteQuestionCommentUseCase {
  constructor(
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({ questionCommentId, authorId }: DeleteQuestionCommentUseCaseRequest) {
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      throw new Error('Question comment not found.')
    }

    if (questionComment.authorId.toString() !== authorId) {
      throw new Error('Not allowed.')
    }

    await this.questionCommentsRepository.delete(questionComment)
  }
}
```

### Teste: caminho feliz + bloqueio de autoria

```typescript
it('should be able to delete a question comment', async () => {
  const questionComment = makeQuestionComment()
  await inMemoryRepo.create(questionComment)

  await sut.execute({
    questionCommentId: questionComment.id.toString(),
    authorId: questionComment.authorId.toString(),
  })

  expect(inMemoryRepo.items).toHaveLength(0)
})

it('should not be able to delete another user question comment', async () => {
  const questionComment = makeQuestionComment({
    authorId: new UniqueEntityID('author-1'),
  })
  await inMemoryRepo.create(questionComment)

  await expect(
    sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    }),
  ).rejects.toThrow()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Deletar entidade com dono | Receba `authorId` no request e valide antes de deletar |
| Deletar entidade sem dono (admin) | Valide role/permission no use case |
| Repositorio in-memory para testes | Implemente `findById` com `.find()` e `delete` com `.splice()` |
| Factory de teste | Crie `makeEntityName` que aceita overrides parciais |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `repository.delete(id)` passando string | `repository.delete(entity)` passando a entidade inteira |
| Deletar sem verificar existencia | `findById` → validar → `delete` |
| Validar autoria no controller/route | Validar dentro do use case |
| Testar apenas o caminho feliz | Testar caminho feliz + tentativa de outro autor |
| Retornar a entidade deletada | Retornar `void` — nao ha uso para o retorno |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
