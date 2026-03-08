---
name: 2023-entidade-de-notificacao
description: "Creates entities in new DDD subdomains with replicated folder structure, domain-specific terminology (recipientId not userId), and static create methods with defaults. Use when user asks to 'create a subdomain', 'add a notification entity', 'model a new bounded context', or 'structure DDD subdomains'. Make sure to use this skill whenever adding a new subdomain to a DDD application or creating entities that reference other subdomains only by ID. Not for modifying existing subdomains, cross-domain integration logic, or database schema design."
category: coding-lens
tags: [ddd, domain-events, entities, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: subdominio-notificacao
  tags: [ddd, subdominio, entities, notification, linguagem-ubiqua, typescript]
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

## Troubleshooting

### Subdominio de notificacao importa entidades do subdominio forum
**Symptom:** Acoplamento entre subdominios — mudancas no forum quebram notificacao
**Cause:** Importacao direta de entidades cross-domain ao inves de usar apenas IDs
**Fix:** Referencie outros subdominios somente via `UniqueEntityId` — a integracao entre subdominios vem via Domain Events, nao via import direto

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
