---
name: rs-node-js-2023-entidades-de-comentarios
description: "Enforces separation between domain entities and persistence entities when modeling comments or polymorphic relationships in DDD applications. Use when user asks to 'create comment entity', 'model comments', 'add comments to questions/answers', 'implement polymorphic entities', or any DDD entity design task. Applies rules: separate domain entities even when persistence is shared, never mirror database tables 1:1, identify unique domain concepts independently. Make sure to use this skill whenever designing domain entities that share similar fields but belong to different aggregates. Not for database schema design, ORM configuration, or persistence layer implementation."
---

# Entidades de Dominio vs Entidades de Persistencia

> Crie uma entidade de dominio para cada conceito que voce consegue identificar unicamente na aplicacao, independente de como sera persistido no banco de dados.

## Rules

1. **Separe entidades de dominio de tabelas do banco** — um AnswerComment e um QuestionComment sao entidades distintas no dominio, mesmo que compartilhem campos semelhantes, porque representam conceitos diferentes no negocio
2. **Nunca faca mapeamento 1:1 entre entidades e tabelas** — voce pode ter 50 entidades de dominio e 20 tabelas no banco, porque a camada de dominio modela o negocio, nao a persistencia
3. **Identifique unicidade pelo dominio, nao pela estrutura** — se dois conceitos tem campos parecidos mas pertencem a contextos diferentes (comentario de pergunta vs comentario de resposta), sao entidades separadas
4. **Cada entidade carrega seu relacionamento** — AnswerComment tem `answerId`, QuestionComment tem `questionId`, porque o relacionamento faz parte da identidade da entidade
5. **Props tipadas com Value Objects** — IDs de relacionamento usam `UniqueEntityId`, nao `string`, porque preservam a semantica do dominio
6. **Campos de auditoria padrao** — `createdAt: Date` obrigatorio, `updatedAt: Date | null` opcional inicialmente, porque rastreiam ciclo de vida da entidade

## How to write

### Entidade de comentario com relacionamento

```typescript
interface AnswerCommentProps {
  authorId: UniqueEntityId
  answerId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export class AnswerComment extends Entity<AnswerCommentProps> {
  get authorId() { return this.props.authorId }
  get answerId() { return this.props.answerId }
  get content() { return this.props.content }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  static create(props: Optional<AnswerCommentProps, 'createdAt'>, id?: UniqueEntityId) {
    return new AnswerComment({ ...props, createdAt: props.createdAt ?? new Date() }, id)
  }
}
```

### Duplicar para conceito similar mas distinto

```typescript
// QuestionComment — mesma estrutura, entidade diferente
interface QuestionCommentProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId  // <-- muda o relacionamento
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionComment extends Entity<QuestionCommentProps> {
  // mesmos accessors, mas entidade independente
}
```

## Example

**Before (entidade unica generica — erro comum):**
```typescript
// ERRADO: uma unica entidade "Comment" com tipo polimorfico
interface CommentProps {
  authorId: string
  parentId: string        // pergunta OU resposta — ambiguo
  parentType: 'question' | 'answer'  // polimorfismo no dominio
  content: string
}
```

**After (entidades separadas por dominio):**
```typescript
// CORRETO: entidades distintas para conceitos distintos
export class AnswerComment extends Entity<AnswerCommentProps> {
  get answerId() { return this.props.answerId }
}

export class QuestionComment extends Entity<QuestionCommentProps> {
  get questionId() { return this.props.questionId }
}
// Polimorfismo fica na camada de persistencia, nao no dominio
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dois conceitos com campos parecidos mas donos diferentes | Crie entidades separadas |
| Precisa de polimorfismo (tipo generico) | Resolva na camada de persistencia, nao no dominio |
| Entidade tem apenas getters e 1 setter | Setter atualiza `updatedAt` via `touch()` |
| Campo pode ser nulo inicialmente | Use `Type \| null` com valor default no `create()` |
| ID de relacionamento | Use `UniqueEntityId`, nunca `string` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `parentType: 'question' \| 'answer'` no dominio | Entidades separadas: `QuestionComment`, `AnswerComment` |
| `parentId: string` generico | `answerId: UniqueEntityId` ou `questionId: UniqueEntityId` |
| Uma entidade `Comment` para tudo | Uma entidade por conceito unico no dominio |
| Modelar dominio pensando nas tabelas | Modelar dominio pensando no negocio |
| `id: string` para relacionamentos | `id: UniqueEntityId` com Value Object |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-entidades-de-comentarios/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-entidades-de-comentarios/references/code-examples.md)
