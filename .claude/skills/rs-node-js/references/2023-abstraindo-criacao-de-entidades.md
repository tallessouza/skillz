---
name: rs-node-js-2023-abstraindo-criacao-entidades
description: "Enforces static factory method pattern for DDD entity creation in TypeScript. Use when user asks to 'create an entity', 'implement a domain model', 'build a DDD class', 'add a factory method', or any entity/aggregate design task. Applies rules: static create() method, protected constructor, Optional utility type for auto-filled props, auto-generate IDs when not provided. Make sure to use this skill whenever designing domain entities in DDD or Clean Architecture projects. Not for DTOs, database models, or simple data classes."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-entity-creation
  tags: [ddd, entity, factory-method, typescript, clean-architecture, value-object, domain-model]
---

# Abstraindo Criacao de Entidades (DDD)

> Entidades de dominio usam um metodo estatico `create()` como factory, mantendo o construtor protegido e preenchendo campos automaticos como `createdAt` sem exigi-los do chamador.

## Rules

1. **Construtor protegido na classe base** — use `protected constructor` na Entity base, porque impede instanciacao direta com `new` fora da hierarquia
2. **Metodo estatico `create()` em cada entidade** — substitui o `new` publico, porque centraliza logica de criacao (defaults, IDs) sem sobrescrever o construtor da classe pai
3. **Use `Optional<Props, 'campo'>` para props auto-preenchidas** — `createdAt` nao e opcional na entidade, so e opcional na criacao, porque sera preenchido automaticamente
4. **Gere ID quando nao fornecido** — `id ?? new UniqueEntityId()`, porque permite tanto criar entidades novas quanto reconstruir existentes do banco
5. **Preencha defaults dentro do `create()`** — `createdAt: props.createdAt ?? new Date()`, porque o chamador nao deve se preocupar com campos automaticos
6. **Converta strings em Value Objects na camada de use case** — `new UniqueEntityId(stringId)`, porque o dominio trabalha com tipos fortes, nao strings cruas

## How to write

### Optional utility type

```typescript
// src/core/types/optional.ts
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
```

### Entity com factory method

```typescript
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface QuestionProps {
  title: string
  content: string
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
  // ... getters

  static create(
    props: Optional<QuestionProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? new UniqueEntityId(),
    )

    return question
  }
}
```

### Uso no use case

```typescript
const answer = Answer.create({
  content,
  authorId: new UniqueEntityId(instructorId),
  questionId: new UniqueEntityId(questionId),
})
```

## Example

**Before (construtor publico, campos manuais):**
```typescript
const question = new Question({
  title: 'Nova pergunta',
  content: 'Conteudo',
  authorId: new UniqueEntityId(),
  createdAt: new Date(), // obrigatorio passar manualmente
}, new UniqueEntityId())
```

**After (factory method com defaults):**
```typescript
const question = Question.create({
  title: 'Nova pergunta',
  content: 'Conteudo',
  authorId: new UniqueEntityId(),
  // createdAt preenchido automaticamente
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Campo sempre existe mas e auto-preenchido | Use `Optional<Props, 'campo'>` no create, preencha com default |
| Campo genuinamente opcional (pode nunca existir) | Use `?` direto na interface Props |
| Reconstruindo entidade do banco | Passe o `id` existente como segundo argumento do `create()` |
| Entidade simples sem campos automaticos | `create()` ainda necessario, mas sem `Optional` |
| String vinda de fora do dominio | Converta para `UniqueEntityId` no use case |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `new Question({...})` fora da classe | `Question.create({...})` |
| `constructor` publico na entidade | `protected constructor` na Entity base |
| `createdAt?: Date` na interface Props | `createdAt: Date` + `Optional<Props, 'createdAt'>` no create |
| `new UniqueEntityId()` no chamador quando id e conhecido | `new UniqueEntityId(existingId)` para reaproveitar |
| Sobrescrever construtor da classe pai | Usar `create()` estatico que chama `new` internamente |

## Troubleshooting

### Entidade nao aceita id existente na reconstrucao
**Symptom:** Ao buscar do banco e reconstruir a entidade, um novo ID e gerado
**Cause:** O `create()` nao recebe o parametro `id` ou nao passa para o construtor
**Fix:** Garanta que `create(props, id?)` repassa `id` como segundo argumento de `new Entity(props, id)`

### Campo auto-preenchido aparece como undefined
**Symptom:** `entity.createdAt` retorna `undefined` apos criacao
**Cause:** O default `props.createdAt ?? new Date()` nao foi adicionado dentro do `create()`
**Fix:** Adicione spread + default: `{ ...props, createdAt: props.createdAt ?? new Date() }`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-abstraindo-criacao-de-entidades/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-abstraindo-criacao-de-entidades/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
