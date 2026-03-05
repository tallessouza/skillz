---
name: rs-node-js-2023-editando-perguntas-anexos
description: "Applies the WatchedList pattern for editing entities with attachments in NestJS Clean Architecture. Use when user asks to 'edit entity with relations', 'update attachments', 'manage many-to-many edits', 'handle aggregate list updates', or 'implement edit with file uploads'. Ensures correct insertion/removal of related entities through tracked lists. Make sure to use this skill whenever editing an entity that has a list of related sub-entities (attachments, tags, items). Not for simple CRUD without sub-entity management or file upload mechanics."
---

# Editando Entidades com Anexos (WatchedList Pattern)

> Ao editar uma entidade que possui uma lista de sub-entidades relacionadas, use o WatchedList para rastrear inserções e remoções automaticamente.

## Rules

1. **Receba os IDs das sub-entidades no controller** — o body do edit deve incluir `attachments: string[]` com os IDs atuais, porque o frontend envia a lista completa de anexos desejados após a edição
2. **Delegue a comparação ao WatchedList** — nunca compare manualmente o que foi adicionado/removido, porque o WatchedList já rastreia `getNewItems()` e `getRemovedItems()` automaticamente
3. **Crie factories de relacionamento nos testes E2E** — para testar edição com anexos, crie uma factory que faz `update` (não `create`), porque o relacionamento é feito atualizando o `questionId` de um attachment já existente
4. **Teste a edição verificando o estado final no banco** — após editar, consulte os attachments no banco e verifique que apenas os esperados existem, porque garantir a remoção dos antigos é tão importante quanto a inserção dos novos
5. **O attachment pré-existe antes do relacionamento** — o usuário faz upload primeiro (cria o attachment), depois ao salvar/editar a pergunta, os IDs são relacionados, porque o fluxo é: upload → coleta IDs → submit formulário

## How to write

### Controller recebendo attachments no edit

```typescript
// edit-question.controller.ts
const bodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

// Dentro do handler:
const { title, content, attachments } = body
await this.editQuestion.execute({
  questionId,
  authorId: userId,
  title,
  content,
  attachmentsIds: attachments,
})
```

### Factory de relacionamento para testes (QuestionAttachmentFactory)

```typescript
@Injectable()
export class QuestionAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    data: Partial<QuestionAttachmentProps>,
  ): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(data)

    // Relacionamento = UPDATE, não CREATE
    await this.prisma.attachment.update({
      where: { id: questionAttachment.attachmentId.toString() },
      data: { questionId: questionAttachment.questionId.toString() },
    })

    return questionAttachment
  }
}
```

### Teste E2E de edição com anexos

```typescript
// 1. Cria a pergunta
const question = await questionFactory.makePrismaQuestion({ authorId: user.id })

// 2. Cria attachments (upload prévio)
const attachment1 = await attachmentFactory.makePrismaAttachment()
const attachment2 = await attachmentFactory.makePrismaAttachment()
const attachment3 = await attachmentFactory.makePrismaAttachment()

// 3. Relaciona 1 e 2 com a pergunta (estado inicial)
await questionAttachmentFactory.makePrismaQuestionAttachment({
  attachmentId: attachment1.id,
  questionId: question.id,
})
await questionAttachmentFactory.makePrismaQuestionAttachment({
  attachmentId: attachment2.id,
  questionId: question.id,
})

// 4. Edita: envia 1 e 3 (remove 2, adiciona 3)
const response = await request(app.getHttpServer())
  .put(`/questions/${question.id.toString()}`)
  .send({
    title: 'Updated title',
    content: 'Updated content',
    attachments: [attachment1.id.toString(), attachment3.id.toString()],
  })

// 5. Verifica estado final
const attachmentsOnDatabase = await prisma.attachment.findMany({
  where: { questionId: question.id.toString() },
})

expect(attachmentsOnDatabase).toHaveLength(2)
expect(attachmentsOnDatabase).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ id: attachment1.id.toString() }),
    expect.objectContaining({ id: attachment3.id.toString() }),
  ]),
)
```

## Heuristics

| Situação | Faça |
|----------|------|
| Editando entidade com lista de sub-entidades | Receba array de IDs no body, use WatchedList para diff |
| Factory de relacionamento N:N | Use `update` no registro existente, não `create` |
| Testando edição | Crie estado inicial com relacionamentos, edite, verifique estado final |
| Fluxo de upload + formulário | Upload cria attachment → formulário envia IDs → backend relaciona |
| Verificando remoção no teste | Consulte banco e confirme que apenas os IDs esperados sobreviveram |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Deletar todos os anexos e recriar na edição | Use WatchedList para computar diff (inserções e remoções) |
| `prisma.attachment.create()` para relacionar | `prisma.attachment.update({ questionId })` porque o attachment já existe |
| Testar edição sem estado inicial de anexos | Crie attachments e relacionamentos antes de chamar o edit |
| Verificar apenas o count após edição | Verifique os IDs específicos para garantir que os corretos sobreviveram |
| Comparar listas manualmente no use case | Delegue ao WatchedList que já implementa o tracking |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-editando-perguntas-com-anexos/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-editando-perguntas-com-anexos/references/code-examples.md)
