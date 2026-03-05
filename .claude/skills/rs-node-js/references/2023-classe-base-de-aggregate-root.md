---
name: rs-node-js-2023-aggregate-root
description: "Applies DDD AggregateRoot pattern when designing domain entities in TypeScript/Node.js. Use when user asks to 'create an aggregate', 'implement DDD', 'design domain entities', 'model a root entity', or structure entity relationships. Enforces: AggregateRoot extends Entity, abstract class, root entity identifies the aggregate, co-manipulated entities belong together. Make sure to use this skill whenever modeling domain layers with aggregates. Not for simple CRUD, database schemas, or API controllers."
---

# AggregateRoot — Classe Base DDD

> Todo agregado tem uma entidade raiz (root) da qual todas as outras dependem — sem ela, nenhuma outra faz sentido.

## Rules

1. **AggregateRoot estende Entity** — porque a raiz de um agregado continua sendo uma entidade, com id e props
2. **AggregateRoot e abstrata** — nunca instancie diretamente, apenas classes que herdam dela, porque ela representa um conceito, nao uma instancia concreta
3. **Agregado != Relacionamento simples** — entidades que sao criadas/editadas JUNTAS formam agregado; entidades criadas em momentos diferentes sao apenas relacionamentos
4. **A entidade raiz identifica o agregado** — Question e root porque Attachments e Tags so existem no contexto dela
5. **Troque Entity por AggregateRoot na entidade principal** — quando uma entidade passa a gerenciar sub-entidades co-manipuladas, ela vira AggregateRoot
6. **Classe vazia por enquanto e OK** — AggregateRoot ganha funcionalidades quando domain events forem implementados

## How to write

### Classe base AggregateRoot

```typescript
// core/entities/aggregate-root.ts
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  // Por enquanto vazio — domain events serao adicionados depois
}
```

### Entidade que vira AggregateRoot

```typescript
// domain/entities/question.ts
import { AggregateRoot } from '@/core/entities/aggregate-root'

export class Question extends AggregateRoot<QuestionProps> {
  // Attachments e Tags serao manipulados junto com Question
  // Isso e o que define Question como aggregate root
}
```

## Example

**Before (relacionamento simples, sem agregado):**
```typescript
export class Question extends Entity<QuestionProps> {
  // Question existe sozinha, sem gerenciar sub-entidades
}

// Attachments criados separadamente, em outro momento
const question = Question.create({ title: 'Duvida' })
// ... mais tarde ...
const attachment = Attachment.create({ questionId: question.id })
```

**After (agregado — entidades co-manipuladas):**
```typescript
export class Question extends AggregateRoot<QuestionProps> {
  // Attachments e Tags sao manipulados JUNTO com Question
  // Criar/editar question = criar/editar attachments ao mesmo tempo
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Entidades criadas/editadas ao mesmo tempo | Agregado — use AggregateRoot |
| Entidade criada depois, separadamente | Relacionamento simples — use Entity |
| Question + Attachments + Tags | Agregado (co-manipulados) |
| Question + QuestionComment | NAO e agregado (comentario criado depois) |
| Classe so simboliza conceito sem logica extra | OK estar vazia, funcionalidade vem depois |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `new AggregateRoot(props)` | Herde: `class X extends AggregateRoot<P>` |
| Todo relacionamento e agregado | So co-manipulados sao agregado |
| Duplicar logica de Entity no AggregateRoot | Estenda Entity, reuse tudo |
| Instanciar Entity base diretamente | Torne Entity abstrata tambem |
| Colocar Comment dentro do agregado Question | Comment e criado separado, nao e co-manipulado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-classe-base-de-aggregate-root/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-classe-base-de-aggregate-root/references/code-examples.md)
