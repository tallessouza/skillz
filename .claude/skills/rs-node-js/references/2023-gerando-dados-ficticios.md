---
name: rs-node-js-2023-gerando-dados-ficticios
description: "Enforces use of @faker-js/faker for generating realistic test data in factory functions. Use when user asks to 'create a factory', 'write test helpers', 'generate test data', 'make fixtures', or 'setup test entities'. Applies rules: never use hardcoded repetitive data like 'example' in factories, use faker.lorem for text fields, accept optional id and override parameters. Make sure to use this skill whenever creating or editing test factories for domain entities. Not for production seed data, database migrations, or mock API responses."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: test-factories
  tags: [faker, testing, factories, fixtures, typescript, ddd]
---

# Gerando Dados Fictícios com Faker

> Factories de teste geram dados únicos e aleatórios para cada instância, nunca valores fixos repetidos.

## Rules

1. **Use `@faker-js/faker` em toda factory de teste** — porque dados idênticos (`"example"`, `"test content"`) tornam impossível diferenciar entidades nos testes
2. **Escolha o gerador faker adequado ao campo** — `faker.lorem.sentence()` para títulos curtos, `faker.lorem.text()` para conteúdos longos, porque o formato deve ser realista
3. **Aceite override parcial como primeiro parâmetro** — `Partial<Props>` permite sobrescrever campos específicos mantendo faker nos demais, porque testes precisam controlar apenas os campos relevantes
4. **Aceite id opcional como segundo parâmetro** — `UniqueEntityId | undefined` passado ao `Entity.create()`, porque alguns testes precisam de ids determinísticos
5. **Instale faker como devDependency** — `npm i -D @faker-js/faker`, porque dados fictícios só existem em contexto de teste

## How to write

### Factory com faker e overrides

```typescript
import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question, QuestionProps } from '@/domain/forum/enterprise/entities/question'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      authorId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return question
}
```

## Example

**Before (dados repetitivos):**
```typescript
export function makeQuestion(override: Partial<QuestionProps> = {}) {
  return Question.create({
    title: 'Example question',
    content: 'Example content',
    authorId: new UniqueEntityId(),
    ...override,
  })
}
```

**After (com faker):**
```typescript
export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  return Question.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      authorId: new UniqueEntityId(),
      ...override,
    },
    id,
  )
}
```

## Heuristics

| Situação | Gerador faker |
|----------|---------------|
| Título, nome curto | `faker.lorem.sentence()` |
| Conteúdo longo, descrição | `faker.lorem.text()` |
| Email | `faker.internet.email()` |
| Nome de pessoa | `faker.person.fullName()` |
| URL | `faker.internet.url()` |
| Slug | Deixe derivar do título ou passe via override |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `title: 'Example question'` | `title: faker.lorem.sentence()` |
| `content: 'Example content'` | `content: faker.lorem.text()` |
| Factory sem parâmetro de override | `override: Partial<Props> = {}` |
| Factory sem id opcional | Segundo parâmetro `id?: UniqueEntityId` |
| `faker` em dependencies | `faker` em devDependencies |

## Troubleshooting

### Testes falham intermitentemente com dados gerados pelo faker
**Symptom:** Um teste passa isolado mas falha quando executado junto com outros
**Cause:** O teste depende de um valor especifico que o faker gera aleatoriamente a cada execucao
**Fix:** Use o parametro override para fixar o campo relevante no teste: makeQuestion({ title: 'Titulo Especifico' })

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
