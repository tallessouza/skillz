---
name: rs-node-js-2023-criando-pergunta-com-anexos
description: "Enforces correct attachment association patterns in NestJS clean architecture when implementing entity relationships with pre-existing records. Use when user asks to 'create question with attachments', 'associate attachments', 'implement file upload relationship', 'fix attachment mapping', or 'debug entity relationship mapping'. Applies rules: attachments must exist before association, use correct ID field in mappers (attachmentId not entity id), create factories for E2E tests. Make sure to use this skill whenever implementing many-to-many relationships through pivot entities in clean architecture. Not for file upload handling, storage configuration, or simple CRUD without relationships."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
