---
name: rs-node-js-2023-prisma-schema-relations
description: "Applies Prisma schema design patterns when creating models, relationships, and handling polymorphic associations. Use when user asks to 'create a prisma model', 'add database relations', 'design schema', 'handle polymorphic tables', or 'prisma migrate'. Enforces optional foreign keys over polymorphic enums when relating to few tables, proper field mapping with underscores, and correct relationship setup. Make sure to use this skill whenever designing Prisma schemas or database relationships. Not for query building, Prisma Client usage, or application-level data access patterns."
---

# Prisma Schema — Relacionamentos e Polimorfismo

> Ao desenhar schemas Prisma, prefira relacionamentos opcionais explícitos sobre polimorfismo quando a tabela se relaciona com poucas outras tabelas.

## Rules

1. **Sempre use `@@map` nas models** — `@@map("comments")` em caixa baixa, porque mantém consistência entre nome do model (PascalCase) e nome real da tabela no banco
2. **Mapeie campos com underscore** — `@map("author_id")` para `authorId`, porque o banco usa snake_case enquanto o Prisma usa camelCase
3. **Evite polimorfismo para poucos relacionamentos** — se a tabela se relaciona com 2-3 outras, use foreign keys opcionais em vez de `parentId` + enum, porque o Prisma não lida bem com polimorfismo e foreign keys polimórficas perdem integridade referencial
4. **Use polimorfismo apenas quando necessário** — se uma tabela se relaciona com 40+ outras tabelas, aí sim considere `parentId` + enum de tipo, porque foreign keys opcionais para cada tabela seriam impraticáveis
5. **Campos de relacionamento opcionais indicam tipo** — quando `questionId` está preenchido é comentário de pergunta, quando `answerId` está preenchido é de resposta, porque a presença do valor substitui a necessidade de um campo enum discriminador
6. **Sempre configure relacionamentos inversos** — ao criar uma relação, atualize o model referenciado com o campo inverso (`comments Comment[]`), porque o Prisma exige bidirecionalidade

## How to write

### Model com campos base e mapeamento

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

### Relacionamentos opcionais em vez de polimorfismo

```prisma
// CORRETO: foreign keys opcionais para poucos relacionamentos
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

## Example

**Before (polimorfismo — problematico com Prisma):**

```prisma
enum CommentType {
  QUESTION
  ANSWER
}

model Comment {
  id       String      @id @default(uuid())
  content  String
  parentId String      @map("parent_id") // sem foreign key!
  type     CommentType

  @@map("comments")
}
```

**After (foreign keys opcionais — recomendado):**

```prisma
model Comment {
  id      String @id @default(uuid())
  content String

  questionId String?   @map("question_id")
  question   Question? @relation(fields: [questionId], references: [id])

  answerId String?  @map("answer_id")
  answer   Answer?  @relation(fields: [answerId], references: [id])

  @@map("comments")
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tabela se relaciona com 2-3 outras | Foreign keys opcionais para cada uma |
| Tabela se relaciona com 10+ outras | Considere polimorfismo com `parentId` + enum |
| Campo precisa de integridade referencial | Use foreign key explicita, nunca `parentId` generico |
| Novo model criado | Adicione `@@map("nome_snake_case")` e mapeie todos os campos |
| Relacionamento criado | Atualize ambos os models (bidirecional) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `parentId String` sem FK para 2-3 tabelas | `questionId String?` + `answerId String?` com relations |
| `type CommentType` como discriminador | Presenca/ausencia do FK opcional como discriminador |
| `userId` sem `@map("user_id")` | `userId String @map("user_id")` |
| Model sem `@@map` | `@@map("nome_plural_snake_case")` |
| Relacao sem campo inverso no model referenciado | `comments Comment[]` no model pai |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-finalizando-schema-do-prisma-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-finalizando-schema-do-prisma-1/references/code-examples.md)
