---
name: rs-node-js-2023-comentario-resposta-autor
description: "Applies the pattern of reusing value objects across similar domain contexts when extending NestJS Clean Architecture features. Use when user asks to 'add author to comments', 'reuse value object', 'extend feature to similar entity', 'replicate functionality for answers', or 'apply same pattern to related entity'. Ensures consistent repository methods, mappers, presenters, and test patterns across question and answer domains. Make sure to use this skill whenever replicating an existing feature from one aggregate to a sibling aggregate. Not for creating new value objects from scratch or unrelated NestJS features."
---

# Replicar Funcionalidade Entre Agregados Irmãos

> Ao estender uma funcionalidade de um agregado para outro similar, reutilize value objects, mappers e presenters existentes — adapte apenas repositórios, casos de uso e testes.

## Rules

1. **Reutilize value objects entre agregados irmãos** — `CommentWithAuthor` serve para comentários de perguntas E respostas, porque a estrutura é idêntica e ambos usam a mesma tabela
2. **Reutilize mappers quando a tabela é a mesma** — comentários de pergunta e resposta usam a mesma tabela no Prisma, então o mesmo mapper funciona para ambos
3. **Reutilize presenters quando o formato de saída é idêntico** — `CommentWithAuthorPresenter` substitui `CommentPresenter` em ambos os controllers
4. **Adapte o repositório com método específico** — crie `findManyByAnswerId` espelhando `findManyByQuestionId`, porque cada agregado tem seu filtro próprio
5. **Mantenha consistência de dependências nos repositórios in-memory** — se `InMemoryQuestionCommentsRepository` recebe `StudentsRepository`, o `InMemoryAnswerCommentsRepository` também deve receber
6. **Testes devem ter autores reais** — quando o repositório depende de `StudentsRepository`, todo comentário no teste precisa de um `Student` criado previamente, porque senão o join falha

## How to write

### Caso de uso adaptado

```typescript
// fetch-answer-comments.ts
// Troque o tipo de retorno para o value object compartilhado
interface FetchAnswerCommentsResponse {
  comments: CommentWithAuthor[] // não Comment[]
}

// Use o novo método do repositório
const comments = await this.answerCommentsRepository
  .findManyByAnswerIdWithAuthor(answerId, { page })
```

### Repositório — novo método espelhado

```typescript
// answer-comments-repository.ts (interface)
abstract findManyByAnswerIdWithAuthor(
  answerId: string,
  params: PaginationParams,
): Promise<CommentWithAuthor[]>
```

### InMemory — dependência de StudentsRepository

```typescript
// in-memory-answer-comments-repository.ts
constructor(
  private studentsRepository: InMemoryStudentsRepository,
) {}

async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams) {
  const answerComments = this.items
    .filter((item) => item.answerId.toString() === answerId)
    .slice((page - 1) * 20, page * 20)

  const comments = answerComments.map((comment) => {
    const author = this.studentsRepository.items.find((student) =>
      student.id.equals(comment.authorId),
    )
    if (!author) throw new Error(`Author not found for comment ${comment.id}`)
    return CommentWithAuthor.create({
      commentId: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      author: author.name,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    })
  })

  return comments
}
```

## Example

**Before (comentários sem autor):**
```typescript
// caso de uso retorna Comment[]
const comments = await this.answerCommentsRepository.findManyByAnswerId(answerId)
return { comments }

// controller usa CommentPresenter
const comments = result.value.comments.map(CommentPresenter.toHTTP)
```

**After (comentários com autor, reutilizando value object):**
```typescript
// caso de uso retorna CommentWithAuthor[]
const comments = await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(answerId)
return { comments }

// controller usa CommentWithAuthorPresenter
const comments = result.value.comments.map(CommentWithAuthorPresenter.toHTTP)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Mesma tabela no banco para ambos os agregados | Reutilize mapper e presenter |
| Value object descreve estrutura idêntica | Reutilize — não crie duplicata |
| Repositório precisa de join com outra entidade | Injete dependência no constructor |
| Teste usa repositório com nova dependência | Crie entidade real (Student) antes dos comentários |
| Controller muda formato de retorno | Troque presenter, não crie novo endpoint |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| Criar `AnswerCommentWithAuthor` separado quando idêntico ao de Question | Reutilizar `CommentWithAuthor` |
| Criar mapper separado para mesma tabela | Reutilizar `CommentWithAuthorMapper` |
| Usar `Comment` no retorno quando autor é necessário | Usar `CommentWithAuthor` |
| Criar comentários no teste sem Student associado | Criar Student primeiro, passar `authorId` |
| Duplicar presenter com mesma estrutura | Reutilizar `CommentWithAuthorPresenter` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
