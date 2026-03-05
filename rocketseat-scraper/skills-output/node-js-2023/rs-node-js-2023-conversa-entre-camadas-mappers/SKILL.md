---
name: rs-node-js-2023-mappers
description: "Enforces mapper pattern between layers when writing NestJS/TypeScript code with Prisma or any ORM. Use when user asks to 'create a repository', 'fetch from database', 'convert entity', 'map between layers', or 'implement clean architecture persistence'. Applies rules: never return ORM objects directly, create static toDomain/toPrisma mappers, handle null vs undefined correctly, use ValueObject.create for existing values. Make sure to use this skill whenever implementing repository methods that bridge database and domain layers. Not for pure domain logic, DTOs for HTTP responses, or frontend mapping."
---

# Conversa entre Camadas (Mappers)

> Nunca retorne objetos do ORM diretamente — sempre converta entre representacoes de camadas usando mappers estaticos.

## Rules

1. **Nunca retorne entidades do ORM como entidades de dominio** — `Prisma.Question` nao e `Question` do dominio, porque cada camada tem sua propria representacao da mesma entidade
2. **Crie mappers como classes com metodos estaticos** — `PrismaQuestionMapper.toDomain(raw)`, porque nao precisa instanciar e deixa a conversao explicita
3. **Nomeie mappers pelo formato de origem** — `Prisma{Entity}Mapper`, porque indica de onde vem o dado
4. **Use `create` com ID existente para entidades ja persistidas** — `Question.create({...}, new UniqueEntityId(raw.id))`, porque nao estamos gerando novo ID, estamos criando referencia a entidade existente
5. **Use `ValueObject.create()` (nao `createFromText()`) para valores ja convertidos** — `Slug.create(raw.slug)`, porque o valor ja foi processado antes de salvar no banco
6. **Distinga null de undefined em campos opcionais** — `null` = valor vazio no banco, `undefined` = campo nunca informado (entidade nova), porque semanticamente sao coisas diferentes no JavaScript

## How to write

### Mapper class

```typescript
// src/infra/database/prisma/mappers/prisma-question-mapper.ts
import { Question as PrismaQuestion } from '@prisma/client'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityId(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }
}
```

### Uso no repositorio

```typescript
async findById(id: string): Promise<Question | null> {
  const question = await this.prisma.question.findUnique({
    where: { id },
  })

  if (!question) {
    return null
  }

  return PrismaQuestionMapper.toDomain(question)
}
```

## Example

**Before (retornando ORM diretamente — erro de tipo):**
```typescript
async findById(id: string): Promise<Question | null> {
  const question = await this.prisma.question.findUnique({
    where: { id },
  })
  // TypeError: Prisma.Question is not assignable to domain Question
  return question
}
```

**After (com mapper):**
```typescript
async findById(id: string): Promise<Question | null> {
  const question = await this.prisma.question.findUnique({
    where: { id },
  })

  if (!question) {
    return null
  }

  return PrismaQuestionMapper.toDomain(question)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Buscando do banco e retornando para dominio | Use `toDomain()` |
| Salvando entidade de dominio no banco | Crie `toPrisma()` no mesmo mapper |
| Campo e um ValueObject (Slug, Email) | Use `ValueObject.create()` (ja processado) |
| Campo e um ID de relacao | Envolva com `new UniqueEntityId(raw.field)` |
| Campo opcional pode vir null do banco | Trate com ternario: `raw.field ? convert(raw.field) : null` |
| Entidade ja existe no banco | Passe ID como segundo argumento do `create` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `return await this.prisma.question.findUnique(...)` | `return PrismaQuestionMapper.toDomain(question)` |
| `new UniqueEntityId()` para entidade existente | `new UniqueEntityId(raw.id)` com ID do banco |
| `Slug.createFromText(raw.slug)` para slug salvo | `Slug.create(raw.slug)` — ja foi convertido |
| `updatedAt?: Date` sem null | `updatedAt?: Date \| null` — banco retorna null, nao undefined |
| Logica de conversao inline no repositorio | Mapper class dedicada com metodos estaticos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
