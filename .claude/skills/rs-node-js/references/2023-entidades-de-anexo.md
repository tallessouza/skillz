---
name: rs-node-js-2023-entidades-de-anexo
description: "Enforces the bridge/pivot entity pattern when connecting a shared entity to multiple parent entities in DDD. Use when user asks to 'create an attachment entity', 'connect entity to multiple parents', 'share entity across aggregates', 'link child to different parent types', or designs polymorphic relationships. Applies rules: separate bridge entities per parent type instead of polymorphic parent_id+type, shared base entity for reusable data, bridge holds only foreign IDs. Make sure to use this skill whenever modeling N:N or shared-child relationships in domain-driven design. Not for database schema design, ORM configuration, or REST API endpoints."
---

# Entidades de Anexo — Bridge Entity Pattern

> Quando uma entidade pertence a multiplos tipos de pai, crie entidades-ponte separadas por tipo de pai em vez de usar polimorfismo com parent_id + parent_type.

## Rules

1. **Entidade base compartilhada** — crie uma entidade `Attachment` com os dados proprios (title, link), porque esses dados sao identicos independente do pai
2. **Uma bridge entity por tipo de pai** — crie `QuestionAttachment` e `AnswerAttachment` separadamente, porque cada ponte conecta explicitamente dois tipos sem ambiguidade
3. **Bridge so contem IDs** — a ponte armazena apenas `questionId` + `attachmentId` (ou `answerId` + `attachmentId`), porque dados de dominio ficam na entidade base
4. **Evite polimorfismo com parent_type** — nao use `parentId` + `parentType: 'question' | 'answer'`, porque na camada de persistencia voce nao sabera de qual tabela buscar sem logica condicional
5. **Bridge estende Entity** — mesmo que nao vire tabela no banco, estender Entity permite ter ID unico e integracao futura com repositorios
6. **Novas conexoes = nova bridge** — se comentarios tambem tiverem anexos, crie `CommentAttachment` seguindo o mesmo padrao, porque cada conexao e explicita

## How to write

### Entidade base (dados compartilhados)

```typescript
interface AttachmentProps {
  title: string
  link: string
}

export class Attachment extends Entity<AttachmentProps> {
  get title() { return this.props.title }
  get link() { return this.props.link }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    const attachment = new Attachment(props, id)
    return attachment
  }
}
```

### Bridge entity (conexao com o pai)

```typescript
interface QuestionAttachmentProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() { return this.props.questionId }
  get attachmentId() { return this.props.attachmentId }

  static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
    const questionAttachment = new QuestionAttachment(props, id)
    return questionAttachment
  }
}
```

## Example

**Before (polimorfismo — ambiguo):**
```typescript
interface AttachmentProps {
  title: string
  link: string
  parentId: UniqueEntityID
  parentType: 'question' | 'answer' // precisa de logica condicional pra resolver
}
```

**After (bridge entities — explicito):**
```typescript
// Entidade base
class Attachment extends Entity<{ title: string; link: string }> {}

// Bridges separadas — sem ambiguidade
class QuestionAttachment extends Entity<{ questionId: UniqueEntityID; attachmentId: UniqueEntityID }> {}
class AnswerAttachment extends Entity<{ answerId: UniqueEntityID; attachmentId: UniqueEntityID }> {}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Entidade filha pertence a um unico tipo de pai | Coloque o parentId direto na entidade filha |
| Entidade filha pertence a 2+ tipos de pai | Crie bridge entities separadas |
| Bridge pode virar tabela pivo no banco | Estenda Entity para ter ID proprio |
| Precisa de polimorfismo real (comportamento diferente) | Use polimorfismo — bridge e para conexao, nao comportamento |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `parentId: UniqueEntityID` + `parentType: string` | Bridge entity separada por tipo de pai |
| Dados do anexo dentro de QuestionAttachment | Dados no Attachment base, bridge so com IDs |
| Uma unica classe `AttachmentRelation` generica | Classes explicitas: `QuestionAttachment`, `AnswerAttachment` |
| Props opcionais `questionId?: ...` `answerId?: ...` na mesma classe | Uma bridge por pai, todas props obrigatorias |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-entidades-de-anexo/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-entidades-de-anexo/references/code-examples.md)
