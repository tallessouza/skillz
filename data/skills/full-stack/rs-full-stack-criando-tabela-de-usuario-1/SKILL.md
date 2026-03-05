---
name: rs-full-stack-criando-tabela-usuario
description: "Applies Prisma model definition patterns when creating database tables with Prisma ORM. Use when user asks to 'create a table', 'define a model', 'add a prisma model', 'setup user table', or 'write a schema'. Enforces correct column types, decorators (@id, @default, @unique, @@map), and migration workflow. Make sure to use this skill whenever generating Prisma schema code or discussing Prisma migrations. Not for raw SQL, Drizzle, TypeORM, or other ORMs."
---

# Criando Tabelas com Prisma

> Defina modelos no schema.prisma com tipos, decoradores e nomes de tabela explícitos, depois execute migrations para sincronizar com o banco.

## Rules

1. **Use `model` para representar tabelas** — cada `model` no schema.prisma vira uma tabela no banco, porque Prisma traduz modelos para DDL automaticamente
2. **Sempre defina `@id` e `@default(uuid())` no campo id** — garante chave primária com geração automática, porque IDs manuais causam erros de duplicação
3. **Use `@unique` em campos que exigem unicidade** — como email, porque o banco rejeita duplicatas no nível da constraint
4. **Use `@@map("nome_tabela")` para nomear a tabela no banco** — o nome do model é a representação no código, `@@map` define o nome real no banco
5. **Execute `npx prisma migrate dev` após cada mudança no schema** — porque sem migration as mudanças não chegam ao banco
6. **Dê nomes descritivos às migrations** — `create table users` em vez de nomes genéricos, porque facilita rastrear o histórico de mudanças

## How to write

### Modelo básico com id, campos e mapeamento

```prisma
model User {
  id    String @id @default(uuid())
  name  String
  email String @unique

  @@map("users")
}
```

### Executar a migration

```bash
npx prisma migrate dev
# Quando solicitado, informe o nome: "create table users"
```

## Example

**Before (schema vazio):**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**After (com modelo User):**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id @default(uuid())
  name  String
  email String @unique

  @@map("users")
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo precisa ser único (email, CPF, slug) | Adicione `@unique` |
| ID com letras e números | Use `String` + `@default(uuid())` |
| ID numérico auto-incrementado | Use `Int` + `@default(autoincrement())` |
| Nome da tabela diferente do model | Use `@@map("nome_no_banco")` |
| Primeira vez rodando migrate | Certifique-se que o banco está rodando e DATABASE_URL está configurada no `.env` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `model User { id Int }` sem `@id` | `id String @id @default(uuid())` |
| Model sem `@@map` (nome fica PascalCase no banco) | `@@map("users")` para nome snake_case/plural |
| Alterar schema sem rodar migration | Sempre execute `npx prisma migrate dev` após mudanças |
| Migration sem nome descritivo | Nomeie: `create table users`, `add column phone` |
| Esquecer `@unique` em email | `email String @unique` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre decoradores Prisma, migrations e conexão com banco
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações