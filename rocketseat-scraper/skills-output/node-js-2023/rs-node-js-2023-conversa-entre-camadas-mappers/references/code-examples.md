# Code Examples: Conversa entre Camadas (Mappers)

## Exemplo completo do PrismaQuestionMapper

```typescript
// src/infra/database/prisma/mappers/prisma-question-mapper.ts
import { Question as PrismaQuestion } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
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

## Repositorio usando o mapper

```typescript
// src/infra/database/prisma/repositories/prisma-questions-repository.ts
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }
}
```

## Tipagem do updatedAt com tres estados

```typescript
// Na entidade Question (dominio)
interface QuestionProps {
  title: string
  content: string
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId | null
  slug: Slug
  createdAt: Date
  updatedAt?: Date | null  // Date = preenchido, null = vazio no banco, undefined = nunca definido
}
```

## Padrao para campos opcionais com UniqueEntityId

```typescript
// Campo opcional que e ID de relacao
bestAnswerId: raw.bestAnswerId
  ? new UniqueEntityId(raw.bestAnswerId)
  : null,
```

## Variacao: mapper toPrisma (direcao inversa)

```typescript
// Quando precisar salvar entidade de dominio no banco
export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    // ... como mostrado acima
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
```

## Padrao aplicado a outra entidade (Answer)

```typescript
export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        content: raw.content,
        questionId: new UniqueEntityId(raw.questionId),
        authorId: new UniqueEntityId(raw.authorId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }
}
```