---
name: rs-node-js-2023-id-das-entidades
description: "Enforces UniqueEntityID value object pattern when creating domain entities in DDD/Clean Architecture. Use when user asks to 'create an entity', 'implement a domain model', 'generate an ID', 'setup base entity class', or any DDD entity work. Applies rules: IDs wrapped in UniqueEntityID value object, never raw strings/UUIDs in entities, optional ID in constructor for rehydration. Make sure to use this skill whenever generating domain entities or base entity classes. Not for database IDs, ORM primary keys, or infrastructure-layer identifiers."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: entity-identity
  tags: [ddd, entity, unique-id, value-object, uuid, typescript]
---

# ID das Entidades — UniqueEntityID Value Object

> Encapsule toda logica de identificacao de entidades em um Value Object UniqueEntityID, nunca exponha geracao de IDs diretamente nas entidades.

## Rules

1. **Nunca use UUID/randomUUID diretamente na Entity** — encapsule em `UniqueEntityID`, porque se a estrategia de geracao mudar, voce altera em um unico lugar
2. **ID eh opcional no construtor** — se nao informado, gera automaticamente; se informado, usa o valor recebido (rehydration do banco), porque entidades precisam ser tanto criadas quanto reconstituidas
3. **UniqueEntityID eh um Value Object** — segue a mesma estrutura de qualquer VO (value, construtor, accessor), porque IDs sao imutaveis e comparaveis por valor
4. **Entity base referencia UniqueEntityID, nunca string** — o tipo do campo `id` na classe Entity eh `UniqueEntityID`, nao `string`, porque isso garante type-safety e centralizacao
5. **Forneca toString() e toValue()** — permita conversao facil para string quando necessario (logs, serialization), porque consumers precisam do valor primitivo em contextos de infra
6. **Isso nao eh regra do DDD, eh decisao de implementacao** — DDD define conceitos (entidade, VO), nao como codificar; este padrao eh uma convencao pratica que centraliza geracao de IDs

## How to write

### UniqueEntityID Value Object

```typescript
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

### Entity base usando UniqueEntityID

```typescript
export class Entity<Props> {
  private _id: UniqueEntityID

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID()
    // ... assign props
  }
}
```

### Entidade concreta

```typescript
export class Question extends Entity<QuestionProps> {
  static create(props: QuestionProps, id?: UniqueEntityID) {
    return new Question(props, id)
  }
}

// Criacao nova (gera ID automaticamente)
const question = Question.create({ title: 'Nova pergunta', content: '...' })

// Reconstituicao do banco (usa ID existente)
const question = Question.create(
  { title: 'Pergunta existente', content: '...' },
  new UniqueEntityID('existing-uuid-from-db'),
)
```

## Example

**Before (ID acoplado na entidade):**
```typescript
import { randomUUID } from 'node:crypto'

export class Entity<Props> {
  private _id: string

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: string) {
    this._id = id ?? randomUUID()
  }
}
```

**After (com UniqueEntityID):**
```typescript
export class Entity<Props> {
  private _id: UniqueEntityID

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID()
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Criando nova entidade de dominio | `new UniqueEntityID()` sem argumento |
| Reconstituindo do banco/API | `new UniqueEntityID(rawId)` com valor existente |
| Comparando IDs de entidades | Compare via `id.toValue() === otherId.toValue()` |
| Precisa mudar estrategia de ID (CUID, ULID, nanoid) | Altere apenas dentro de UniqueEntityID |
| Logando ou serializando | Use `entity.id.toString()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `private _id: string` na Entity base | `private _id: UniqueEntityID` |
| `randomUUID()` direto no construtor da Entity | `new UniqueEntityID()` |
| `id?: string` no construtor da entidade | `id?: UniqueEntityID` |
| Comparar IDs com `===` direto entre objetos | `id.toValue() === otherId.toValue()` |
| Gerar ID na camada de infra/repositorio | Gerar na camada de dominio via UniqueEntityID |

## Troubleshooting

### Comparacao de IDs entre entidades sempre retorna false
**Symptom:** entity.id === otherEntity.id retorna false mesmo quando os IDs sao iguais
**Cause:** UniqueEntityID e um objeto e === compara referencia em memoria, nao o valor interno
**Fix:** Compare usando id.toValue() === otherId.toValue() ou implemente um metodo equals() no UniqueEntityID

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
