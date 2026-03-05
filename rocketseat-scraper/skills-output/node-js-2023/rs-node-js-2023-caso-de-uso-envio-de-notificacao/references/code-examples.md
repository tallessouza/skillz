# Code Examples: Caso de Uso — Envio de Notificacao

## Exemplo completo do fluxo de criacao

### 1. Interface do repositorio (contrato)

```typescript
// src/domain/notification/application/repositories/notifications-repository.ts
import { Notification } from '../../enterprise/entities/notification'

export interface NotificationsRepository {
  create(notification: Notification): Promise<void>
}
```

O repositorio comeca com um unico metodo `create`. Outros metodos (findById, findByRecipientId, save) serao adicionados conforme novos casos de uso surgirem.

### 2. Caso de uso sendNotification

```typescript
// src/domain/notification/application/use-cases/send-notification.ts
import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotificationsRepository } from '../repositories/notifications-repository'

interface SendNotificationRequest {
  recipientId: string
  title: string
  content: string
}

type SendNotificationResponse = Either<
  null,
  { notification: Notification }
>

export class SendNotificationUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationRequest): Promise<SendNotificationResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    })

    await this.notificationsRepository.create(notification)

    return right({ notification })
  }
}
```

### 3. In-memory repository para testes

```typescript
// test/repositories/in-memory-notifications-repository.ts
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }
}
```

**Pontos importantes:**
- `items` e publico para que o teste possa inspecionar diretamente
- Implementa a mesma interface do repositorio real
- Sem banco, sem I/O, sem setup — roda em milissegundos

### 4. Teste unitario

```typescript
// src/domain/notification/application/use-cases/send-notification.spec.ts
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova notificacao',
      content: 'Conteudo da notificacao',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
```

## Tecnica de adaptacao: Find and Replace com preserveCase

O fluxo do instrutor ao adaptar um use case existente:

```
1. Copiar conteudo de createQuestion.ts → sendNotification.ts
2. Find & Replace: "createQuestion" → "sendNotification" (preserveCase ON)
   - CreateQuestion → SendNotification
   - createQuestion → sendNotification
3. Find & Replace: "question" → "notification" (preserveCase ON)
   - Question → Notification
   - question → notification
   - QUESTION → NOTIFICATION
4. Renomear campos semanticos: "authorId" → "recipientId"
5. Remover campos que nao se aplicam: attachments (interface, constructor, expects)
6. Corrigir imports — remover os do dominio antigo, adicionar os do novo
7. Cuidado especial: Notification global do JS — forcar import explicito
```

## Estrutura de pastas resultante

```
src/domain/notification/
├── application/
│   ├── repositories/
│   │   └── notifications-repository.ts      # Interface
│   └── use-cases/
│       ├── send-notification.ts              # Use case
│       └── send-notification.spec.ts         # Teste
└── enterprise/
    └── entities/
        └── notification.ts                   # Entidade (ja existia)

test/repositories/
└── in-memory-notifications-repository.ts     # Fake para testes
```