# Code Examples: Entidade de Notificacao

## Estrutura completa de pastas criada na aula

```
domain/
├── forum/
│   ├── application/
│   │   ├── use-cases/
│   │   └── repositories/
│   └── enterprise/
│       └── entities/
└── notification/
    ├── application/
    │   ├── use-cases/
    │   └── repositories/
    └── enterprise/
        └── entities/
            └── notification.ts
```

## Entidade Notification completa

```typescript
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface NotificationProps {
  recipientId: UniqueEntityId
  title: string
  content: string
  readAt?: Date | null
  createdAt: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get readAt() {
    return this.props.readAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return notification
  }
}
```

## Comparacao com entidade do forum (mesmo padrao)

O padrao e identico ao usado em entidades do forum — a diferenca e apenas o dominio e a terminologia:

```typescript
// domain/forum/enterprise/entities/question.ts (padrao existente)
export class Question extends Entity<QuestionProps> {
  get authorId() { return this.props.authorId }  // "author" no contexto forum
  // ...
  static create(props: Optional<QuestionProps, 'createdAt'>, id?: UniqueEntityId) {
    // mesmo padrao
  }
}

// domain/notification/enterprise/entities/notification.ts (novo subdominio)
export class Notification extends Entity<NotificationProps> {
  get recipientId() { return this.props.recipientId }  // "recipient" no contexto notificacao
  // ...
  static create(props: Optional<NotificationProps, 'createdAt'>, id?: UniqueEntityId) {
    // mesmo padrao
  }
}
```

## Uso do Optional type helper

O tipo `Optional` torna campos obrigatorios em opcionais para o `create`:

```typescript
// Definicao do helper (ja existe no core)
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

// Uso: createdAt e obrigatorio em NotificationProps,
// mas opcional no create() porque geramos default
static create(props: Optional<NotificationProps, 'createdAt'>) {
  // props.createdAt pode ser undefined aqui
  // mas notification.createdAt nunca sera undefined
}
```

## Criando uma notificacao (exemplos de uso)

```typescript
// Nova notificacao (createdAt gerado automaticamente)
const notification = Notification.create({
  recipientId: new UniqueEntityId('recipient-1'),
  title: 'Nova resposta na sua pergunta',
  content: 'Alguem respondeu sua pergunta sobre DDD',
})

// Reconstituindo do banco de dados (com id e createdAt existentes)
const fromDb = Notification.create(
  {
    recipientId: new UniqueEntityId('recipient-1'),
    title: 'Nova resposta',
    content: 'Conteudo...',
    readAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-10'),
  },
  new UniqueEntityId('notification-existing-id'),
)
```