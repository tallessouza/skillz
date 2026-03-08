---
name: 2023-criando-pergunta-com-anexos
description: "Implements the DDD Aggregate pattern for entities with sub-entities (attachments) by receiving pre-created IDs and persisting through the aggregate root repository. Use when user asks to 'create entity with attachments', 'implement aggregate root', 'handle sub-entities in DDD', or 'separate upload from creation'. Enforces: receive attachment IDs not files, use setter to resolve circular dependency, persist sub-entities through aggregate root repository. Make sure to use this skill whenever modeling parent-child entity relationships following DDD aggregate patterns. Not for file upload implementation, simple CRUD without DDD, or frontend file handling."
category: coding-lens
tags: [attachments, ddd, entities, repository, typescript, use-cases]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: ddd-aggregate
  tags: [ddd, attachments, aggregate-root, entities, use-cases, typescript]
---

# Criando Entidade com Anexos (DDD Aggregate Pattern)

> Ao criar entidades com sub-entidades (anexos), receba apenas IDs previamente criados e persista tudo pelo repositorio do aggregate root.

## Rules

1. **Receba IDs, nao arquivos** — o use case recebe `attachmentIds: string[]`, nao os arquivos em si, porque separar upload de criacao evita MultipartFormData e simplifica tanto front quanto back
2. **Use setter para resolver dependencia circular** — crie a entidade pai sem filhos, depois injete os filhos via setter, porque o filho precisa do ID do pai que so existe apos criacao
3. **Persista sub-entidades pelo aggregate root repository** — o `QuestionsRepository.create()` deve salvar tambem os anexos, porque no DDD o repositorio do aggregate root gerencia todas as entidades do agregado
4. **Propriedade de anexos opcional na criacao** — nem toda entidade tera anexos, entao `attachments` deve ter default `[]` no metodo `create`
5. **Mantenha ordem consistente** — props, getters e setters seguem a mesma ordem para organizacao

## How to write

### Props com attachments opcional

```typescript
interface QuestionProps {
  authorId: UniqueEntityId
  title: string
  content: string
  attachments: QuestionAttachment[] // sub-entidade tipada
  createdAt: Date
}

// No metodo create, default vazio
static create(props: Optional<QuestionProps, 'attachments' | 'createdAt'>) {
  return new Question({
    ...props,
    attachments: props.attachments ?? [],
    createdAt: props.createdAt ?? new Date(),
  })
}
```

### Getter e Setter para attachments

```typescript
get attachments() {
  return this.props.attachments
}

set attachments(attachments: QuestionAttachment[]) {
  this.props.attachments = attachments
}
```

### Use case com IDs → sub-entidades

```typescript
interface CreateQuestionRequest {
  authorId: string
  title: string
  content: string
  attachmentIds: string[] // IDs, nao arquivos
}

async execute({ authorId, title, content, attachmentIds }: CreateQuestionRequest) {
  const question = Question.create({
    authorId: new UniqueEntityId(authorId),
    title,
    content,
  })

  // Criar sub-entidades DEPOIS do pai (resolve dependencia circular)
  const questionAttachments = attachmentIds.map((id) =>
    QuestionAttachment.create({
      attachmentId: new UniqueEntityId(id),
      questionId: question.id,
    }),
  )

  // Injetar via setter
  question.attachments = questionAttachments

  await this.questionsRepository.create(question)

  return { question }
}
```

## Example

**Before (upload junto com criacao — problematico):**
```typescript
// Recebe arquivos junto com dados — requer MultipartFormData
async execute({ authorId, title, content, files }: CreateQuestionRequest) {
  const question = Question.create({ authorId, title, content })
  // Upload dentro do use case — mistura responsabilidades
  const attachments = await this.uploadService.upload(files)
  await this.questionsRepository.create(question)
  await this.attachmentsRepository.create(attachments) // repositorio separado — errado em DDD
}
```

**After (pre-upload + aggregate root):**
```typescript
// Recebe apenas IDs — upload ja foi feito em rota separada
async execute({ authorId, title, content, attachmentIds }: CreateQuestionRequest) {
  const question = Question.create({
    authorId: new UniqueEntityId(authorId),
    title,
    content,
  })

  const questionAttachments = attachmentIds.map((id) =>
    QuestionAttachment.create({
      attachmentId: new UniqueEntityId(id),
      questionId: question.id,
    }),
  )

  question.attachments = questionAttachments
  // Repositorio do aggregate root persiste tudo
  await this.questionsRepository.create(question)

  return { question }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Entidade pai tem sub-entidades | Receber IDs, criar sub-entidades no use case, injetar via setter |
| Upload de arquivos | Rota separada retorna IDs, rota de criacao recebe so IDs (JSON puro) |
| Persistencia de agregado | Um unico repositorio (aggregate root) salva pai + filhos |
| Repositorio in-memory | Salva entidade inteira, sub-entidades vem junto automaticamente |
| Repositorio real (banco) | Deve implementar logica de salvar filhos na mesma transacao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `attachmentsRepository.create(attachments)` separado | `questionsRepository.create(question)` com anexos dentro |
| Receber `files: File[]` no use case de criacao | Receber `attachmentIds: string[]` |
| Criar anexos antes do pai sem resolver ID | Criar pai primeiro, depois anexos com `question.id`, injetar via setter |
| Upload + criacao na mesma rota MultipartFormData | Rota de upload separada + rota de criacao JSON |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
