# Code Examples: Criando Schema do Prisma

## Schema completo da aula

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  STUDENT
  INSTRUCTOR
}

model User {
  id       String   @id @default(uuid())
  name     String
  email    String   @unique
  password String
  role     UserRole @default(STUDENT)

  questions Question[]
  answers   Answer[]

  @@map("users")
}

model Question {
  id           String    @id @default(uuid())
  title        String
  slug         String    @unique
  content      String
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime? @updatedAt @map("updated_at")
  authorId     String    @map("author_id")
  bestAnswerId String?   @unique @map("best_answer_id")

  author     User     @relation(fields: [authorId], references: [id])
  bestAnswer Answer?  @relation("bestAnswer", fields: [bestAnswerId], references: [id])
  answers    Answer[] @relation("questionAnswers")

  @@map("questions")
}

model Answer {
  id         String    @id @default(uuid())
  content    String
  createdAt  DateTime  @default(now()) @map("created_at")
  updatedAt  DateTime? @updatedAt @map("updated_at")
  authorId   String    @map("author_id")
  questionId String    @map("question_id")

  author       User      @relation(fields: [authorId], references: [id])
  question     Question  @relation("questionAnswers", fields: [questionId], references: [id])
  bestAnswerOn Question? @relation("bestAnswer")

  @@map("answers")
}
```

## Mapper atualizado com bestAnswerId

```typescript
// prisma-question-mapper.ts
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        slug: raw.slug,
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityId(raw.bestAnswerId)
          : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }
}
```

## Entity props com null

```typescript
// question.ts (domain entity)
export interface QuestionProps {
  title: string
  slug: string
  content: string
  authorId: UniqueEntityId
  bestAnswerId: UniqueEntityId | null  // null, nao apenas undefined
  createdAt: Date
  updatedAt: Date | null
}

// Setter que aceita null
set bestAnswerId(value: UniqueEntityId | null | undefined) {
  this.props.bestAnswerId = value ?? null
  this.touch()
}
```

## Rodando a migration

```bash
# Criar migration com nome descritivo
pnpm prisma migrate dev --name create-answers-and-user-role

# Restart do TS Server no VS Code (se tipos nao atualizarem)
# Cmd+Shift+P → TypeScript: Restart TS Server
```

## Variacao: adicionando mais tabelas depois

```prisma
// Tabelas futuras mencionadas (nao implementadas nesta aula)
model Attachment {
  id         String @id @default(uuid())
  title      String
  url        String
  questionId String? @map("question_id")
  answerId   String? @map("answer_id")

  question Question? @relation(fields: [questionId], references: [id])
  answer   Answer?   @relation(fields: [answerId], references: [id])

  @@map("attachments")
}

model Comment {
  id         String   @id @default(uuid())
  content    String
  createdAt  DateTime @default(now()) @map("created_at")
  authorId   String   @map("author_id")
  questionId String?  @map("question_id")
  answerId   String?  @map("answer_id")

  author   User      @relation(fields: [authorId], references: [id])
  question Question? @relation(fields: [questionId], references: [id])
  answer   Answer?   @relation(fields: [answerId], references: [id])

  @@map("comments")
}
```