# Code Examples: ID das Entidades — UniqueEntityID

## Exemplo 1: Classe UniqueEntityID completa

```typescript
// src/core/entities/unique-entity-id.ts
import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }
}
```

### Pontos-chave:
- `value` eh `private` — acesso somente via `toString()` ou `toValue()`
- Construtor usa `??` (nullish coalescing) — se `undefined`, gera novo UUID
- `randomUUID()` vem de `node:crypto`, nao de lib externa

## Exemplo 2: Entity base integrando UniqueEntityID

```typescript
// src/core/entities/entity.ts
import { UniqueEntityID } from './unique-entity-id'

export class Entity<Props> {
  private _id: UniqueEntityID
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }
}
```

### Antes (sem UniqueEntityID):
```typescript
import { randomUUID } from 'node:crypto'

export class Entity<Props> {
  private _id: string
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: string) {
    this.props = props
    this._id = id ?? randomUUID()
  }
}
```

### Diferenca crucial:
- **Antes:** `randomUUID()` direto na Entity — acoplamento com estrategia de geracao
- **Depois:** `new UniqueEntityID()` — delegacao para o VO, desacoplamento total

## Exemplo 3: Entidade concreta usando o padrao

```typescript
// src/domain/forum/enterprise/entities/question.ts
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Slug } from './value-objects/slug'

interface QuestionProps {
  title: string
  content: string
  authorId: UniqueEntityID
  slug: Slug
  createdAt: Date
}

export class Question extends Entity<QuestionProps> {
  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get slug() {
    return this.props.slug
  }

  static create(props: QuestionProps, id?: UniqueEntityID) {
    return new Question(props, id)
  }
}
```

### Note que `authorId` tambem eh `UniqueEntityID`:
Qualquer referencia a ID de outra entidade usa o mesmo tipo. Isso garante consistencia em todo o dominio.

## Exemplo 4: Cenarios de uso

```typescript
// Criando nova entidade (ID gerado automaticamente)
const question = Question.create({
  title: 'Como funciona DDD?',
  content: 'Gostaria de entender...',
  authorId: new UniqueEntityID(), // novo autor
  slug: Slug.createFromText('como-funciona-ddd'),
  createdAt: new Date(),
})

console.log(question.id.toString()) // "a1b2c3d4-..." (UUID gerado)

// Reconstituindo do banco
const questionFromDB = Question.create(
  {
    title: 'Como funciona DDD?',
    content: 'Gostaria de entender...',
    authorId: new UniqueEntityID('author-uuid-from-db'),
    slug: Slug.createFromText('como-funciona-ddd'),
    createdAt: new Date('2024-01-01'),
  },
  new UniqueEntityID('question-uuid-from-db'),
)

console.log(questionFromDB.id.toString()) // "question-uuid-from-db" (preservado)
```

## Exemplo 5: Trocando estrategia de ID (cenario futuro)

Se precisar trocar de UUID para CUID2, por exemplo:

```typescript
// ANTES (UUID)
import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private value: string

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }
  // ...
}

// DEPOIS (CUID2) — muda APENAS aqui
import { createId } from '@paralleldrive/cuid2'

export class UniqueEntityID {
  private value: string

  constructor(value?: string) {
    this.value = value ?? createId()
  }
  // ...
}
```

**Zero mudancas em qualquer entidade, repositorio, caso de uso, ou controller.** Este eh o poder da abstracao via Value Object.