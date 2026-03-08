---
name: 2023-criando-mappers-do-prisma
description: "Creates Prisma mapper classes with static toDomain and toPrisma methods to convert between persistence and domain layers in NestJS/DDD applications. Use when user asks to 'create a mapper', 'convert Prisma types to domain entities', 'map database records', or 'implement data mapping layer'. Enforces: one mapper per domain entity, static methods only, validate nullable FKs with throw, omit toPrisma when write is unnecessary. Make sure to use this skill whenever bridging Prisma database records with domain entities in clean architecture. Not for simple DTOs, API response formatting, or ORM-less applications."
category: coding-lens
tags: [attachments, entities, error-handling, migrations, nestjs, prisma]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: prisma-integration
  tags: [prisma, mappers, nestjs, domain-driven-design, entities, data-mapping]
---

# Criando Mappers do Prisma

> Mappers convertem entidades entre camadas de dominio e persistencia — cada mapper e uma classe estatica com metodos toDomain e toPrisma, nunca logica de negocio.

## Rules

1. **Um mapper por entidade de dominio** — `PrismaQuestionMapper`, `PrismaAnswerMapper`, etc., porque cada entidade pode ter mapeamento diferente mesmo usando a mesma tabela
2. **Metodos estaticos toDomain e toPrisma** — toDomain recebe o tipo Prisma e retorna entidade de dominio; toPrisma faz o inverso, porque mapper nao tem estado
3. **Entidades de dominio NAO espelham tabelas 1:1** — uma tabela `comment` pode gerar `QuestionComment` e `AnswerComment` como entidades separadas, porque dominio modela comportamento, banco modela armazenamento
4. **Valide foreign keys nulas com throw** — se o mapper de `AnswerComment` recebe um registro sem `answerId`, lance `throw new Error()` porque e um estado impossivel naquele contexto
5. **Omita toPrisma quando nao houver escrita** — se o repositorio so tem busca e delete, o mapper so precisa de toDomain, porque nao ha conversao dominio→persistencia necessaria
6. **updatedAt pode ser nulo** — sempre trate `updatedAt` como possivelmente nulo no toDomain, porque registros recem-criados podem nao ter sido atualizados

## How to write

### Mapper completo (entidade com escrita e leitura)

```typescript
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Prisma, Answer as PrismaAnswer } from '@prisma/client'

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        questionId: new UniqueEntityId(raw.questionId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      content: answer.content,
      authorId: answer.authorId.toString(),
      questionId: answer.questionId.toString(),
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
```

### Mapper com validacao de FK nula (tabela compartilhada)

```typescript
export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }

    return AnswerComment.create(
      {
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        answerId: new UniqueEntityId(raw.answerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(comment: AnswerComment): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      answerId: comment.answerId.toString(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
```

### Mapper somente leitura (sem toPrisma)

```typescript
export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type.')
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        questionId: new UniqueEntityId(raw.questionId),
      },
      new UniqueEntityId(raw.id),
    )
  }
}
```

## Example

**Before (mapper ingênuo sem validação):**
```typescript
export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    return AnswerComment.create({
      content: raw.content,
      answerId: new UniqueEntityId(raw.answerId), // pode ser null!
    }, new UniqueEntityId(raw.id))
  }
}
```

**After (com validação e tipos corretos):**
```typescript
export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.')
    }

    return AnswerComment.create({
      content: raw.content,
      authorId: new UniqueEntityId(raw.authorId),
      answerId: new UniqueEntityId(raw.answerId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityId(raw.id))
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tabela compartilhada por duas entidades (comment → QuestionComment/AnswerComment) | Crie dois mappers separados, cada um validando sua FK com throw |
| Entidade de relacionamento (attachment) sem metodo de create no repositorio | Crie apenas toDomain, omita toPrisma |
| Campo updatedAt no banco | Trate como possivelmente nulo no toDomain |
| UniqueEntityId de FK | Use `new UniqueEntityId(raw.foreignKeyId)` |
| Tipo de retorno do toPrisma | Use `Prisma.{Entity}UncheckedCreateInput` |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Mapper com estado/instancia | Metodos estaticos sempre |
| Ignorar FK nula em tabela compartilhada | `if (!raw.answerId) throw new Error(...)` |
| Criar toPrisma quando repositorio so tem busca | Apenas toDomain |
| Assumir 1 entidade = 1 tabela | Aceitar que dominio e banco sao independentes |
| `raw.answerId!` (non-null assertion) | Validacao explicita com throw |
| Logica de negocio dentro do mapper | Apenas conversao de dados |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
