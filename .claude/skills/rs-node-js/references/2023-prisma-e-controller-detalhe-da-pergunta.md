---
name: rs-node-js-2023-prisma-controller-detalhe
description: "Applies the Presenter and Mapper composition pattern when building NestJS controllers that return domain entities with relationships. Use when user asks to 'create a controller', 'return related data', 'map prisma to domain', 'create a presenter', or 'include relations in response'. Enforces mapper reuse inside other mappers, presenter reuse inside other presenters, and proper Prisma include for nested relations. Make sure to use this skill whenever building API responses that combine multiple entities. Not for simple CRUD without relations, database migrations, or unit test logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: presenter-mapper-composition
  tags: [presenter, mapper, composition, nestjs, prisma, include, clean-architecture, relationships]
---

# Presenter e Mapper com Composicao em NestJS

> Mappers convertem Prisma para dominio, presenters convertem dominio para HTTP — ambos sao composiveis e reutilizaveis entre si.

## Rules

1. **Reuse mappers dentro de mappers** — `PrismaQuestionDetailsMapper` usa `PrismaAttachmentMapper.toDomain()` internamente, porque evita duplicacao e garante consistencia na conversao
2. **Reuse presenters dentro de presenters** — `QuestionDetailsPresenter` usa `AttachmentPresenter.toHTTP()` no map de attachments, porque presenters tambem sao mappers (transformam formato)
3. **Sempre use Prisma `include` ao trazer relacoes** — TypeScript vai acusar erro se o mapper espera dados que o query nao trouxe, porque o tipo do Prisma reflete exatamente o que foi buscado
4. **Crie presenters especificos por shape de resposta** — `QuestionPresenter` e `QuestionDetailsPresenter` sao separados, porque cada endpoint retorna campos diferentes
5. **Valide campos opcionais no mapper** — `bestAnswerId` precisa de verificacao ternaria antes de criar `UniqueEntityID`, porque pode ser null
6. **Rode tsc e lint apos mudancas em repositorios** — alteracoes em interfaces propagam erros para testes e outros arquivos, porque TypeScript rastreia dependencias

## How to write

### Mapper composto (Prisma -> Domain)

```typescript
// infra/database/prisma/mappers/prisma-question-details-mapper.ts
import { PrismaAttachmentMapper } from './prisma-attachment-mapper'

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestion & {
    author: PrismaUser
    attachments: PrismaAttachment[]
  }): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      title: raw.title,
      slug: Slug.create(raw.slug),
      content: raw.content,
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
```

### Presenter composto (Domain -> HTTP)

```typescript
// infra/http/presenters/question-details-presenter.ts
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      author: questionDetails.author,
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      content: questionDetails.content,
      bestAnswerId: questionDetails.bestAnswerId?.toString(),
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
```

### Repository com include

```typescript
async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
  const question = await this.prisma.question.findUnique({
    where: { slug },
    include: {
      author: true,
      attachments: true,
    },
  })

  if (!question) return null

  return PrismaQuestionDetailsMapper.toDomain(question)
}
```

## Example

**Before (tudo inline, sem composicao):**
```typescript
// Mapper duplicando logica de attachment
static toDomain(raw) {
  return QuestionDetails.create({
    // ...
    attachments: raw.attachments.map(att => Attachment.create({
      title: att.title,
      url: att.url,
    }, new UniqueEntityID(att.id))),
  })
}

// Presenter duplicando logica de attachment
static toHTTP(details) {
  return {
    // ...
    attachments: details.attachments.map(att => ({
      id: att.id.toString(),
      title: att.title,
      url: att.url,
    })),
  }
}
```

**After (composicao de mappers e presenters):**
```typescript
// Mapper reutiliza PrismaAttachmentMapper
attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),

// Presenter reutiliza AttachmentPresenter
attachments: details.attachments.map(AttachmentPresenter.toHTTP),
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Endpoint retorna entidade com relacoes | Criar presenter especifico (ex: `QuestionDetailsPresenter`) |
| Mapper precisa converter sub-entidade | Reutilizar mapper existente via `.toDomain()` |
| Presenter precisa formatar sub-entidade | Reutilizar presenter existente via `.toHTTP()` |
| Campo opcional como `bestAnswerId` | Ternario: `raw.field ? new UniqueEntityID(raw.field) : null` |
| Alterou interface de repositorio | Rodar `tsc` para encontrar todos os arquivos afetados |
| Teste E2E precisa validar relacoes | Criar factories para cada entidade relacionada |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| Logica de conversao duplicada em mappers | `PrismaAttachmentMapper.toDomain` reutilizado |
| Um presenter generico para todos os endpoints | Presenter especifico por shape de resposta |
| Query sem `include` quando mapper espera relacoes | `include: { author: true, attachments: true }` |
| `bestAnswerId: new UniqueEntityID(raw.bestAnswerId)` sem null check | Ternario com verificacao de existencia |
| Testes E2E sem factories para entidades relacionadas | `AttachmentFactory` e `QuestionAttachmentFactory` nos providers |

## Troubleshooting

### Prisma retorna dados mas mapper falha com "Cannot read properties of undefined"
**Symptom:** O mapper tenta acessar `raw.attachments.map(...)` mas `raw.attachments` e `undefined`
**Cause:** A query no repositorio nao inclui `include: { attachments: true }`, entao o Prisma nao traz os dados do relacionamento
**Fix:** Adicione `include: { attachments: true, author: true }` na query do repositorio para que o Prisma traga todos os relacionamentos esperados pelo mapper

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
