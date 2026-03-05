# Code Examples: Implementando QuestionsRepository

## Exemplo completo do mapper

```typescript
// src/infra/database/prisma/mappers/prisma-question-mapper.ts
import { Question as PrismaQuestion, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        slug: Slug.create(raw.slug),
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    question: Question,
  ): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
```

## Exemplo completo do repository

```typescript
// src/infra/database/prisma/repositories/prisma-questions-repository.ts
import { Injectable } from '@nestjs/common'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'

@Injectable()
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

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({
      data,
    })
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id: question.id.toString(),
      },
    })
  }
}
```

## Comparacao: InMemory vs Prisma Repository

```typescript
// InMemoryQuestionsRepository (testes)
async findManyRecent({ page }: PaginationParams) {
  const questions = this.items
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice((page - 1) * 20, page * 20)

  return questions
}

// PrismaQuestionsRepository (producao)
async findManyRecent({ page }: PaginationParams) {
  const questions = await this.prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    skip: (page - 1) * 20,
  })

  return questions.map(PrismaQuestionMapper.toDomain)
}
```

A mesma logica (ordenar por mais recente, paginar de 20 em 20), mas a versao Prisma delega ordenacao e paginacao para o banco e precisa do mapper para converter o resultado.

## Variacao: Answer repository segue o mesmo padrao

O instrutor menciona que apos implementar o QuestionsRepository, o AnswersRepository segue exatamente o mesmo processo — mapper bidirecional + CRUD com os mesmos patterns. Isso demonstra que o padrao e replicavel para qualquer entidade.