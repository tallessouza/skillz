---
name: rs-node-js-2023-aggregates-watched-lists
description: "Applies Aggregate and Watched List patterns when modeling domain entities with child collections in DDD applications. Use when user asks to 'create an entity with children', 'edit a list of related items', 'model an order with items', 'handle attachments on a parent entity', or 'track additions and removals in a collection'. Ensures correct identification of aggregates (entities persisted together) and implements Watched Lists for efficient diffing on edit operations. Make sure to use this skill whenever implementing parent-child entity relationships that require create/update/delete tracking. Not for simple CRUD without nested entities, nor for event sourcing or domain events."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-aggregates
  tags: [ddd, aggregate, watched-list, entity, collection, parent-child, domain-model]
---

# Aggregates & Watched Lists

> Quando duas ou mais entidades sao sempre manipuladas juntas (criacao, edicao, remocao), elas formam um agregado — e listas dentro de agregados exigem uma Watched List para rastrear adicoes, remocoes e edicoes.

## Rules

1. **Identifique agregados pela persistencia conjunta** — se entidade A e entidade B sao salvas no banco ao mesmo tempo, sao um agregado, porque entidades independentes tem ciclos de vida separados
2. **Agregado != relacionamento simples** — Answer tem Comments, mas Comments sao criados depois; Order tem OrderItems criados junto — apenas o segundo e agregado
3. **Nunca delete-all + recreate na edicao** — ao editar uma lista dentro de um agregado, identifique exatamente o que foi adicionado, removido e editado, porque apagar e recriar desperdiça performance e gera IDs novos desnecessarios
4. **Use Watched List para listas em agregados** — a Watched List e um array que rastreia o estado de cada item (novo, removido, editado), porque na edicao voce precisa saber qual operacao SQL executar para cada item
5. **Agregados tem privilegios que entidades simples nao tem** — no DDD estrito, apenas agregados podem disparar domain events e servir como raiz de consistencia

## How to write

### Aggregate Root

```typescript
// A Question e a raiz do agregado — ela "possui" os attachments
class Question extends AggregateRoot<QuestionProps> {
  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
  }
}
```

### Watched List (classe base)

```typescript
// WatchedList rastreia estado de cada item na lista
class WatchedList<T> {
  private currentItems: T[]
  private initial: T[]
  private new: T[]
  private removed: T[]

  getItems(): T[]        // itens atuais
  getNewItems(): T[]     // adicionados apos carga inicial
  getRemovedItems(): T[] // removidos da lista original
  add(item: T): void     // marca como novo se nao existia
  remove(item: T): void  // marca como removido
  update(item: T): void  // atualiza item existente
}
```

### Persistencia com Watched List

```typescript
// No repository, use as listas para executar operacoes corretas
async save(question: Question): Promise<void> {
  await this.questionsRepository.save(question)

  const attachments = question.attachments

  // CREATE apenas os novos
  await this.attachmentsRepository.createMany(attachments.getNewItems())

  // DELETE apenas os removidos
  await this.attachmentsRepository.deleteMany(attachments.getRemovedItems())

  // UPDATE apenas os editados (se aplicavel)
}
```

## Example

**Before (abordagem ingenua na edicao):**
```typescript
async editQuestion(questionId: string, data: EditQuestionInput) {
  // ERRADO: apaga tudo e recria
  await db.attachments.deleteMany({ where: { questionId } })
  await db.attachments.createMany({ data: data.attachments })
}
```

**After (com Watched List):**
```typescript
async editQuestion(questionId: string, data: EditQuestionInput) {
  const question = await this.questionsRepository.findById(questionId)

  // Watched List calcula o diff automaticamente
  question.attachments = new QuestionAttachmentList(data.attachments)

  // Repository executa apenas as operacoes necessarias
  await this.questionsRepository.save(question)
  await this.attachmentsRepo.createMany(question.attachments.getNewItems())
  await this.attachmentsRepo.deleteMany(question.attachments.getRemovedItems())
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Entidades criadas ao mesmo tempo (Order + OrderItems) | Agregado — use Watched List para os itens |
| Entidade pai criada antes, filhas depois (Answer + Comments) | NAO e agregado — persista independentemente |
| Lista de filhas editavel (attachments, tags) | Watched List obrigatoria |
| Filha sem edicao apos criacao (log entries) | Watched List desnecessaria — apenas append |
| Duvida se e agregado | Pergunte: "faz sentido a filha existir sem o pai ter sido salvo?" |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `DELETE all + INSERT all` na edicao | Diff com Watched List (create/delete/update seletivos) |
| Tratar todo relacionamento como agregado | Apenas entidades persistidas juntas sao agregados |
| Salvar filhas antes do pai existir no banco | Salvar pai primeiro, filhas em seguida |
| Array simples `T[]` para listas editaveis em agregados | `WatchedList<T>` que rastreia novo/removido/editado |
| Ignorar performance no save de listas | Operacoes cirurgicas por tipo de mudanca |

## Troubleshooting

### Edicao de lista gera registros duplicados
**Symptom:** Apos editar, existem registros duplicados no banco
**Cause:** Delete-all + recreate gera novos IDs para itens que nao mudaram
**Fix:** Use Watched List para identificar apenas novos itens e criar somente esses

### Watched List sempre vazia apos carregar do banco
**Symptom:** `getNewItems()` e `getRemovedItems()` retornam vazio mesmo apos mudancas
**Cause:** A lista inicial nao foi populada com os itens do banco
**Fix:** Instancie a WatchedList com os itens existentes antes de aplicar mudancas

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-aggregates-and-watched-lists/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-aggregates-and-watched-lists/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
