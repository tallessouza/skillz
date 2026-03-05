# Code Examples: Prisma Schema — Relacionamentos e Polimorfismo

## Schema completo da aula

### Model Comment

```prisma
model Comment {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  authorId String @map("author_id")
  author   User   @relation(fields: [authorId], references: [id])

  questionId String?   @map("question_id")
  question   Question? @relation(fields: [questionId], references: [id])

  answerId String?  @map("answer_id")
  answer   Answer?  @relation(fields: [answerId], references: [id])

  @@map("comments")
}
```

### Model Attachment

```prisma
model Attachment {
  id    String @id @default(uuid())
  title String
  url   String

  questionId String?   @map("question_id")
  question   Question? @relation(fields: [questionId], references: [id])

  answerId String?  @map("answer_id")
  answer   Answer?  @relation(fields: [answerId], references: [id])

  @@map("attachments")
}
```

### Relacionamentos inversos nos models existentes

```prisma
model User {
  // ... campos existentes
  comments Comment[]
}

model Question {
  // ... campos existentes
  comments    Comment[]
  attachments Attachment[]
}

model Answer {
  // ... campos existentes
  comments    Comment[]
  attachments Attachment[]
}
```

## Abordagem polimorffica (descartada pelo instrutor)

```prisma
// NAO RECOMENDADO para Prisma com poucos relacionamentos
enum CommentType {
  QUESTION
  ANSWER
}

model Comment {
  id       String      @id @default(uuid())
  content  String
  parentId String      @map("parent_id") // SEM foreign key - perde integridade
  type     CommentType

  @@index([parentId])
  @@map("comments")
}
```

**Problemas desta abordagem:**
1. `parentId` nao tem `@relation` — nenhuma FK no banco
2. Prisma nao gera metodos de navegacao (`.question`, `.answer`)
3. Queries manuais necessarias para resolver o relacionamento
4. Sem cascade delete automatico

## Migration

```bash
pnpm prisma migrate dev
# Nomear: "create comments and attachments"
```

## Variacao: se fosse necessario polimorfismo real

Para cenarios com muitas tabelas (40+), a implementacao seria:

```prisma
enum ParentType {
  QUESTION
  ANSWER
  ARTICLE
  TUTORIAL
  // ... muitos outros
}

model Comment {
  id       String     @id @default(uuid())
  content  String
  parentId String     @map("parent_id")
  type     ParentType

  @@index([parentId, type])
  @@map("comments")
}
```

E no codigo da aplicacao, resolver manualmente:

```typescript
async function getCommentParent(comment: Comment) {
  switch (comment.type) {
    case 'QUESTION':
      return prisma.question.findUnique({ where: { id: comment.parentId } })
    case 'ANSWER':
      return prisma.answer.findUnique({ where: { id: comment.parentId } })
    // ...
  }
}
```