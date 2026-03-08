---
name: 2023-criando-schema-do-prisma
description: "Designs intentional Prisma schemas derived from functional requirements, using DateTime instead of Boolean for status fields and meaningful field names like password_hash. Use when user asks to 'design Prisma schema', 'model database entities', 'create database tables with Prisma', 'use DateTime trick for booleans', or 'name fields by content'. Enforces: derive entities from requirements, DateTime? over Boolean for status, name fields by actual content, optional fields with explicit ?, @@map for snake_case table names. Make sure to use this skill whenever creating initial Prisma schema models from project requirements. Not for migration operations, Knex schemas, or schema modifications on existing models."
category: coding-lens
tags: [deploy, migrations, prisma, uuid]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: prisma-schema
  tags: [prisma, schema-design, datetime, boolean-trick, password-hash, postgresql]
---

# Prisma Schema Design

> Ao criar models no Prisma, cada campo deve carregar intencao e justificativa — nunca adicione campos por convencao sem necessidade real.

## Rules

1. **Derive entidades dos requisitos funcionais** — leia os RFs, identifique keywords recorrentes (usuario, academia, check-in) e transforme cada uma em model, porque entidades inventadas sem RF geram tabelas orfas
2. **Use DateTime opcional ao inves de Boolean** — `validatedAt DateTime?` ao inves de `isValidated Boolean`, porque uma unica coluna carrega duas informacoes: se aconteceu E quando aconteceu
3. **Nomeie pelo conteudo real do campo** — `password_hash` nao `password`, porque o campo armazena um hash, nao a senha em si, e o nome deve refletir isso
4. **Campos opcionais com `?` explicito** — `description String?`, `phone String?`, porque nem toda informacao e obrigatoria no dominio e forcar preenchimento gera dados lixo
5. **createdAt/updatedAt so quando necessario** — nao adicione em todas as tabelas por convencao, porque cada coluna ocupa espaco e em tabelas com milhoes de registros isso importa
6. **Renomeie tabelas com `@@map`** — use plural e snake_case no banco: `@@map("check_ins")`, `@@map("gyms")`, porque o Prisma usa PascalCase no model mas o banco deve seguir convencao SQL
7. **Latitude e longitude sempre required** — nunca opcionais em entidades geolocalizadas, porque calculos de distancia quebram silenciosamente com null

## How to write

### Model basico com ID padrao

```prisma
model Gym {
  id          String  @id @default(uuid())
  title       String
  description String?
  phone       String?
  latitude    Decimal
  longitude   Decimal

  @@map("gyms")
}
```

### Boolean como DateTime opcional (trick)

```prisma
model CheckIn {
  id          String    @id @default(uuid())
  created_at  DateTime  @default(now())
  validated_at DateTime?

  @@map("check_ins")
}
```

### Campo de senha nomeado corretamente

```prisma
model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  password_hash String
  created_at    DateTime @default(now())

  @@map("users")
}
```

## Example

**Before (schema ingenuo):**
```prisma
model CheckIn {
  id          String  @id @default(uuid())
  isValidated Boolean @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model User {
  id        String @id @default(uuid())
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**After (com esta skill aplicada):**
```prisma
model CheckIn {
  id           String    @id @default(uuid())
  created_at   DateTime  @default(now())
  validated_at DateTime?

  @@map("check_ins")
}

model User {
  id            String   @id @default(uuid())
  password_hash String
  created_at    DateTime @default(now())

  @@map("users")
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Campo que indica "se algo aconteceu" | Use `DateTime?` ao inves de `Boolean` |
| Campo armazena dado transformado | Nomeie pela transformacao: `_hash`, `_encrypted` |
| Entidade com localizacao | `latitude Decimal` + `longitude Decimal`, ambos required |
| Tabela raramente atualizada (ex: Gym) | Omita `updatedAt` |
| Adicionando coluna required em tabela com dados | Defina `@default()` ou torne opcional |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `isValidated Boolean` | `validated_at DateTime?` |
| `password String` | `password_hash String` |
| `updatedAt` em toda tabela | Apenas onde faz sentido |
| `latitude Float?` | `latitude Decimal` (required) |
| Model sem `@@map()` | `@@map("snake_case_plural")` |
| `npx prisma migrate deploy` em dev | `npx prisma migrate dev` (compara e cria) |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
