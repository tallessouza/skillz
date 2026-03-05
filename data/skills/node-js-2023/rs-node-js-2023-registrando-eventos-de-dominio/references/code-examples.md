# Code Examples: Registrando Eventos de Domínio

## Estrutura de arquivos criados/modificados

```
src/infra/
├── events/
│   └── events.module.ts              # NOVO
├── database/
│   ├── database.module.ts            # MODIFICADO (add notification provider)
│   └── prisma/
│       ├── repositories/
│       │   └── prisma-notifications-repository.ts  # NOVO
│       └── mappers/
│           └── prisma-notification-mapper.ts        # NOVO
prisma/
└── schema.prisma                      # MODIFICADO (add Notification model)
src/domain/notification/application/
├── subscribers/
│   ├── on-answer-created.ts           # MODIFICADO (add @Injectable)
│   └── on-question-best-answer-chosen.ts  # MODIFICADO (add @Injectable)
└── use-cases/
    └── send-notification.ts           # MODIFICADO (add @Injectable)
```

## EventsModule completo

```typescript
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
```

## DatabaseModule com NotificationsRepository

```typescript
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
// ... outros imports

@Module({
  providers: [
    PrismaService,
    // ... outros providers
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    // ... outros exports
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
```

## AppModule com EventsModule

```typescript
import { Module } from '@nestjs/common'
import { EventsModule } from './events/events.module'
// ... outros imports

@Module({
  imports: [
    // ... outros módulos
    EventsModule,
  ],
})
export class AppModule {}
```

## Schema Prisma — Notification model

```prisma
model Notification {
  id          String    @id @default(uuid())
  recipientId String
  title       String
  content     String
  readAt      DateTime? @map("read_at")
  createdAt   DateTime  @default(now()) @map("created_at")

  recipient User @relation(fields: [recipientId], references: [id])

  @@map("notifications")
}

// No model User, adicionar:
model User {
  // ... campos existentes
  notifications Notification[]
}
```

## Mapper completo

```typescript
import { Notification as PrismaNotification, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityID(raw.recipientId),
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    }
  }
}
```

## Repositório Prisma completo

```typescript
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    })

    if (!notification) {
      return null
    }

    return PrismaNotificationMapper.toDomain(notification)
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.create({
      data,
    })
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.update({
      where: { id: data.id },
      data,
    })
  }
}
```

## Subscriber com @Injectable

```typescript
import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.execute.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  async execute({ answer }: AnswerCreatedEvent): Promise<void> {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
```

## Comando de migration

```bash
npx prisma migrate dev
# Nomear a migration como: create-notifications
```

## Restart do TS Server (VS Code)

Após alterar o schema.prisma e rodar migrate:
- `Cmd+Shift+P` → "TypeScript: Restart TS Server"
- Necessário porque o Prisma Client regenerado não é detectado automaticamente