---
name: rs-node-js-2023-persistindo-anexos-no-banco
description: "Applies cross-repository persistence patterns when implementing Prisma repositories in clean architecture NestJS projects. Use when user asks to 'persist related entities', 'save attachments', 'implement prisma repository', 'create many related records', or 'map domain entities to database operations'. Enforces correct ordering of dependent inserts, Promise.all for independent operations, and domain-to-persistence mapping that breaks 1:1 entity-row assumptions. Make sure to use this skill whenever implementing repository methods that touch multiple related tables. Not for in-memory repositories, domain layer logic, or controller route definitions."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: prisma-repositories
  tags: [prisma, cross-repository, persistence, promise-all, mapper, nestjs, clean-architecture]
---

# Persistindo Anexos no Banco (Cross-Repository Persistence)

> Criar uma entidade no dominio nao significa criar um registro no banco — pode significar atualizar ou ate deletar uma linha existente.

## Rules

1. **Injete repositorios dependentes no repositorio pai** — `QuestionsRepository` recebe `QuestionAttachmentsRepository` como dependencia, porque persistencia de agregados exige coordenacao entre repositorios
2. **Respeite ordem de foreign keys no create** — crie o registro pai ANTES dos filhos, porque a foreign key precisa existir no banco
3. **Use Promise.all para operacoes independentes** — no update, createMany + deleteMany + save podem rodar simultaneamente, porque nao ha dependencia entre eles
4. **Retorne cedo se a lista estiver vazia** — `if (attachments.length === 0) return`, porque evita operacoes desnecessarias no banco
5. **createMany no dominio pode ser updateMany no banco** — criar um QuestionAttachment significa atualizar o `questionId` de um Attachment existente, nao inserir nova linha
6. **Mapper associado ao repositorio** — se o repositorio e do Prisma, o mapper pode ter metodos especificos do Prisma como `toPrismaUpdateMany`

## How to write

### Repository com dependencia de outro repository

```typescript
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({ data })

    // DEPOIS do create — precisa da foreign key
    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    // Operacoes independentes — rodam em paralelo
    await Promise.all([
      this.prisma.question.update({ where: { id: data.id }, data }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
    ])
  }
}
```

### createMany que faz updateMany no banco

```typescript
async createMany(attachments: QuestionAttachment[]): Promise<void> {
  if (attachments.length === 0) return

  const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments)

  await this.prisma.attachment.updateMany(data)
}
```

### Mapper com metodo especifico para updateMany

```typescript
export class PrismaQuestionAttachmentMapper {
  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((a) => a.attachmentId.toString())

    return {
      where: { id: { in: attachmentIds } },
      data: { questionId: attachments[0].questionId.toString() },
    }
  }
}
```

### deleteMany

```typescript
async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
  if (attachments.length === 0) return

  const attachmentIds = attachments.map((a) => a.attachmentId.toString())

  await this.prisma.attachment.deleteMany({
    where: { id: { in: attachmentIds } },
  })
}
```

## Example

**Before (ingenuidade 1:1 dominio-banco):**
```typescript
// ERRADO: tentando inserir nova linha para cada attachment
async createMany(attachments: QuestionAttachment[]) {
  for (const att of attachments) {
    await this.prisma.questionAttachment.create({
      data: { questionId: att.questionId, attachmentId: att.attachmentId }
    })
  }
}
```

**After (entendendo que criar no dominio = atualizar no banco):**
```typescript
async createMany(attachments: QuestionAttachment[]) {
  if (attachments.length === 0) return

  const attachmentIds = attachments.map((a) => a.attachmentId.toString())

  await this.prisma.attachment.updateMany({
    where: { id: { in: attachmentIds } },
    data: { questionId: attachments[0].questionId.toString() },
  })
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| create com filhos dependentes | await pai, depois await filhos (sequencial) |
| update com operacoes independentes | Promise.all com todas as operacoes |
| Lista vazia de entidades | Return cedo, sem tocar o banco |
| Mapper precisa de metodo especifico do ORM | Crie no mapper — ele e acoplado ao repositorio |
| Prisma transaction entre arquivos diferentes | Nao suportado — use Promise.all como alternativa |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `create` pai e filhos em paralelo com FK | `await` pai primeiro, depois filhos |
| Loop com `await` individual para cada filho | `updateMany` / `deleteMany` em batch |
| Mapper generico sem metodos especificos do ORM | Mapper com `toPrismaUpdateMany` quando necessario |
| Operacoes independentes em sequencia | `Promise.all([op1, op2, op3])` |
| Executar query com lista vazia | `if (items.length === 0) return` |

## Troubleshooting

### Foreign key violation ao criar entidade pai e filhos simultaneamente
**Symptom:** Erro de constraint violation ao inserir registros filhos que referenciam o pai
**Cause:** `Promise.all` executa create do pai e filhos em paralelo, mas os filhos precisam da FK do pai
**Fix:** Use `await` sequencial: primeiro crie o pai, depois os filhos. `Promise.all` so para operacoes independentes (update)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
