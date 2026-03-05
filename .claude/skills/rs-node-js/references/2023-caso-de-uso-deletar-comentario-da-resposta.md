---
name: rs-node-js-2023-deletar-comentario-resposta
description: "Applies DDD copy-and-adapt pattern when creating symmetric use cases like delete-answer-comment from delete-question-comment. Use when user asks to 'create a similar use case', 'implement delete for answers', 'duplicate this for another entity', or 'create the answer version'. Ensures repository interface, factory, use case, and test are all created together with consistent naming. Make sure to use this skill whenever building parallel CRUD operations for sibling entities in DDD. Not for creating entirely new use cases from scratch or refactoring existing ones."
---

# Caso de Uso: Deletar Comentario da Resposta (Padrao Copy-and-Adapt em DDD)

> Quando duas entidades sao simetricas (QuestionComment / AnswerComment), crie o segundo caso de uso copiando o primeiro e substituindo o nome da entidade, garantindo que repositorio, factory, use case e teste sejam criados juntos.

## Rules

1. **Sempre crie os 4 artefatos juntos** — repository interface, factory, use case e spec, porque um sem o outro deixa o dominio incompleto
2. **Use find-and-replace sistematico** — substitua `question` por `answer` (ou vice-versa) em todo o arquivo copiado, porque erros de naming parcial quebram imports e tipos
3. **Mantenha a regra de negocio identica** — se delete-question-comment verifica autoria, delete-answer-comment tambem verifica, porque sao invariantes do dominio, nao da entidade
4. **Nao tente abstrair prematuramente** — dois use cases semelhantes NAO justificam um use case generico, porque a repeticao no inicio do projeto e natural e desaparece na manutencao
5. **Rode os testes apos cada copia** — `npm run test` imediatamente apos criar os artefatos, porque o replace pode ter deixado algum nome inconsistente

## How to write

### Repository Interface (adicionar metodos)

```typescript
// answer-comments-repository.ts
export interface AnswerCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>
  delete(answerComment: AnswerComment): Promise<void>
  // ... outros metodos
}
```

### Use Case

```typescript
// delete-answer-comment.ts
export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({ answerCommentId, authorId }: DeleteAnswerCommentUseCaseRequest) {
    const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      throw new Error('Answer comment not found.')
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new Error('Not allowed.')
    }

    await this.answerCommentsRepository.delete(answerComment)
  }
}
```

### Teste

```typescript
// delete-answer-comment.spec.ts
it('should be able to delete an answer comment', async () => {
  const answerComment = makeAnswerComment()
  await inMemoryAnswerCommentsRepository.create(answerComment)

  await sut.execute({
    answerCommentId: answerComment.id.toString(),
    authorId: answerComment.authorId.toString(),
  })

  expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
})

it('should not be able to delete another user answer comment', async () => {
  const answerComment = makeAnswerComment({
    authorId: new UniqueEntityID('author-1'),
  })
  await inMemoryAnswerCommentsRepository.create(answerComment)

  await expect(
    sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: 'author-2',
    }),
  ).rejects.toBeInstanceOf(Error)
})
```

## Example

**Antes (so tem QuestionComment):**
```
use-cases/
  delete-question-comment.ts
  delete-question-comment.spec.ts
repositories/
  question-comments-repository.ts
factories/
  make-question-comment.ts
```

**Depois (AnswerComment criado por copy-and-adapt):**
```
use-cases/
  delete-question-comment.ts
  delete-question-comment.spec.ts
  delete-answer-comment.ts        ← copiado + replace
  delete-answer-comment.spec.ts   ← copiado + replace
repositories/
  question-comments-repository.ts
  answer-comments-repository.ts   ← adicionado findById + delete
factories/
  make-question-comment.ts
  make-answer-comment.ts          ← copiado + replace
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Duas entidades com CRUD identico | Copy-and-replace, nao abstraia |
| Regra de negocio difere entre entidades | Crie do zero, nao copie |
| Terceira entidade com mesmo padrao | Ainda copie; abstraia so se tiver 4+ |
| Inicio do projeto com muitas entidades | Aceite a repeticao, ela e temporaria |
| Projeto em manutencao | Ajuste o existente, raramente crie novos use cases |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Criar use case generico `DeleteCommentUseCase` para Question e Answer | Manter `DeleteQuestionComment` e `DeleteAnswerComment` separados |
| Copiar arquivo e esquecer de trocar um nome | Usar find-and-replace global no arquivo inteiro |
| Criar use case sem o teste correspondente | Sempre criar use case + spec juntos |
| Criar use case sem adicionar metodos no repository | Adicionar `findById` e `delete` no repository interface primeiro |
| Criar snippets/generators para algo que so acontece no inicio | Aceitar o processo manual, ele e temporario |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-deletar-comentario-da-resposta/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-caso-de-uso-deletar-comentario-da-resposta/references/code-examples.md)
