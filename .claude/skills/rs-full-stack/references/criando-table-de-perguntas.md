---
name: rs-full-stack-criando-table-de-perguntas
description: "Enforces Prisma model creation patterns when defining database tables. Use when user asks to 'create a model', 'add a table', 'define schema', 'prisma model', or 'new entity in Prisma'. Applies rules: camelCase properties with @map for snake_case DB columns, @default(now()) for createdAt, @updatedAt for automatic timestamps, @@map for table naming. Make sure to use this skill whenever generating Prisma schema code. Not for raw SQL migrations, query building, or Prisma Client usage."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: prisma-orm
  tags: [prisma, schema, model, camelcase, map, timestamps]
---

# Criando Tabelas com Prisma

> Ao criar modelos Prisma, use camelCase nas propriedades e @map para mapear nomes snake_case no banco de dados.

## Rules

1. **Use camelCase nas propriedades do model** — `createdAt` nao `created_at`, porque Prisma exige camelCase e rejeita outros padroes
2. **Mapeie para snake_case no banco com @map** — `@map("created_at")` para que a coluna no banco siga convencao SQL padrao
3. **Use @@map para nomear a tabela** — `@@map("questions")` no final do model, porque separa o nome do model (PascalCase) do nome da tabela (snake_case/plural)
4. **Use @default(now()) para createdAt** — insere data/hora automaticamente na criacao do registro
5. **Use @updatedAt para updatedAt** — Prisma atualiza automaticamente quando o registro e modificado, sem codigo manual
6. **Sempre defina id como @id com @default** — `id String @id @default(uuid())` para chave primaria gerada automaticamente

## How to write

### Model completo com timestamps e mapeamento

```prisma
model Question {
  id        String   @id @default(uuid())
  title     String
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  userId    String   @map("user_id")

  @@map("questions")
}
```

### Migrar apos criar o model

```bash
npx prisma migrate dev --name create-table-questions
```

## Example

**Before (erros comuns):**
```prisma
model questions {
  id         String @id @default(uuid())
  title      String
  content    String
  created_at DateTime @default(now())
  updated_at DateTime
  user_id    String
}
```

**After (com esta skill aplicada):**
```prisma
model Question {
  id        String   @id @default(uuid())
  title     String
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  userId    String   @map("user_id")

  @@map("questions")
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova tabela | Model PascalCase singular + @@map plural snake_case |
| Campo com underscore no banco | camelCase na propriedade + @map("snake_case") |
| Campo de data de criacao | `DateTime @default(now())` |
| Campo de data de atualizacao | `DateTime @updatedAt` — nunca setar manualmente |
| Chave primaria | `String @id @default(uuid())` |
| Foreign key | camelCase no model (`userId`) + @map para snake_case (`user_id`) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `model questions {` (minusculo/plural) | `model Question { ... @@map("questions") }` |
| `created_at DateTime` no model | `createdAt DateTime @map("created_at")` |
| `updated_at DateTime @default(now())` | `updatedAt DateTime @updatedAt @map("updated_at")` |
| Setar updatedAt manualmente no codigo | Usar `@updatedAt` — Prisma gerencia automaticamente |
| Nome da tabela sem @@map | Sempre usar `@@map("nome_tabela")` para controlar o nome no banco |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Coluna `created_at` nao gerada no banco | Propriedade usa camelCase sem `@map` | Use `createdAt DateTime @map("created_at")` |
| `updatedAt` nao atualiza automaticamente | Usando `@default(now())` em vez de `@updatedAt` | Troque para `@updatedAt` no campo updatedAt |
| Model name no plural causa erro | Prisma espera PascalCase singular | Use `model Question { ... @@map("questions") }` |
| Migration falha com `relation not found` | Foreign key referencia model inexistente | Crie o model referenciado antes ou na mesma migration |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre mapeamento camelCase/snake_case e comportamento do Prisma
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes