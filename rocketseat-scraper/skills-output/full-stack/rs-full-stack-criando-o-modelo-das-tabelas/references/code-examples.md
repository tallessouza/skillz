# Code Examples: Modelagem de Tabelas com Prisma

## Schema completo da API de entregas

Este é o schema completo conforme construído na aula:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

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

  user User          @relation(fields: [userId], references: [id])
  logs DeliveryLog[]

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("deliveries")
}

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

## Variação: Adicionando mais roles

```prisma
enum UserRole {
  CUSTOMER
  SELLER
  ADMIN
  SUPPORT
}
```

## Variação: Mais status de entrega

```prisma
enum DeliveryStatus {
  PROCESSING
  SHIPPED
  IN_TRANSIT
  OUT_FOR_DELIVERY
  DELIVERED
  RETURNED
  CANCELLED
}
```

## Variação: Unique constraint no email

```prisma
model User {
  id       String   @id @default(uuid())
  name     String
  email    String   @unique
  password String
  role     UserRole @default(CUSTOMER)

  deliveries Delivery[]

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("users")
}
```

## Variação: Relação com onDelete cascade

```prisma
model Delivery {
  id          String         @id @default(uuid())
  userId      String         @map("user_id")
  description String
  status      DeliveryStatus @default(PROCESSING)

  user User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  logs DeliveryLog[]

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("deliveries")
}

model DeliveryLog {
  id          String @id @default(uuid())
  description String
  deliveryId  String @map("delivery_id")

  delivery Delivery @relation(fields: [deliveryId], references: [id], onDelete: Cascade)

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("delivery_logs")
}
```

## Variação: PostgreSQL em vez de SQLite

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Com PostgreSQL, os enums são criados como tipos nativos no banco, oferecendo validação adicional no nível do database engine.

## Padrão reutilizável: Timestamps

Este bloco aparece em todos os modelos e pode ser copiado diretamente:

```prisma
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")
```

## Padrão reutilizável: ID com UUID

```prisma
  id String @id @default(uuid())
```

## Construção incremental do schema

### Passo 1: Enum primeiro
```prisma
enum UserRole {
  CUSTOMER
  SELLER
}
```

### Passo 2: Modelo base sem relações
```prisma
model User {
  id       String   @id @default(uuid())
  name     String
  email    String
  password String
  role     UserRole @default(CUSTOMER)

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("users")
}
```

### Passo 3: Segundo modelo com FK
```prisma
model Delivery {
  id          String         @id @default(uuid())
  userId      String         @map("user_id")
  description String
  status      DeliveryStatus @default(PROCESSING)

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("deliveries")
}
```

### Passo 4: Adicionar relações em ambos os lados
```prisma
// Em User, adicionar:
  deliveries Delivery[]

// Em Delivery, adicionar:
  user User @relation(fields: [userId], references: [id])
```

### Passo 5: Repetir para DeliveryLog
```prisma
// Em Delivery, adicionar:
  logs DeliveryLog[]

// DeliveryLog com relação:
  delivery Delivery @relation(fields: [deliveryId], references: [id])
```