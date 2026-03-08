---
name: rs-node-js-2023-registrando-eventos-de-dominio
description: "Applies domain event registration patterns when wiring NestJS modules with clean architecture subdomains. Use when user asks to 'create event module', 'connect domain events', 'wire subscribers in NestJS', 'register domain notifications', or 'create Prisma repository for notifications'. Follows pattern: create module, add @Injectable to subscribers/use-cases, import DatabaseModule, register in AppModule. Make sure to use this skill whenever connecting domain event subscribers to NestJS infrastructure layer. Not for creating the domain events themselves, nor for HTTP controllers or authentication setup."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: domain-events-nestjs
  tags: [domain-events, nestjs, subscribers, events-module, injectable, notifications, prisma-mapper]
---

# Registrando Eventos de Domínio no NestJS

> Conecte subscribers de domínio à camada de infraestrutura criando um EventsModule dedicado com providers injetáveis e repositórios Prisma.

## Prerequisites

- Arquitetura Clean com subdomínios separados (ex: forum + notification)
- Subscribers de domínio já criados na camada de domínio (ex: `OnAnswerCreated`, `OnQuestionBestAnswerChosen`)
- Use cases de domínio existentes (ex: `SendNotificationUseCase`)
- DatabaseModule com repositórios exportados
- Schema Prisma configurado

## Steps

### Step 1: Criar o EventsModule

Criar `src/infra/events/events.module.ts` — separado da camada HTTP porque eventos são comunicação entre subdomínios, não endpoints.

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

### Step 2: Adicionar @Injectable nos subscribers e use cases

Subscribers e use cases de domínio que têm dependências precisam do decorator `@Injectable()` do NestJS, porque funcionam de forma semelhante a use cases — recebem dependências via construtor.

```typescript
// on-answer-created.ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {}
}

// send-notification.ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
  ) {}
}
```

### Step 3: Criar o repositório Prisma de notificações

Criar `src/infra/database/prisma/repositories/prisma-notifications-repository.ts` com apenas os métodos necessários: `findById`, `create`, `save`.

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
    if (!notification) return null
    return PrismaNotificationMapper.toDomain(notification)
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)
    await this.prisma.notification.create({ data })
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

### Step 4: Criar o schema Prisma da notificação

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
```

Rodar `npx prisma migrate dev` e reiniciar o TS server após alterações no schema.

### Step 5: Criar o mapper

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

  static toPrisma(notification: Notification): Prisma.NotificationUncheckedCreateInput {
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

### Step 6: Registrar no DatabaseModule e AppModule

```typescript
// database.module.ts — adicionar nos providers e exports
{
  provide: NotificationsRepository,
  useClass: PrismaNotificationsRepository,
}

// app.module.ts — adicionar nos imports
imports: [/* ...existing */, EventsModule],
```

## Heuristics

| Situação | Ação |
|----------|------|
| Repositório de interface usa `interface` | Converter para `abstract class` porque NestJS remove interfaces em runtime |
| Subscriber precisa de repositório de outro módulo | Importar o DatabaseModule, não re-registrar o provider |
| Schema Prisma alterado | Rodar migrate + reiniciar TS server |
| Evento conecta dois subdomínios | Criar módulo separado (events), não colocar no HTTP module |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Registrar repositórios duplicados no EventsModule | Importar DatabaseModule que já exporta os repositórios |
| Colocar subscribers dentro do módulo HTTP | Criar EventsModule dedicado — eventos não são HTTP |
| Esquecer `@Injectable()` nos subscribers | Adicionar decorator em todo subscriber/use-case com dependências |
| Usar `interface` para repositórios no NestJS | Usar `abstract class` — interfaces são removidas em runtime |

## Verification

- Aplicação inicia sem erros de dependência não encontrada
- Todos os providers do EventsModule resolvem suas dependências
- Migration criada e aplicada com sucesso

## Troubleshooting

### NestJS nao dispara eventos de dominio ao salvar entidade
**Symptom:** O subscriber `OnAnswerCreated` nunca e chamado quando uma resposta e criada
**Cause:** O `EventsModule` nao foi importado no `AppModule`, ou o subscriber nao tem `@Injectable()` e nao foi registrado como provider
**Fix:** Adicione `EventsModule` nos imports do `AppModule` e verifique que todos os subscribers e use cases no EventsModule tem `@Injectable()` e estao listados em `providers`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
