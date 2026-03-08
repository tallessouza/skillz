---
name: rs-node-js-2023-caso-uso-envio-notificacao
description: "Generates notification use case with repository, in-memory implementation, and unit test following DDD Clean Domain patterns. Use when user asks to 'create a use case', 'send notification', 'create notification service', 'implement notification feature', or 'add domain use case'. Follows pattern: interface repository, in-memory test repo, use case class with execute method, spec file. Make sure to use this skill whenever creating new use cases in a DDD/Clean Architecture Node.js project. Not for HTTP controllers, database ORMs, or UI notification components."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: use-cases
  tags: [notification, send, ddd, clean-architecture, repository-pattern, in-memory, unit-test]
---

# Caso de Uso: Envio de Notificacao

> Ao criar um caso de uso em DDD, siga o padrao: interface do repositorio, implementacao in-memory para testes, classe do caso de uso com execute, e teste unitario.

## Rules

1. **Reuse estrutura de casos de uso existentes** — copie um caso de uso similar e adapte, porque garante consistencia de patterns no projeto
2. **Repositorio e uma interface (contrato)** — `export interface NotificationsRepository` com metodos tipados, porque desacopla do banco real
3. **In-memory repository para testes** — implemente a interface com array em memoria, porque testes devem ser rapidos e sem dependencias externas
4. **Use case recebe dependencias no construtor** — injecao de dependencia via constructor, porque permite trocar implementacoes facilmente
5. **Teste valida persistencia** — apos executar o use case, verifique que o item existe no repositorio in-memory, porque confirma o comportamento sem banco
6. **Cuidado com classes globais** — `Notification` existe no JavaScript global; sempre importe explicitamente a classe do dominio

## How to write

### Interface do Repositorio

```typescript
// src/domain/notification/application/repositories/notifications-repository.ts
import { Notification } from '../../enterprise/entities/notification'

export interface NotificationsRepository {
  create(notification: Notification): Promise<void>
}
```

### Caso de Uso

```typescript
// src/domain/notification/application/use-cases/send-notification.ts
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

interface SendNotificationRequest {
  recipientId: string
  title: string
  content: string
}

interface SendNotificationResponse {
  notification: Notification
}

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

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

    return { notification }
  }
}
```

### In-Memory Repository

```typescript
// test/repositories/in-memory-notifications-repository.ts
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }
}
```

### Teste Unitario

```typescript
// src/domain/notification/application/use-cases/send-notification.spec.ts
import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

let notificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(notificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova notificacao',
      content: 'Conteudo da notificacao',
    })

    expect(result.isRight()).toBe(true)
    expect(notificationsRepository.items[0]).toEqual(result.value?.notification)
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo subdominio (ex: notification) | Crie estrutura completa: entity, repository interface, use case, in-memory repo, spec |
| Caso de uso similar ja existe | Copie e adapte — troque nomes preservando case (authorId → recipientId) |
| Propriedade nao se aplica ao novo dominio | Remova completamente (ex: attachments nao existe em notification) |
| Classe com nome global (Notification, Event) | Importe explicitamente do dominio, nunca dependa do global |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Testar com banco real no unitario | Use in-memory repository com array |
| Criar use case sem interface de repositorio | Sempre defina a interface primeiro |
| Copiar use case e esquecer de trocar nomes | Use find-and-replace com preserveCase |
| Deixar imports de outro dominio no arquivo | Remova tudo que nao pertence ao novo contexto |
| Instanciar repositorio dentro do use case | Injete via construtor |

## Troubleshooting

### Use case lanca erro inesperado
**Symptom:** Teste falha com erro nao tratado no use case
**Cause:** Entidade dependente nao foi criada no repositorio in-memory antes de executar
**Fix:** Pre-seed o repositorio com todas as entidades necessarias usando factories antes de chamar `sut.execute()`

### Comparacao de ID falha silenciosamente
**Symptom:** `authorId !== entity.authorId` sempre retorna true mesmo com IDs corretos
**Cause:** `entity.authorId` e um UniqueEntityID, nao uma string
**Fix:** Use `.toString()` na comparacao: `entity.authorId.toString() !== authorId`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-envio-de-notificacao/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-envio-de-notificacao/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
