---
name: 2023-criando-pergunta-com-anexos-2024
description: "Implements entity-attachment association in NestJS/Prisma using correct mapper IDs and dedicated test factories. Use when user asks to 'associate attachments with entities', 'create attachment mappers', 'test entity with attachments E2E', or 'fix attachment ID mapping'. Enforces: use attachmentId not pivot id in mappers, create separate factories for base entities and pivots, verify associations in database after creation. Make sure to use this skill whenever implementing entity-attachment relationships with Prisma mappers in NestJS. Not for file upload logic, frontend attachment UI, or domain-only attachment modeling."
category: coding-lens
tags: [attachments, entities, error-handling, nestjs, prisma, repository]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: nestjs-prisma
  tags: [attachments, prisma, nestjs, mappers, e2e-testing, factories]
---

# Criando Pergunta com Anexos

> Ao associar entidades pre-existentes (como anexos) a uma entidade nova (como pergunta), use o ID do recurso original no mapper, nunca o ID da entidade pivot.

## Rules

1. **Anexos devem existir antes da associacao** — crie os attachments previamente via upload, depois associe pelo ID ao criar a pergunta, porque o fluxo e: upload → create question com attachment IDs
2. **Use attachmentId no mapper, nao id** — no PrismaQuestionAttachmentMapper, use `attachmentId` para identificar o anexo, porque `id` e o ID da entidade pivot (gerado automaticamente) e nao referencia o anexo real
3. **Crie factories especificas para cada entidade** — alem de `makeQuestionAttachment` (pivot), crie `makeAttachment` (entidade base), porque testes E2E precisam de registros reais no banco
4. **Teste a associacao, nao apenas a criacao** — apos criar a pergunta, verifique no banco que os attachments foram associados com `findMany({ where: { questionId } })`, porque criar a pergunta sem verificar anexos esconde bugs silenciosos

## How to write

### Factory de Attachment

```typescript
// factories/make-attachment.ts
export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  )
  return attachment
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(
    data: Partial<AttachmentProps> = {},
  ): Promise<Attachment> {
    const attachment = makeAttachment(data)
    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })
    return attachment
  }
}
```

### Mapper corrigido

```typescript
// prisma-question-attachment-mapper.ts
export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type.')
    }
    return QuestionAttachment.create(
      {
        // CORRETO: usar raw.id que e o ID do attachment real
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    )
  }
}
```

## Example

**Before (bug — usa id da entidade pivot):**
```typescript
// No mapper, usando o ID errado
static toPrisma(questionAttachment: QuestionAttachment) {
  return {
    id: questionAttachment.id.toString(), // ID da pivot, NAO do anexo
    questionId: questionAttachment.questionId.toString(),
  }
}
```

**After (corrigido — usa attachmentId):**
```typescript
static toPrisma(questionAttachment: QuestionAttachment) {
  return {
    id: questionAttachment.attachmentId.toString(), // ID real do anexo
    questionId: questionAttachment.questionId.toString(),
  }
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Entidade pivot com ID proprio + ID do recurso | Sempre use o ID do recurso no mapper para Prisma |
| Teste E2E precisa de registro pre-existente | Crie factory dedicada que salva no banco |
| `createMany` recebe array vazio | Verifique se o mapper esta usando o campo correto |
| Teste falha com "expected [] to have length 2" | Debug com console.log em cada camada: controller → use case → repository → mapper |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Enviar attachments inline ao criar pergunta | Criar attachments antes, enviar apenas IDs |
| Usar `id` da pivot para referenciar o anexo | Usar `attachmentId` no mapper |
| Reutilizar factory de pivot como factory de entidade | Criar factory separada para cada entidade |
| Testar apenas criacao da pergunta | Testar tambem que attachments foram associados no banco |
| Confiar que `currentItems` esta correto sem verificar | Adicionar console.log em `createMany` para debug |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
