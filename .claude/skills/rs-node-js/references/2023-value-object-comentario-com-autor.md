---
name: rs-node-js-2023-vo-comentario-autor
description: "Enforces Value Object patterns for composite data structures in Domain-Driven Design with TypeScript. Use when user asks to 'return data from multiple entities', 'create a DTO', 'combine entities', 'list with related data', or 'represent joined data in domain layer'. Applies rules: Value Objects for multi-entity data, no entity inheritance for composites, explicit property naming, factory method pattern, mandatory getters for serialization. Make sure to use this skill whenever creating domain classes that aggregate data from multiple entities. Not for single-entity CRUD, database schemas, or REST controller logic."
---

# Value Object para Dados Compostos (Multi-Entidade)

> Quando precisar representar dados de varias entidades juntas, use Value Objects — nunca entidades — porque dados compostos nao tem identidade propria.

## Rules

1. **Dados multi-entidade = Value Object, nunca entidade** — porque entidades representam coisas com ID unico, e um "comentario com autor" nao e uma coisa identificavel, e apenas um aglomerado de dados de transicao
2. **Nomeie IDs explicitamente** — `commentId` nao `id`, porque dentro de um Value Object com dados de varias entidades, `id` e ambiguo (e do autor ou do comentario?)
3. **Comece pela menor fatia possivel** — se precisa comentario com autor, nao traga likes, sub-comentarios e tudo mais; aumente no futuro se necessario (evite overfetching)
4. **Use factory method `create()` em vez de construtor direto** — porque o construtor e `protected` na classe base, e o `create()` permite validacoes e defaults
5. **Crie getters para toda propriedade que precisa ser serializada** — sem getter, a informacao nao aparece ao converter a instancia em JSON
6. **Compare Value Objects por valor, nao por referencia** — use `JSON.stringify(props)` no metodo `equals()`, porque `===` compara posicao na memoria, nao conteudo

## How to write

### Classe base ValueObject

```typescript
export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public equals(vo: ValueObject<Props> | undefined | null): boolean {
    if (vo === null || vo === undefined) return false
    if (vo.props === undefined) return false
    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}
```

### Value Object composto

```typescript
export interface CommentWithAuthorProps {
  commentId: UniqueEntityID
  content: string
  author: { id: UniqueEntityID; name: string }
  createdAt: Date
  updatedAt?: Date | null
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }

  get commentId() { return this.props.commentId }
  get content() { return this.props.content }
  get author() { return this.props.author }
  get createdAt() { return this.props.createdAt }
  get updatedAt() { return this.props.updatedAt }
}
```

## Example

**Before (usando entidade para dados compostos):**
```typescript
// ERRADO: estendendo Entity para algo que nao tem identidade propria
class CommentWithAuthor extends Entity<CommentWithAuthorProps> {
  // id aqui e ambiguo — de quem?
}

// ERRADO: retornando entidade simples e perdendo dados do autor
const comments: QuestionComment[] = await repo.findMany()
```

**After (com Value Object):**
```typescript
// CORRETO: Value Object para dados compostos
class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props)
  }
  get commentId() { return this.props.commentId }
  get author() { return this.props.author }
}

// Caso de uso retorna Value Objects
const comments: CommentWithAuthor[] = await repo.findManyWithAuthor()
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados vem de 1 tabela/entidade | Use a entidade diretamente |
| Dados vem de 2+ entidades (join) | Crie um Value Object composto |
| Precisa de ID unico para identificar | E uma entidade, nao Value Object |
| Front-end precisa de dados combinados | Value Object no dominio + presenter na infra |
| Propriedade opcional pode ter default | Trate no `create()` factory method |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `class CommentWithAuthor extends Entity` | `class CommentWithAuthor extends ValueObject` |
| `id: UniqueEntityID` (ambiguo em VO composto) | `commentId: UniqueEntityID` |
| `constructor publico` em Value Object | `static create()` + `protected constructor` |
| `vo1 === vo2` para comparar Value Objects | `vo1.equals(vo2)` com JSON.stringify |
| Value Object com todos os campos de todas as entidades | Apenas os campos necessarios para o caso de uso |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-value-object-comentario-com-autor/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-value-object-comentario-com-autor/references/code-examples.md)
