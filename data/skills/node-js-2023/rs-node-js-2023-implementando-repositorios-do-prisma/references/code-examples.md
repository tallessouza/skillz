# Code Examples: Implementando Repositorios do Prisma

## Exemplo completo de repositorio Prisma

```typescript
// src/infra/database/prisma/repositories/prisma-questions-repository.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Question | null> {
    throw new Error('Method not implemented.')
  }

  async findBySlug(slug: string): Promise<Question | null> {
    throw new Error('Method not implemented.')
  }

  async findManyRecent(params: { page: number }): Promise<Question[]> {
    throw new Error('Method not implemented.')
  }

  async create(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async save(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async delete(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
```

## Database Module completo

```typescript
// src/infra/database/database.module.ts
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'

@Module({
  providers: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    PrismaQuestionsRepository,
    PrismaAnswersRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}
```

## HTTP Module consumindo DatabaseModule

```typescript
// src/infra/http/http.module.ts
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionController } from './controllers/create-question.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateQuestionController],
})
export class HttpModule {}
```

## Contrato do dominio (para referencia)

```typescript
// src/domain/forum/application/repositories/questions-repository.ts
import { Question } from '../../enterprise/entities/question'

export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findManyRecent(params: { page: number }): Promise<Question[]>
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
}
```

## Comparacao: In-Memory vs Prisma

```typescript
// test/repositories/in-memory-questions-repository.ts (testes)
export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  async findById(id: string) {
    return this.items.find(item => item.id.toString() === id) ?? null
  }

  async create(question: Question) {
    this.items.push(question)
  }
  // ...
}

// src/infra/database/prisma/repositories/prisma-questions-repository.ts (producao)
@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const question = await this.prisma.question.findUnique({ where: { id } })
    // mapear para entidade do dominio...
  }

  async create(question: Question) {
    await this.prisma.question.create({ data: /* mapper */ })
  }
  // ...
}
```

## Todos os repositorios seguem o mesmo padrao

```typescript
// Padrao repetido para cada entidade:
@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  // implementar metodos do contrato
}

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  // implementar metodos do contrato
}

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  // implementar metodos do contrato
}

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  // implementar metodos do contrato
}

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  // implementar metodos do contrato
}
```