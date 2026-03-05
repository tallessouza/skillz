---
name: rs-node-js-2023-editando-pergunta-anexos
description: "Applies WatchedList pattern for managing entity attachments in DDD aggregates when editing domain entities. Use when user asks to 'edit an entity with related items', 'manage attachments', 'track added and removed items', 'implement aggregate updates', or 'use watched lists'. Ensures proper comparison of current vs new item lists, separate repository for related entities, and lazy loading of child collections. Make sure to use this skill whenever implementing edit use cases that involve child entity collections in DDD. Not for simple CRUD without aggregates, file upload logic, or storage layer implementation."
---

# Editando Entidades com Anexos via WatchedList

> Ao editar uma entidade agregada, use WatchedList para comparar a lista atual de itens relacionados com a nova lista, detectando automaticamente adicoes e remocoes.

## Rules

1. **Crie uma classe tipada que estende WatchedList** — `QuestionAttachmentList extends WatchedList<QuestionAttachment>`, porque isso garante type-safety e encapsula a logica de comparacao
2. **Implemente compareItems comparando pelo ID da entidade relacionada** — `a.attachmentId.equals(b.attachmentId)`, porque o ID do anexo e o que diferencia um item do outro na lista
3. **Nunca carregue itens filhos junto com a entidade pai no findById** — busque anexos separadamente so quando necessario, porque nem toda operacao precisa dos filhos e isso evita carregamento desnecessario
4. **Crie um repositorio separado para a entidade filha** — `QuestionAttachmentsRepository` com `findManyByQuestionId`, porque sao tabelas diferentes e responsabilidades diferentes
5. **Na edicao, busque os itens atuais ANTES de comparar** — a lista dentro da entidade estara vazia apos o findById, porque o carregamento e lazy
6. **Use o metodo update da WatchedList para detectar diferencas** — `attachmentList.update(newAttachments)` calcula automaticamente added/removed items

## How to write

### Classe WatchedList tipada

```typescript
// question-attachment-list.ts
export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
```

### Entidade pai usando WatchedList no lugar de array

```typescript
// Na entidade Question, troque Array<QuestionAttachment> por QuestionAttachmentList
export class Question extends AggregateRoot<QuestionProps> {
  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
  }

  static create(props: Optional<QuestionProps, 'createdAt' | 'attachments'>) {
    return new Question({
      ...props,
      attachments: props.attachments ?? new QuestionAttachmentList([]),
      createdAt: props.createdAt ?? new Date(),
    })
  }
}
```

### Use case de edicao com WatchedList

```typescript
async execute({ questionId, authorId, title, content, attachmentIds }: EditQuestionRequest) {
  const question = await this.questionsRepository.findById(questionId)
  if (!question) throw new Error('Question not found')
  if (question.authorId.toString() !== authorId) throw new Error('Not allowed')

  // 1. Buscar anexos atuais separadamente
  const currentAttachments = await this.questionAttachmentsRepository
    .findManyByQuestionId(questionId)

  // 2. Criar WatchedList com itens atuais
  const questionAttachmentList = new QuestionAttachmentList(currentAttachments)

  // 3. Criar nova lista de anexos a partir dos IDs recebidos
  const questionAttachments = attachmentIds.map(id =>
    QuestionAttachment.create({ questionId: question.id, attachmentId: new UniqueEntityID(id) })
  )

  // 4. Comparar listas — detecta added e removed automaticamente
  questionAttachmentList.update(questionAttachments)

  // 5. Salvar lista atualizada na entidade
  question.attachments = questionAttachmentList

  await this.questionsRepository.save(question)
}
```

## Example

**Before (sem WatchedList — nao detecta diferencas):**

```typescript
// Substitui tudo cegamente, sem saber o que mudou
question.attachments = newAttachmentIds.map(id =>
  QuestionAttachment.create({ questionId: question.id, attachmentId: new UniqueEntityID(id) })
)
await this.questionsRepository.save(question)
```

**After (com WatchedList — detecta added/removed):**

```typescript
const currentAttachments = await this.questionAttachmentsRepository
  .findManyByQuestionId(questionId)
const attachmentList = new QuestionAttachmentList(currentAttachments)

const newAttachments = attachmentIds.map(id =>
  QuestionAttachment.create({ questionId: question.id, attachmentId: new UniqueEntityID(id) })
)

attachmentList.update(newAttachments)
question.attachments = attachmentList
await this.questionsRepository.save(question)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Entidade pai tem colecao de filhos editavel | Crie classe WatchedList tipada |
| findById da entidade pai | NAO carregue filhos automaticamente |
| Use case de edicao com itens relacionados | Busque itens atuais via repositorio separado antes de comparar |
| Testes acessam a lista de itens | Use `.currentItems` para acessar o array interno |
| Criando entidade com itens iniciais | `new QuestionAttachmentList(items)` no create |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `attachments: QuestionAttachment[]` na entidade | `attachments: QuestionAttachmentList` |
| `attachments: []` como valor padrao | `attachments: new QuestionAttachmentList([])` |
| `question.attachments = newArray` direto na edicao | `attachmentList.update(newArray); question.attachments = attachmentList` |
| `findById` retornando entidade com filhos carregados | Repositorio separado com `findManyByQuestionId` |
| `expect(question.attachments).toHaveLength(2)` | `expect(question.attachments.currentItems).toHaveLength(2)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
