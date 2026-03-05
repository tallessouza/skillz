---
name: rs-node-js-2023-classe-base-de-comentarios
description: "Enforces abstract base class extraction pattern when writing TypeScript/Node.js domain entities with shared properties. Use when user asks to 'create entities', 'reduce duplication between classes', 'refactor domain models', 'implement inheritance', or 'apply DDD patterns'. Applies generic props extension, abstract classes, and inheritance over naive polymorphism. Make sure to use this skill whenever creating domain entities that share common fields. Not for database schema design, REST APIs, or frontend components."
---

# Classe Base com Heranca em Entidades de Dominio

> Quando duas ou mais entidades compartilham propriedades, extraia uma classe abstrata base com generic props em vez de usar polimorfismo com campo type.

## Rules

1. **Entidades de dominio NAO sao tabelas** — nao faca mapeamento 1:1 entre entidades e tabelas do banco, porque dominio modela comportamento, banco modela persistencia
2. **Prefira heranca com classe base sobre polimorfismo com type field** — `abstract class Comment` + `AnswerComment extends Comment` em vez de `Comment { type: 'answer' | 'question' }`, porque polimorfismo com type traz complexidade desproporcional ao ganho
3. **Classe base deve ser abstract** — impede instanciacao direta (`new Comment()` nao compila), porque a base so existe para ser estendida
4. **Use generic props na classe base** — `Comment<Props extends CommentProps>` permite que subclasses adicionem propriedades especificas sem perder as comuns
5. **Subclasse contem APENAS o que e especifico** — `AnswerComment` tem so `answerId`, getters especificos e `create()`, porque getters comuns ficam na base
6. **Remova `create()` da classe abstrata** — classes abstratas nao devem ter factory method proprio, porque nao podem ser instanciadas

## How to write

### Classe base abstrata com generic props

```typescript
// Props comuns entre todas as subclasses
interface CommentProps {
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
}

// Generic Props extends CommentProps — permite extensao
export abstract class Comment<
  Props extends CommentProps = CommentProps,
> extends Entity<Props> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }
}
```

### Subclasse especifica

```typescript
// Props especificas — so o que a subclasse adiciona
export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(props: Optional<AnswerCommentProps, 'createdAt'>, id?: UniqueEntityID) {
    return new AnswerComment({ ...props, createdAt: props.createdAt ?? new Date() }, id)
  }
}
```

## Example

**Before (duplicacao entre AnswerComment e QuestionComment):**

```typescript
export class AnswerComment extends Entity<AnswerCommentProps> {
  get authorId() { return this.props.authorId }
  get content() { return this.props.content }
  get answerId() { return this.props.answerId }
  get createdAt() { return this.props.createdAt }
  // ... todos os getters duplicados em QuestionComment
}
```

**After (classe base extraida):**

```typescript
// Comment tem authorId, content, createdAt, updatedAt
export abstract class Comment<Props extends CommentProps> extends Entity<Props> { /* getters comuns */ }

// AnswerComment tem APENAS answerId
export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() { return this.props.answerId }
  static create(props, id?) { /* ... */ }
}

// QuestionComment tem APENAS questionId
export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() { return this.props.questionId }
  static create(props, id?) { /* ... */ }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| 2+ entidades compartilham 3+ campos | Extraia classe base abstrata |
| Entidade tem campo `type` para diferenciar comportamento | Refatore para heranca com subclasses |
| Classe base precisa de factory method | NAO — so subclasses concretas tem `create()` |
| Subclasse nao adiciona nenhum campo | Ainda assim crie — semantica importa |
| Props da subclasse precisa dos campos da base | Use `extends CommentProps` na interface |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `Comment { type: 'answer' \| 'question' }` | `abstract class Comment` + subclasses |
| `new Comment(...)` (instanciar base) | `AnswerComment.create(...)` |
| Getters duplicados em todas subclasses | Getters na classe base, so especificos na sub |
| `class Comment extends Entity<CommentProps>` (sem generic) | `class Comment<Props extends CommentProps> extends Entity<Props>` |
| `Comment.create(...)` na classe abstrata | Apenas `AnswerComment.create()` e `QuestionComment.create()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-classe-base-de-comentarios/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-classe-base-de-comentarios/references/code-examples.md)
