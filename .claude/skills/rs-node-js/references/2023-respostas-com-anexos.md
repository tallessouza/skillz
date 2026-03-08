---
name: rs-node-js-2023-respostas-com-anexos
description: "Applies the answer-with-attachments pattern when implementing NestJS clean architecture features that mirror existing question-attachment logic. Use when user asks to 'add attachments to answers', 'sync attachments on edit', 'create many-to-many relationships', or 'replicate question pattern for answers'. Enforces domain-first development, repository createMany/deleteMany, Prisma mapper toPrismaUpdateMany, and e2e test factories. Make sure to use this skill whenever extending entity-attachment relationships in clean architecture. Not for file upload handling, storage services, or unrelated NestJS CRUD."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: nestjs-clean-architecture
  tags: [nestjs, clean-architecture, attachments, repository, prisma, domain-first, watched-list]
---

# Respostas com Anexos (Clean Architecture)

> Ao replicar um padrao existente (Question → Answer), siga domain-first: repositorio → in-memory → caso de uso → mapper → prisma repository → controller → testes.

## Rules

1. **Comece pela camada de dominio** — adicione `createMany` e `deleteMany` no repositorio abstrato antes de tocar infra, porque o dominio define o contrato
2. **Replique com preserveCase** — ao copiar de QuestionAttachment para AnswerAttachment, use find-replace com preserveCase para manter `questionId` → `answerId` em camelCase e `QuestionId` → `AnswerId` em PascalCase
3. **Foreign key exige ordem** — no Prisma repository, chame `create` da entidade pai ANTES de `createMany` dos attachments, porque a foreign key falha se o pai nao existe
4. **Sync usa Promise.all** — no metodo `save`, execute `createMany` e `deleteMany` dos attachments em paralelo com o `update` da entidade pai via `Promise.all`
5. **Default array vazio nos controllers** — campos de attachments no body do controller devem ter default `[]` para nao quebrar endpoints que nao enviam anexos
6. **Testes e2e precisam de factories** — crie `makeAnswerAttachment` factory (Prisma) espelhando `makeQuestionAttachment` para testes de integracao

## How to write

### Repository abstrato

```typescript
// answer-attachments-repository.ts (dominio)
export abstract class AnswerAttachmentsRepository {
  abstract createMany(attachments: AnswerAttachment[]): Promise<void>
  abstract deleteMany(attachments: AnswerAttachment[]): Promise<void>
  // ... findManyByAnswerId, deleteManyByAnswerId
}
```

### In-Memory Repository

```typescript
// in-memory-answer-attachments-repository.ts
async createMany(attachments: AnswerAttachment[]) {
  this.items.push(...attachments)
}

async deleteMany(attachments: AnswerAttachment[]) {
  this.items = this.items.filter(item =>
    !attachments.some(a => a.equals(item))
  )
}
```

### Prisma Repository (ordem importa)

```typescript
// prisma-answers-repository.ts
async create(answer: Answer) {
  const data = PrismaAnswerMapper.toPrisma(answer)
  await this.prisma.answer.create({ data })

  // DEPOIS do create — foreign key exige que answer exista
  await this.answerAttachmentsRepository.createMany(
    answer.attachments.getItems()
  )
}

async save(answer: Answer) {
  const data = PrismaAnswerMapper.toPrisma(answer)

  await Promise.all([
    this.prisma.answer.update({ where: { id: data.id }, data }),
    this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems()
    ),
    this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems()
    ),
  ])
}
```

### Controller com default

```typescript
// answer-question.controller.ts
const bodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
})
```

## Example

**Before (sem attachments no answer):**
```typescript
async create(answer: Answer) {
  const data = PrismaAnswerMapper.toPrisma(answer)
  await this.prisma.answer.create({ data })
  // attachments ignorados
}
```

**After (com attachments sincronizados):**
```typescript
async create(answer: Answer) {
  const data = PrismaAnswerMapper.toPrisma(answer)
  await this.prisma.answer.create({ data })
  await this.answerAttachmentsRepository.createMany(
    answer.attachments.getItems()
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Entidade ja tem padrao similar (Question) | Replique com find-replace preserveCase |
| Mapper precisa de toPrismaUpdateMany | Copie do mapper existente, troque questionId por answerId |
| Teste unitario de sync | Crie attachment 1,2 → edite para 1,3 → verifique que 2 sumiu |
| Teste e2e de create com attachments | Crie attachments via factory, passe ids no body, verifique no banco |
| Campo optional no body | Use `.default([])` no Zod schema |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `createMany` antes do `create` do pai | `create` pai primeiro, `createMany` attachments depois |
| Copiar sem trocar `questionId` por `answerId` no mapper | Usar find-replace com preserveCase |
| Teste e2e sem factory do Prisma | Criar factory `makeAnswerAttachment` com `PrismaService` |
| Enviar attachments obrigatorio no edit | Usar `z.array().default([])` para campo opcional |
| Sync sequencial (await + await) | `Promise.all([update, createMany, deleteMany])` |

## Troubleshooting

### Foreign key constraint violation ao criar answer com attachments
**Symptom:** Prisma throws foreign key constraint error when creating answer with attachments
**Cause:** `createMany` dos attachments executado antes do `create` da answer — a foreign key referencia uma answer que ainda nao existe
**Fix:** Sempre execute `prisma.answer.create()` primeiro, depois `answerAttachmentsRepository.createMany()` na sequencia

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
