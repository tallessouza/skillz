---
name: rs-node-js-2023-ler-notificacao
description: "Enforces use case pattern for reading/marking entities when writing Node.js clean architecture code. Use when user asks to 'create a use case', 'mark as read', 'update entity status', 'implement read notification', or 'add findById and save to repository'. Applies rules: authorization check before mutation, domain method encapsulation over setters, repository findById+save pattern, factory-based testing. Make sure to use this skill whenever creating use cases that fetch-then-mutate an entity with ownership validation. Not for CRUD controllers, database queries, or frontend notification UI."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: use-cases
  tags: [read-notification, mark-as-read, domain-method, authorization, either-pattern, ddd]
---

# Caso de Uso: Ler/Atualizar Status de Entidade

> Ao criar um caso de uso que busca uma entidade e altera seu estado, encapsule a mutacao em um metodo de dominio e valide autorizacao antes de qualquer alteracao.

## Rules

1. **Repositorio precisa de findById + save** — alem de create, adicione `findById(id): Promise<Entity | null>` e `save(entity): Promise<void>`, porque casos de uso de leitura/atualizacao precisam buscar e persistir a entidade modificada
2. **Valide existencia antes de tudo** — se `findById` retorna null, lance `ResourceNotFoundError` imediatamente, porque evita operacoes em entidades inexistentes
3. **Valide autorizacao apos existencia** — compare `recipientId` (ou `authorId`) da entidade com o do request, lance `NotAllowedError` se diferente, porque um usuario nao pode modificar recursos de outro
4. **Encapsule mutacao em metodo de dominio** — crie `entity.read()` em vez de expor setter para `readAt`, porque a data de leitura e sempre `new Date()` e nunca deve ser escolhida externamente
5. **Erros genericos ficam no core** — `ResourceNotFoundError` e `NotAllowedError` sao reutilizaveis, mova para `@core/errors/`, porque multiplos subdominios precisam deles
6. **Teste com factory e dois cenarios** — cenario feliz (leitura com sucesso) + cenario de autorizacao (recipientId diferente), porque validacao de permissao e critica

## How to write

### Metodo de dominio (encapsulamento)

```typescript
// Na entidade — NAO exponha setter para readAt
read() {
  this.props.readAt = new Date()
}
```

### Caso de uso completo

```typescript
interface ReadNotificationRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationRequest): Promise<ReadNotificationResponse> {
    const notification = await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({ notification })
  }
}
```

### Repositorio InMemory (findById + save)

```typescript
async findById(id: string): Promise<Notification | null> {
  const notification = this.items.find((item) => item.id.toString() === id)
  return notification ?? null
}

async save(notification: Notification): Promise<void> {
  const itemIndex = this.items.findIndex((item) => item.id.equals(notification.id))
  this.items[itemIndex] = notification
}
```

## Example

**Before (expondo setter, sem validacao):**
```typescript
async execute({ notificationId }: Request) {
  const notification = await this.repo.findById(notificationId)
  notification.readAt = new Date() // setter direto — perigoso
  await this.repo.save(notification)
}
```

**After (com encapsulamento e validacao):**
```typescript
async execute({ recipientId, notificationId }: Request) {
  const notification = await this.repo.findById(notificationId)

  if (!notification) return left(new ResourceNotFoundError())
  if (notification.recipientId.toString() !== recipientId)
    return left(new NotAllowedError())

  notification.read() // metodo de dominio encapsulado
  await this.repo.save(notification)

  return right({ notification })
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Caso de uso que muda estado de entidade | Buscar → Validar existencia → Validar autorizacao → Mutar via metodo de dominio → Salvar |
| Propriedade que sempre recebe mesmo valor (ex: `new Date()`) | Criar metodo de dominio, nao setter |
| Erro reutilizavel entre subdominios | Mover para `@core/errors/` |
| Teste de caso de uso com autorizacao | Minimo 2 testes: sucesso + usuario errado |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `entity.readAt = new Date()` | `entity.read()` |
| Caso de uso sem checar `findById` null | `if (!entity) return left(new ResourceNotFoundError())` |
| Caso de uso sem checar dono do recurso | Compare `recipientId`/`authorId` antes de mutar |
| Erros duplicados em cada subdominio | Erros genericos em `@core/errors/` |
| Teste apenas do cenario feliz | Teste cenario feliz + cenario de autorizacao negada |

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

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-ler-notificacao/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-caso-de-uso-ler-notificacao/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
