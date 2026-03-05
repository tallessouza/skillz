---
name: rs-node-js-2023-anexos-nas-respostas
description: "Applies the Watched List and Aggregate pattern to replicate attachment handling across sibling entities in DDD projects. Use when user asks to 'add attachments to answers', 'replicate question pattern for answers', 'create answer attachments', or 'mirror entity structure for a new aggregate'. Ensures consistent repository, factory, use case, and test patterns when duplicating domain features. Make sure to use this skill whenever duplicating a domain pattern from one aggregate to a sibling aggregate. Not for creating attachments from scratch, file upload logic, or storage infrastructure."
---

# Anexos nas Respostas — Replicar Padrões de Agregado entre Entidades Irmãs

> Ao duplicar um padrão de domínio (ex: QuestionAttachment → AnswerAttachment), replique TODAS as camadas: entidade, watched list, repositório, use case, factory e testes.

## Rules

1. **Replique a estrutura completa** — entidade, lista observada (WatchedList), repositório, use case, factory e testes, porque esquecer uma camada causa erros de TypeScript ou comportamento inconsistente
2. **Use replace com preserve case** — ao renomear `Question` → `Answer`, use replace all com preserve case para manter `question`, `Question`, `QUESTION` consistentes
3. **Atualize construtores de repositórios in-memory** — quando o repositório principal (ex: InMemoryAnswersRepository) passa a depender do repositório de attachments, atualize o construtor e TODOS os testes que o instanciam
4. **Mantenha a mesma estrutura de WatchedList** — `AnswerAttachmentList` extende `WatchedList<AnswerAttachment>` exatamente como `QuestionAttachmentList`
5. **Attachments são opcionais na criação** — no `create`, se `props.attachments` existir use-o, senão crie `new AnswerAttachmentList([])`
6. **Adicione setter com touch** — o setter de attachments deve atualizar `updatedAt` para marcar a entidade como modificada

## Steps

### Step 1: Criar entidade e WatchedList

```typescript
// answer-attachment-list.ts
export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
```

### Step 2: Atualizar a entidade Answer

```typescript
// Na entidade Answer — adicionar campo, getter, setter e lógica no create
get attachments() {
  return this.props.attachments
}

set attachments(attachments: AnswerAttachmentList) {
  this.props.attachments = attachments
  this.touch() // marca updatedAt
}

static create(props, id?) {
  return new Answer({
    ...props,
    attachments: props.attachments ?? new AnswerAttachmentList([]),
    createdAt: props.createdAt ?? new Date(),
  }, id)
}
```

### Step 3: Criar repositório

```typescript
// answer-attachments-repository.ts
export interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
```

### Step 4: Atualizar use cases (Answer e Edit)

- No `AnswerQuestion`: criar attachments com `answerId` do resultado
- No `EditAnswer`: buscar attachments existentes, criar WatchedList, atualizar com novos IDs

### Step 5: Atualizar TODOS os testes

- Criar `InMemoryAnswerAttachmentsRepository`
- Criar `makeAnswerAttachment` factory
- Passar repositório como dependência em TODOS os testes que usam `InMemoryAnswersRepository`

## Heuristics

| Situação | Ação |
|----------|------|
| Entidade irmã precisa do mesmo recurso | Replique todas as camadas, não apenas a entidade |
| Replace de Question → Answer | Use preserve case para pegar todas as variações |
| Teste falhando após adicionar dependência | Verifique se TODOS os arquivos de teste instanciam o novo repositório |
| `npx tsc --noEmit` com erros | Passe por cada erro — geralmente são repositórios faltando como parâmetro |

## Anti-patterns

| Nunca faça | Faça instead |
|------------|-------------|
| Copiar só o use case sem o repositório | Replique repositório, factory, entidade e testes |
| Esquecer de passar o novo repo como dependência | Atualize o construtor do repo in-memory E todos os testes |
| Criar attachments como campo obrigatório | Use `props.attachments ?? new AnswerAttachmentList([])` |
| Setter sem touch | Sempre chame `this.touch()` no setter de attachments |
| Testar só o happy path | Teste create, edit e delete com attachments |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-anexos-nas-respostas/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-anexos-nas-respostas/references/code-examples.md)
