---
name: rs-node-js-2023-relacionamentos-tabelas
description: "Applies Prisma ORM relationship patterns when defining database schemas with relations. Use when user asks to 'create a schema', 'add a relation', 'define foreign key', 'setup prisma model', or 'relate tables in prisma'. Covers 1:1, 1:N, N:N patterns, naming conventions for relation fields vs database columns, and auto-generated inverse relations. Make sure to use this skill whenever writing or reviewing Prisma schema files with relationships. Not for raw SQL migrations, query optimization, or non-Prisma ORMs."
---

# Relacionamentos entre Tabelas no Prisma

> Ao definir relacionamentos no Prisma, separe campos de banco (snake_case, tipos primitivos) de campos de relacionamento (camelCase, tipos Model) — apenas tipos primitivos geram colunas reais.

## Rules

1. **Campos de relacionamento nao geram colunas** — `user User` e `checkIns CheckIn[]` existem apenas para o Prisma entender o relacionamento, nao criam nada no banco de dados
2. **Foreign keys em snake_case** — `user_id String`, nao `userId String`, porque sao colunas reais no banco e seguem convencao SQL
3. **Nomes de relacionamento em camelCase** — `user`, `gym`, `checkIns`, porque serao acessados via JavaScript/TypeScript no codigo da aplicacao
4. **Relacionamentos inversos sao obrigatorios** — se CheckIn tem `user User`, entao User deve ter `checkIns CheckIn[]`, porque o Prisma exige ambos os lados
5. **Pluralize arrays** — `checkIns CheckIn[]` nao `checkIn CheckIn[]`, porque o nome reflete que e uma colecao
6. **Use a extensao do Prisma com format-on-save** — ao criar o campo de relacionamento e salvar, a extensao gera automaticamente o `@relation`, a foreign key e o relacionamento inverso

## How to write

### Relacionamento 1:N (mais comum)

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  // Relacionamento inverso — nao gera coluna
  checkIns  CheckIn[]
}

model CheckIn {
  id          String   @id @default(uuid())
  created_at  DateTime @default(now())
  // Relacionamento — nao gera coluna
  user        User     @relation(fields: [user_id], references: [id])
  // Foreign key — gera coluna real
  user_id     String
}
```

### Multiplos relacionamentos no mesmo model

```prisma
model CheckIn {
  id          String   @id @default(uuid())
  created_at  DateTime @default(now())

  user    User   @relation(fields: [user_id], references: [id])
  user_id String

  gym    Gym    @relation(fields: [gym_id], references: [id])
  gym_id String
}
```

## Example

**Before (erro comum — foreign key sem @relation):**
```prisma
model CheckIn {
  id      String @id @default(uuid())
  userId  String  // Prisma nao entende que e foreign key
  gymId   String  // Nao cria relacionamento real
}
```

**After (com relacionamentos corretos):**
```prisma
model CheckIn {
  id          String   @id @default(uuid())
  created_at  DateTime @default(now())

  user    User   @relation(fields: [user_id], references: [id])
  user_id String

  gym    Gym    @relation(fields: [gym_id], references: [id])
  gym_id String
}

model User {
  id       String    @id @default(uuid())
  checkIns CheckIn[]
}

model Gym {
  id       String    @id @default(uuid())
  checkIns CheckIn[]
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados poderiam estar na mesma tabela | Relacionamento 1:1 (separacao semantica) |
| Um registro se relaciona com varios de outra tabela | Relacionamento 1:N — foreign key no lado "muitos" |
| Ambos os lados tem "varios" | Relacionamento N:N — tabela intermediaria |
| Campo e tipo primitivo (String, Int, DateTime) | Sera coluna real no banco |
| Campo e tipo de Model (User, Gym) | Apenas referencia do Prisma, nao gera coluna |
| Apos criar relacionamentos | Rodar `npx prisma migrate dev` |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `userId String` (camelCase para FK) | `user_id String` (snake_case para colunas do banco) |
| `checkIn CheckIn[]` (singular para array) | `checkIns CheckIn[]` (plural para colecao) |
| Criar FK sem `@relation` | Sempre usar campo de relacionamento + `@relation` |
| Esquecer o relacionamento inverso | Sempre declarar ambos os lados |
| Criar colunas manuais para relacoes | Deixar a extensao do Prisma gerar automaticamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
