---
name: rs-node-js-2023-teste-edicao-pergunta
description: "Enforces testing patterns for edit use cases with WatchedList and relationship repositories in DDD. Use when user asks to 'test edit', 'test update use case', 'write tests for editing entities with attachments', or 'test watched list behavior'. Applies rules: pre-populate relationship repositories, verify add/remove operations via ids, test unauthorized edits with empty relations. Make sure to use this skill whenever writing tests for edit/update use cases that involve sub-entity lists (attachments, tags, items). Not for testing create use cases, unit testing domain entities, or testing delete operations."
---

# Teste de Edição com WatchedList

> Ao testar use cases de edição que envolvem listas de sub-entidades, pre-popule o repositório de relacionamentos e verifique que apenas as operações necessárias (add/remove) foram executadas.

## Rules

1. **Crie o repositório de relacionamentos in-memory** — o teste de edição precisa de dois repositórios: o da entidade principal e o da relação (ex: `InMemoryQuestionAttachmentsRepository`), porque a edição agora gerencia sub-entidades via WatchedList
2. **Pre-popule o repositório de relacionamentos antes de editar** — use `repository.items.push()` direto para simular estado existente no banco, porque o teste precisa de um estado inicial conhecido para verificar diff
3. **Use IDs explícitos nos attachments de teste** — passe `new UniqueEntityId('1')`, `new UniqueEntityId('2')` etc., porque facilita verificar quais foram adicionados/removidos após a edição
4. **Verifique quantidade E conteúdo da lista resultante** — cheque `items.length` e os IDs específicos dos itens, porque garantir só o length não detecta trocas incorretas
5. **Teste de edição não-autorizada pode usar lista vazia** — quando o teste verifica permissão (outro autor), a lista de attachments não importa, passe `[]` para simplificar

## How to write

### Setup do teste de edição com relacionamentos

```typescript
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

beforeEach(() => {
  inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
  inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
  sut = new EditQuestionUseCase(
    inMemoryQuestionsRepository,
    inMemoryQuestionAttachmentsRepository,
  )
})
```

### Pre-popular e executar edição

```typescript
// Criar pergunta
const newQuestion = makeQuestion({ authorId: new UniqueEntityId('author-1') })
await inMemoryQuestionsRepository.create(newQuestion)

// Pre-popular attachments (estado inicial: 1 e 2)
inMemoryQuestionAttachmentsRepository.items.push(
  makeQuestionAttachment({
    questionId: newQuestion.id,
    attachmentId: new UniqueEntityId('1'),
  }),
  makeQuestionAttachment({
    questionId: newQuestion.id,
    attachmentId: new UniqueEntityId('2'),
  }),
)

// Editar para attachments 1 e 3 (remove 2, adiciona 3)
await sut.execute({
  questionId: newQuestion.id.toValue(),
  authorId: 'author-1',
  title: 'Novo título',
  content: 'Novo conteúdo',
  attachmentsIds: ['1', '3'],
})
```

### Verificações

```typescript
expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
    expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
  ]),
)
```

## Example

**Before (teste sem verificar attachments):**
```typescript
it('should edit a question', async () => {
  const newQuestion = makeQuestion()
  await inMemoryQuestionsRepository.create(newQuestion)

  await sut.execute({
    questionId: newQuestion.id.toValue(),
    authorId: newQuestion.authorId.toValue(),
    title: 'Novo título',
    content: 'Novo conteúdo',
    attachmentsIds: ['1', '3'],
  })

  expect(inMemoryQuestionsRepository.items[0].title).toEqual('Novo título')
})
```

**After (teste completo com WatchedList):**
```typescript
it('should edit a question', async () => {
  const newQuestion = makeQuestion({ authorId: new UniqueEntityId('author-1') })
  await inMemoryQuestionsRepository.create(newQuestion)

  inMemoryQuestionAttachmentsRepository.items.push(
    makeQuestionAttachment({
      questionId: newQuestion.id,
      attachmentId: new UniqueEntityId('1'),
    }),
    makeQuestionAttachment({
      questionId: newQuestion.id,
      attachmentId: new UniqueEntityId('2'),
    }),
  )

  await sut.execute({
    questionId: newQuestion.id.toValue(),
    authorId: 'author-1',
    title: 'Novo título',
    content: 'Novo conteúdo',
    attachmentsIds: ['1', '3'],
  })

  expect(inMemoryQuestionsRepository.items[0].title).toEqual('Novo título')
  expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
  expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ]),
  )
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Teste de edição com sub-entidades | Pre-popule o repositório de relacionamentos com `.items.push()` |
| Verificar diff da WatchedList | Use IDs explícitos (1, 2, 3) e verifique o estado final |
| Teste de permissão (outro autor) | Passe `attachmentsIds: []`, foque no erro de autorização |
| Repositório in-memory não tem `create` | Use `.items.push()` direto — em testes isso é aceitável |
| Factory de relacionamento | Copie factory similar, adapte os campos (ex: `attachmentId` em vez de `authorId`) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| Teste de edição sem pre-popular relacionamentos | Pre-popule com `.items.push()` antes de executar |
| Verificar apenas `items.length` | Verificar length E IDs específicos com `arrayContaining` |
| IDs aleatórios nos attachments de teste | IDs explícitos (`'1'`, `'2'`, `'3'`) para facilitar assertions |
| Testar permissão com attachments complexos | `attachmentsIds: []` — o foco é o erro de autorização |
| Criar repositório in-memory sem `findManyByQuestionId` | Implementar filter por questionId (sem paginação para attachments) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
