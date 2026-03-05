---
name: rs-node-js-2023-criando-schema-prisma
description: "Enforces Prisma schema design patterns when creating or modifying database models. Use when user asks to 'create a model', 'add a table', 'design schema', 'prisma schema', 'add field', or 'create migration'. Applies rules: boolean-to-date trick for audit fields, unit/intent in field names (passwordHash not password), only add createdAt/updatedAt when needed, optional fields with ?, latitude/longitude as required Decimal. Make sure to use this skill whenever generating Prisma schema code or designing database models. Not for query optimization, Prisma Client usage, or application-level code."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
