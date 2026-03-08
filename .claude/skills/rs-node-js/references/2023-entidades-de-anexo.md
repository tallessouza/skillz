---
name: 2023-entidades-de-anexo
description: "Implements the Bridge Entity Pattern for attachments that belong to multiple parent types, creating separate bridge entities (QuestionAttachment, AnswerAttachment) instead of polymorphic parentId+parentType. Use when user asks to 'model attachments for multiple parents', 'avoid polymorphic relationships', 'create bridge entity', or 'connect entity to multiple parent types'. Make sure to use this skill whenever an entity needs to belong to two or more different parent types in a DDD context. Not for simple one-to-many relationships, database pivot tables, or frontend file upload components."
category: coding-lens
tags: [attachments, ddd, entities, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: entidades-dominio
  tags: [attachments, bridge-entity, ddd, entities, polymorphism, typescript]
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

## Troubleshooting

### Logica condicional para resolver tipo de pai ao buscar anexos
**Symptom:** Codigo com `if (parentType === 'question')` espalhado para saber de qual tabela buscar
**Cause:** Uso de polimorfismo com `parentId` + `parentType` ao inves de bridge entities separadas
**Fix:** Crie bridge entities explicitas (`QuestionAttachment`, `AnswerAttachment`) — cada uma conecta ao tipo de pai sem ambiguidade

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
