---
name: rs-node-js-2023-classe-base-de-entidades
description: "Enforces the base Entity class pattern when building domain entities in TypeScript DDD applications. Use when user asks to 'create an entity', 'implement DDD', 'build a domain model', 'add a new entity class', or 'setup domain layer'. Applies rules: generic base Entity class, private ID with getter, protected props object, no public properties, getters for external access. Make sure to use this skill whenever creating or refactoring domain entities in Node.js/TypeScript projects. Not for DTOs, value objects, or database models."
---

# Classe Base de Entidades (DDD)

> Toda entidade de dominio herda de uma classe base `Entity<Props>` que encapsula ID e propriedades, eliminando duplicacao e protegendo o estado interno.

## Rules

1. **Crie uma classe base `Entity<Props>`** — todas as entidades estendem essa classe, porque ID e inicializacao de props se repetem em 100% das entidades
2. **ID e privado com getter apenas** — `private _id` + `get id()`, porque o ID de uma entidade nunca deve ser alterado apos criacao
3. **Props e protected, nunca public** — `protected props: Props`, porque classes filhas precisam acessar, mas codigo externo nao
4. **Use generic para tipar props** — `Entity<AnswerProps>`, porque permite autocompletar e type-safety no `this.props`
5. **Exponha campos via getters** — crie `get content()` retornando `this.props.content`, porque controla exatamente o que e visivel externamente
6. **Elimine construtores redundantes** — se o construtor da filha so chama `super(props, id)`, apague-o, porque a classe base ja faz isso

## How to write

### Classe base Entity

```typescript
// src/core/entities/entity.ts
import { randomUUID } from 'node:crypto'

export class Entity<Props> {
  private _id: string
  protected props: Props

  get id() {
    return this._id
  }

  constructor(props: Props, id?: string) {
    this.props = props
    this._id = id ?? randomUUID()
  }
}
```

### Entidade concreta

```typescript
// src/domain/entities/answer.ts
import { Entity } from '@/core/entities/entity'

interface AnswerProps {
  content: string
  authorId: string
  questionId: string
}

export class Answer extends Entity<AnswerProps> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }
}
```

## Example

**Before (codigo duplicado em cada entidade):**
```typescript
export class Answer {
  public id: string
  public content: string
  public authorId: string

  constructor(props: { content: string; authorId: string }, id?: string) {
    this.id = id ?? randomUUID()
    this.content = props.content
    this.authorId = props.authorId
  }
}

export class Question {
  public id: string
  public title: string

  constructor(props: { title: string }, id?: string) {
    this.id = id ?? randomUUID()
    this.title = props.title
  }
}
```

**After (com classe base Entity):**
```typescript
// Cada entidade fica minima — so interface + getters
interface AnswerProps {
  content: string
  authorId: string
}

export class Answer extends Entity<AnswerProps> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }
}

interface QuestionProps {
  title: string
}

export class Question extends Entity<QuestionProps> {
  get title() {
    return this.props.title
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova entidade de dominio | Crie interface Props + `extends Entity<Props>` |
| Propriedade so leitura externa | Getter que retorna `this.props.campo` |
| Propriedade editavel externamente | Getter + Setter com validacao |
| Propriedade interna apenas | Nenhum getter — `protected props` ja basta |
| Construtor so faz `super()` | Apague o construtor — heranca resolve |
| Entidade simples (1-2 campos) | Mesmo assim use Entity base — consistencia > economia |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `public id: string` na entidade | `private _id` na base + `get id()` |
| `this.content = props.content` manual | `this.props = props` na base |
| Props como `any` no Entity | Generic `Entity<Props>` tipado |
| Construtor repetido em cada entidade | Herdar construtor da base |
| `public content: string` | `get content() { return this.props.content }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
