---
name: rs-node-js-2023-criando-schema-prisma
description: "Applies Prisma schema design patterns when creating or modifying database models in NestJS projects. Use when user asks to 'create a prisma schema', 'add a model', 'define relationships', 'create migration', or 'setup database tables'. Enforces enum usage, named relations for same-table references, unique constraints on one-to-one fields, optional field handling, and column mapping conventions. Make sure to use this skill whenever designing Prisma schemas with complex relationships. Not for query building, Prisma Client usage, or application-level data access patterns."
---

# Criando Schema do Prisma

> Ao definir schemas Prisma, modele relacionamentos explicitamente com nomes, constraints e mapeamentos que reflitam o dominio.

## Rules

1. **Use enums para campos com valores fixos** — `enum Role { STUDENT INSTRUCTOR }` em vez de String livre, porque o Postgres valida no nivel do banco e impede dados invalidos
2. **Defina defaults em campos opcionais** — `role UserRole @default(STUDENT)`, porque campos opcionais sem default geram nulls inesperados
3. **Nomeie relacionamentos quando houver multiplas referencias a mesma tabela** — `@relation("bestAnswer")` em ambos os lados, porque o Prisma nao consegue resolver ambiguidade automaticamente
4. **Use `@unique` em foreign keys de relacionamentos one-to-one** — `bestAnswerId String? @unique`, porque garante que uma answer so pode ser best answer de uma unica question
5. **Mapeie colunas para snake_case** — `@map("best_answer_id")`, porque o padrao do banco e snake_case mesmo que o Prisma use camelCase
6. **Campos opcionais de relacionamento aceitam null** — se `bestAnswerId` e opcional no schema, aceite `null` alem de `undefined` nos tipos do dominio, porque o Prisma retorna `null` para campos vazios

## How to write

### Enum com default

```prisma
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
```

### Relacionamento one-to-many basico

```prisma
model Answer {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt @map("updated_at")
  authorId  String   @map("author_id")
  questionId String  @map("question_id")

  author   User     @relation(fields: [authorId], references: [id])
  question Question @relation("questionAnswers", fields: [questionId], references: [id])

  @@map("answers")
}
```

### Dois relacionamentos com a mesma tabela (named relations)

```prisma
model Question {
  id           String   @id @default(uuid())
  title        String
  slug         String   @unique
  content      String
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime? @updatedAt @map("updated_at")
  authorId     String   @map("author_id")
  bestAnswerId String?  @unique @map("best_answer_id")

  author     User    @relation(fields: [authorId], references: [id])
  bestAnswer Answer? @relation("bestAnswer", fields: [bestAnswerId], references: [id])
  answers    Answer[] @relation("questionAnswers")

  @@map("questions")
}
```

## Example

**Before (schema incompleto, sem named relations):**
```prisma
model Question {
  id       String @id @default(uuid())
  title    String
  content  String
  authorId String
  bestAnswerId String?

  author     User    @relation(fields: [authorId], references: [id])
  bestAnswer Answer? @relation(fields: [bestAnswerId], references: [id])
  answers    Answer[]
}
```

**After (com named relations, unique, map e enum):**
```prisma
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
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Dois+ relacionamentos com a mesma tabela | Nomear todos os relacionamentos com `@relation("nome")` |
| Campo FK de relacao 1:1 opcional | Adicionar `@unique` na FK |
| Campo que vem do banco como `null` | Aceitar `null` no tipo do dominio, nao apenas `undefined` |
| Campo com valores fixos (role, status) | Criar `enum` no Prisma |
| Nome de coluna no banco difere do campo | Usar `@map("snake_case")` |
| Tabela precisa de nome customizado | Usar `@@map("plural_snake")` |

## Anti-patterns

| Nunca escreva | Escreva em vez |
|---------------|----------------|
| `role String` para valores fixos | `role UserRole @default(STUDENT)` com enum |
| Duas relations sem nome para mesma tabela | `@relation("nomeExplicito")` em cada par |
| `bestAnswerId String?` sem `@unique` | `bestAnswerId String? @unique` para garantir 1:1 |
| `authorId String @map("authorId")` | `authorId String @map("author_id")` em snake_case |
| Campo opcional sem tratar `null` no mapper | Verificar existencia antes de criar value object |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
