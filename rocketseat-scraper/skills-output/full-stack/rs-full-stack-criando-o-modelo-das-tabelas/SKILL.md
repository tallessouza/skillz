---
name: rs-full-stack-criando-modelo-tabelas
description: "Enforces Prisma schema modeling best practices when defining database tables, enums, relations, and field mappings. Use when user asks to 'create a model', 'define database tables', 'setup Prisma schema', 'add relations', or 'create enum types'. Applies rules: enum for restricted values with defaults, @map for snake_case DB columns, @@map for table names, bidirectional relations, timestamps with @updatedAt. Make sure to use this skill whenever writing or modifying schema.prisma files. Not for raw SQL migrations, query optimization, or Prisma Client usage."
---

# Modelagem de Tabelas com Prisma

> Defina modelos Prisma com enums para valores restritos, mapeamento snake_case para o banco, e relacionamentos bidirecionais explícitos.

## Rules

1. **Use enums para campos com valores restritos** — `enum UserRole { CUSTOMER SELLER }` em vez de string livre, porque evita dados inválidos no banco e documenta os valores possíveis
2. **Defina defaults em enums** — `@default(CUSTOMER)` para que todo registro tenha um valor válido sem exigir input explícito
3. **Mapeie campos para snake_case com @map** — `userId` no Prisma, `user_id` no banco via `@map("user_id")`, porque o Prisma usa camelCase mas bancos SQL usam snake_case
4. **Mapeie tabelas com @@map** — `model User { @@map("users") }`, porque nomes de tabelas no banco devem ser plural e snake_case
5. **Relacionamentos são bidirecionais** — se Delivery tem `user User @relation(...)`, User deve ter `deliveries Delivery[]`, porque o Prisma exige ambos os lados
6. **Use @updatedAt para timestamps de atualização** — substitui lógica manual, porque o Prisma atribui automaticamente a data a cada update
7. **IDs como String com @default(uuid())** — `id String @id @default(uuid())`, porque UUIDs são seguros para sistemas distribuídos

## How to write

### Modelo com enum e timestamps

```prisma
enum UserRole {
  CUSTOMER
  SELLER
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String
  password  String
  role      UserRole @default(CUSTOMER)

  deliveries Delivery[]

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("users")
}
```

### Modelo com relacionamento e enum de status

```prisma
enum DeliveryStatus {
  PROCESSING
  SHIPPED
  DELIVERED
}

model Delivery {
  id          String         @id @default(uuid())
  userId      String         @map("user_id")
  description String
  status      DeliveryStatus @default(PROCESSING)

  user User           @relation(fields: [userId], references: [id])
  logs DeliveryLog[]

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("deliveries")
}
```

### Modelo de log com relacionamento

```prisma
model DeliveryLog {
  id          String @id @default(uuid())
  description String
  deliveryId  String @map("delivery_id")

  delivery Delivery @relation(fields: [deliveryId], references: [id])

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("delivery_logs")
}
```

## Example

**Before (sem enums, sem mapeamento):**
```prisma
model User {
  id    String @id @default(uuid())
  name  String
  email String
  role  String
}

model Delivery {
  id     String @id @default(uuid())
  userId String
  status String
}
```

**After (com esta skill aplicada):**
```prisma
enum UserRole {
  CUSTOMER
  SELLER
}

enum DeliveryStatus {
  PROCESSING
  SHIPPED
  DELIVERED
}

model User {
  id       String   @id @default(uuid())
  name     String
  email    String
  password String
  role     UserRole @default(CUSTOMER)

  deliveries Delivery[]

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("users")
}

model Delivery {
  id          String         @id @default(uuid())
  userId      String         @map("user_id")
  description String
  status      DeliveryStatus @default(PROCESSING)

  user User @relation(fields: [userId], references: [id])

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("deliveries")
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Campo com 2-5 valores possíveis | Crie um enum |
| Nome de campo composto (userId) | Adicione `@map("user_id")` |
| Tabela nova | Adicione `@@map("nome_plural_snake")` |
| Modelo referencia outro | Adicione `@relation` E o array no lado inverso |
| Campo de data de atualização | Use `@updatedAt` em vez de lógica manual |
| updatedAt no cadastro inicial | Marque como opcional com `?` |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `role String` para valores fixos | `role UserRole @default(CUSTOMER)` com enum |
| `status String` sem restrição | `status DeliveryStatus @default(PROCESSING)` |
| `userId String` sem @map | `userId String @map("user_id")` |
| `model User { ... }` sem @@map | `model User { ... @@map("users") }` |
| Relação só em um lado | Relação bidirecional (ambos os modelos) |
| `updatedAt DateTime @default(now())` | `updatedAt DateTime? @updatedAt` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre enums, mapeamentos e relacionamentos bidirecionais
- [code-examples.md](references/code-examples.md) — Schema completo da API de entregas com todas as variações