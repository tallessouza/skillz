---
name: rs-node-js-2023-prisma-comment-with-author
description: "Applies the shared mapper pattern when Prisma queries use include/eager loading to return related data. Use when user asks to 'return comments with author', 'include related data', 'create a mapper for relationships', 'eager loading in Prisma', or 'map Prisma includes to domain entities'. Ensures correct typing with intersection types and reusable mappers across similar entities. Make sure to use this skill whenever mapping Prisma results that include relationships to domain value objects. Not for basic Prisma CRUD without relationships, nor for schema/migration changes."
---

# Prisma Mapper para Relacionamentos (Comment With Author)

> Quando uma query Prisma usa `include` para trazer relacionamentos, crie um mapper compartilhado com tipo intersecao que mapeia para o value object de dominio.

## Rules

1. **Crie um mapper separado para entidades com relacionamento** — nao adicione um metodo extra no mapper existente, porque o mapper com autor sera reaproveitado entre entidades similares (comentarios de perguntas E respostas)
2. **Nomeie sem prefixo de entidade pai** — `PrismaCommentWithAuthorMapper` e nao `PrismaQuestionCommentWithAuthorMapper`, porque o mesmo mapper serve para comentarios de perguntas e respostas
3. **Tipe o raw com intersecao** — combine o tipo Prisma base com o objeto do relacionamento usando `&`, porque o `include` do Prisma retorna exatamente essa estrutura
4. **Use `include` para Eager Loading** — no `findMany` do Prisma, use `include: { author: true }` para trazer dados do relacionamento numa unica query
5. **Mapeie para o value object de dominio** — o mapper deve retornar `CommentWithAuthor.create()`, nao a entidade Comment simples, porque o dominio espera dados do autor junto

## How to write

### Tipo de intersecao para Prisma com relacionamento

```typescript
import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}
```

### Mapper compartilhado

```typescript
export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
```

### Repositorio usando include + mapper

```typescript
async findManyByQuestionIdWithAuthor(questionId: string) {
  const questionComments = await this.prisma.comment.findMany({
    where: { questionId },
    include: { author: true },
  })

  return questionComments.map(PrismaCommentWithAuthorMapper.toDomain)
}
```

## Example

**Before (mapper sem relacionamento):**
```typescript
// PrismaQuestionCommentMapper — so mapeia Comment basico
export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    return QuestionComment.create({
      content: raw.content,
      questionId: new UniqueEntityId(raw.questionId),
      authorId: new UniqueEntityId(raw.authorId),
      createdAt: raw.createdAt,
    }, new UniqueEntityId(raw.id))
  }
}

// Repositorio retorna sem dados do autor
async findManyByQuestionId(questionId: string) {
  const comments = await this.prisma.comment.findMany({
    where: { questionId },
  })
  return comments.map(PrismaQuestionCommentMapper.toDomain)
}
```

**After (mapper compartilhado com autor):**
```typescript
// PrismaCommentWithAuthorMapper — reusavel para question e answer comments
type PrismaCommentWithAuthor = PrismaComment & { author: PrismaUser }

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}

// Repositorio usa include e novo mapper
async findManyByQuestionIdWithAuthor(questionId: string) {
  const comments = await this.prisma.comment.findMany({
    where: { questionId },
    include: { author: true },
  })
  return comments.map(PrismaCommentWithAuthorMapper.toDomain)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Query precisa de dados de relacionamento | Use `include` + mapper dedicado |
| Mesmo relacionamento usado em 2+ entidades | Mapper compartilhado sem prefixo de entidade pai |
| Mapper existente nao tem dados do relacionamento | Crie novo mapper, nao modifique o existente |
| Controller/Presenter precisa dos dados extras | Ajuste presenter para incluir campos do autor |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Adicionar metodo `toDomainWithAuthor` no mapper existente | Criar mapper separado `PrismaCommentWithAuthorMapper` |
| `PrismaQuestionCommentWithAuthorMapper` | `PrismaCommentWithAuthorMapper` (sem prefixo de entidade pai) |
| Tipar raw como `any` | Usar tipo intersecao `PrismaComment & { author: PrismaUser }` |
| Fazer query separada para buscar o autor | Usar `include: { author: true }` no findMany |
| Retornar `Comment` quando precisa do autor | Retornar `CommentWithAuthor` (value object de dominio) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-prisma-comentario-com-autor/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-prisma-comentario-com-autor/references/code-examples.md)
