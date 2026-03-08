---
name: rs-node-js-2023-perguntas-com-anexos
description: "Enforces aggregate persistence patterns when saving entities with child collections in Clean Architecture. Use when user asks to 'save an entity with related items', 'persist attachments', 'create aggregate root', 'sync child entities on edit', or 'implement repository for aggregates'. Applies DDD aggregate rules: parent repository calls child repository, WatchedList tracks additions/removals, createMany/deleteMany sync on edit. Make sure to use this skill whenever implementing repository methods that persist entities with nested collections. Not for file upload handling, single-entity CRUD, or database schema design."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: aggregate-persistence
  tags: [aggregate, ddd, repository, watched-list, createMany, deleteMany, clean-architecture]
---

# Persistencia de Agregados com Colecoes Filhas

> Ao salvar um agregado, o repositorio raiz persiste automaticamente as entidades filhas chamando seus respectivos repositorios.

## Rules

1. **Repositorio raiz chama repositorio filho** — ao criar/salvar um agregado, o repositorio da entidade pai invoca `createMany`/`deleteMany` no repositorio da entidade filha, porque o agregado deve ser persistido como unidade atomica
2. **WatchedList para edicao** — use WatchedList para monitorar itens adicionados e removidos, porque na edicao voce nao recria tudo do zero — apenas cria os novos e deleta os removidos
3. **Dominio != Persistencia** — criar uma entidade no dominio nao significa criar uma nova linha no banco, porque pode significar apenas atualizar um relacionamento (ex: setar `questionId` num attachment existente)
4. **createMany e deleteMany no repositorio filho** — sempre implemente esses dois metodos no repositorio de entidades filhas, porque o agregado precisa de operacoes em lote para sincronizar colecoes
5. **Comece pelos testes unitarios** — implemente primeiro no repositorio em memoria e teste, depois faca na camada de infra, porque isso garante que a logica de dominio esta correta antes de tocar no banco

## How to write

### Repositorio abstrato da entidade filha

```typescript
export abstract class QuestionAttachmentsRepository {
  abstract findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  abstract deleteManyByQuestionId(questionId: string): Promise<void>
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>
}
```

### Repositorio em memoria — createMany e deleteMany

```typescript
async createMany(attachments: QuestionAttachment[]) {
  this.items.push(...attachments)
}

async deleteMany(attachments: QuestionAttachment[]) {
  this.items = this.items.filter((item) => {
    return !attachments.some((attachment) => attachment.equals(item))
  })
}
```

### Repositorio raiz — create e save

```typescript
// No create: persiste a entidade pai + filhas
async create(question: Question) {
  this.items.push(question)
  await this.questionAttachmentsRepository.createMany(
    question.attachments.getItems(),
  )
}

// No save (edicao): sincroniza adicionados e removidos
async save(question: Question) {
  const index = this.items.findIndex((item) => item.id.equals(question.id))
  this.items[index] = question

  await this.questionAttachmentsRepository.createMany(
    question.attachments.getNewItems(),
  )
  await this.questionAttachmentsRepository.deleteMany(
    question.attachments.getRemovedItems(),
  )
}
```

## Example

**Before (anexos nao persistidos):**
```typescript
async create(question: Question) {
  this.items.push(question)
  // Anexos ficam apenas no objeto em memoria, nunca salvos
}
```

**After (agregado persistido corretamente):**
```typescript
async create(question: Question) {
  this.items.push(question)
  await this.questionAttachmentsRepository.createMany(
    question.attachments.getItems(),
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Criando entidade com colecao filha | Chamar `createMany` no repositorio filho dentro do `create` do pai |
| Editando entidade com colecao filha | Chamar `createMany` para `getNewItems()` e `deleteMany` para `getRemovedItems()` |
| Entidade filha ja existe no banco (ex: attachment uploaded) | Nao criar nova linha — apenas atualizar relacionamento (setar foreign key) |
| Testando persistencia de agregado | Verificar que `attachmentsRepository.items` contem os itens esperados |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Salvar apenas a entidade pai sem filhas | Repositorio pai chama repositorio filho no `create`/`save` |
| Recriar todos os filhos na edicao | Usar WatchedList: `getNewItems()` + `getRemovedItems()` |
| Assumir que criar no dominio = criar no banco | Mapear a acao de dominio para a operacao correta de persistencia |
| Persistir filhos diretamente no controller | Deixar o repositorio raiz orquestrar a persistencia do agregado |

## Troubleshooting

### Anexos nao sao salvos ao criar a entidade pai
**Symptom:** Entidade pai e criada no banco mas os anexos associados nao aparecem
**Cause:** O repositorio raiz nao chama `createMany` no repositorio filho apos persistir a entidade pai
**Fix:** Adicione `await this.questionAttachmentsRepository.createMany(question.attachments.getItems())` dentro do metodo `create` do repositorio raiz

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
