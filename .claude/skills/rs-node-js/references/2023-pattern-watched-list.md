---
name: rs-node-js-2023-pattern-watched-list
description: "Applies the WatchedList pattern when implementing edit operations on entities with child collections in DDD. Use when user asks to 'edit an entity with related items', 'track added and removed items', 'update attachments/tags list', 'optimize database operations for collections', or 'implement aggregate child management'. Ensures only necessary DB operations (insert new, delete removed, skip unchanged). Make sure to use this skill whenever editing entities that have one-to-many relationships like attachments, tags, or answers. Not for simple CRUD without collection tracking, or for read-only operations."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-patterns
  tags: [watched-list, ddd, aggregate, collections, edit-operations, diff-tracking, typescript]
---

# Pattern: WatchedList

> Ao editar entidades com colecoes filhas, use WatchedList para rastrear adicoes e remocoes e executar apenas as operacoes de banco necessarias.

## Rules

1. **Use WatchedList para colecoes filhas de agregados** — `QuestionAttachments`, `AnswerComments`, `PostTags`, porque permite identificar exatamente o que mudou e evitar operacoes desnecessarias no banco
2. **Sempre estenda a classe abstrata, nunca instancie diretamente** — WatchedList e abstrata e exige implementacao de `compareItems`, porque cada dominio compara itens de forma diferente (por ID, por valor, etc.)
3. **Use o metodo `update()` para substituir a lista inteira** — ele calcula automaticamente novos e removidos comparando com o estado inicial, porque e o caso mais comum em edicoes vindas do frontend
4. **Persista usando `getNewItems()` e `getRemovedItems()`** — no repositorio, crie apenas os novos e delete apenas os removidos, porque itens inalterados nao precisam de operacao no banco
5. **Nunca manipule `currentItems` diretamente** — use `add()`, `remove()` e `update()`, porque os metodos internos mantêm a consistencia entre as listas `new`, `removed` e `current`

## How to write

### Criar uma WatchedList concreta

```typescript
// Cada colecao filha precisa de sua propria WatchedList
export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
```

### Usar no agregado

```typescript
export class Question extends AggregateRoot<QuestionProps> {
  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
  }
}
```

### Persistir no repositorio

```typescript
async save(question: Question): Promise<void> {
  await this.questionsRepo.update(question)

  // Apenas operacoes necessarias
  const newAttachments = question.attachments.getNewItems()
  const removedAttachments = question.attachments.getRemovedItems()

  await this.attachmentsRepo.createMany(newAttachments)
  await this.attachmentsRepo.deleteMany(removedAttachments)
}
```

## Example

**Before (sem WatchedList — operacoes desnecessarias):**
```typescript
// Deleta TODOS os anexos e recria — ineficiente
async editQuestion(questionId: string, newAttachmentIds: string[]) {
  await db.delete('attachments').where({ questionId })
  await db.insert('attachments').values(
    newAttachmentIds.map(id => ({ questionId, attachmentId: id }))
  )
}
```

**After (com WatchedList — apenas o necessario):**
```typescript
async editQuestion(question: Question, newAttachmentIds: string[]) {
  const newAttachments = newAttachmentIds.map(id =>
    QuestionAttachment.create({ questionId: question.id, attachmentId: new UniqueEntityID(id) })
  )

  question.attachments.update(newAttachments)

  // So cria os novos, so deleta os removidos, ignora os inalterados
  await this.attachmentsRepo.createMany(question.attachments.getNewItems())
  await this.attachmentsRepo.deleteMany(question.attachments.getRemovedItems())
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Entidade tem relacao 1:N editavel (anexos, tags, membros) | Criar WatchedList para a colecao filha |
| Frontend envia lista completa de IDs na edicao | Usar `update(newList)` para calcular diff automatico |
| Adicao/remocao individual (ex: toggle) | Usar `add(item)` e `remove(item)` individualmente |
| Colecao e somente leitura (nunca editada) | Array simples, WatchedList e desnecessaria |
| `compareItems` com Value Objects | Comparar pelo ID interno: `a.id.equals(b.id)` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `DELETE ALL + INSERT ALL` na edicao | `createMany(getNewItems()) + deleteMany(getRemovedItems())` |
| `question.props.attachments = newArray` | `question.attachments.update(newList)` |
| `new WatchedList()` diretamente | `class MyList extends WatchedList<T>` com `compareItems` |
| Comparar itens por referencia | Implementar `compareItems` comparando por ID |
| Manter lista de removidos manualmente | Deixar WatchedList rastrear automaticamente |

## Troubleshooting

### WatchedList nao detecta itens novos ou removidos
**Symptom:** `getNewItems()` e `getRemovedItems()` retornam arrays vazios apos editar a colecao
**Cause:** A lista foi manipulada diretamente via `currentItems` ao inves de usar os metodos `update()`, `add()` ou `remove()`
**Fix:** Use `question.attachments.update(newList)` para substituir a lista, ou `add()`/`remove()` para operacoes individuais

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
