---
name: rs-node-js-2023-entidade-de-notificacao
description: "Enforces DDD subdomain entity creation patterns when writing Node.js/TypeScript domain entities. Use when user asks to 'create an entity', 'add a new subdomain', 'implement domain model', 'create notification entity', or any DDD bounded context work. Applies rules: mirror folder structure per subdomain, use domain-specific terminology (never generic 'user'), static create with defaults, optional read timestamps. Make sure to use this skill whenever creating entities in a DDD architecture. Not for API controllers, database schemas, or infrastructure layer code."
---

# Entidade em Novo Subdominio (DDD)

> Cada subdominio replica sua propria estrutura de pastas e usa terminologia especifica do contexto, nunca termos genericos.

## Rules

1. **Replique a estrutura de pastas por subdominio** — cada subdominio tem sua propria `enterprise/entities/`, `application/use-cases/`, `application/repositories/`, porque subdominos existem de forma independente
2. **Use terminologia do dominio, nunca termos genericos** — `recipientId` nao `userId`, `client` nao `user`, porque no contexto real ninguem diz "usuario" — existe cliente, barbeiro, fornecedor, recipiente
3. **Entidade estende classe base Entity** — com tipagem via interface de props e UniqueEntityId para relacionamentos
4. **Static create com defaults** — `createdAt` gerado internamente se nao fornecido, `id` opcional para referenciar entidades existentes
5. **Timestamps de leitura sao opcionais** — `readAt?: Date | null` porque a notificacao pode nunca ser lida
6. **Desenvolva o subdominio como se os outros nao existissem** — nao importe nada do forum ao criar notificacoes, porque a integracao vem depois via Domain Events

## How to write

### Estrutura de pastas do subdominio

```
domain/
├── forum/              # subdominio existente
│   ├── application/
│   └── enterprise/
└── notification/       # novo subdominio (mesma estrutura)
    ├── application/
    │   ├── use-cases/
    │   └── repositories/
    └── enterprise/
        └── entities/
            └── notification.ts
```

### Entidade com static create

```typescript
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface NotificationProps {
  recipientId: UniqueEntityId
  title: string
  content: string
  readAt?: Date | null
  createdAt: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() { return this.props.recipientId }
  get title() { return this.props.title }
  get content() { return this.props.content }
  get readAt() { return this.props.readAt }
  get createdAt() { return this.props.createdAt }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const notification = new Notification(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )
    return notification
  }
}
```

## Example

**Before (termos genericos, sem estrutura):**
```typescript
// Tudo jogado na mesma pasta, termos genericos
export class Notification {
  userId: string      // generico
  message: string
  created: string     // tipo errado
}
```

**After (com esta skill aplicada):**
```typescript
// domain/notification/enterprise/entities/notification.ts
export class Notification extends Entity<NotificationProps> {
  get recipientId() { return this.props.recipientId }
  // ...
  static create(props: Optional<NotificationProps, 'createdAt'>, id?: UniqueEntityId) {
    return new Notification(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo subdominio | Crie pasta com mesma estrutura do existente (application/, enterprise/) |
| Referencia a entidade de outro dominio | Use apenas o ID (UniqueEntityId), nunca importe a entidade |
| Campo de data de criacao | Gere automaticamente no static create, aceite override |
| Campo de data de leitura/conclusao | Torne opcional com `Date \| null` |
| Nomeando relacionamentos | Pergunte: "no contexto real, como chamam essa pessoa/coisa?" |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `userId` em notificacoes | `recipientId` |
| `user` como entidade universal | `client`, `barber`, `recipient` conforme contexto |
| `new Date()` no construtor publico | `static create()` com default interno |
| Importar entidade Forum dentro de Notification | Usar apenas UniqueEntityId para referencia |
| Pasta unica `entities/` para todos os dominios | `domain/{subdomain}/enterprise/entities/` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
