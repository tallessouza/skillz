# Code Examples: Criando o Modelo das Tabelas

## Schema completo da aula

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

enum UserRule {
  EMPLOYEE
  MANAGER
}

enum Category {
  FOOD
  OTHERS
  SERVICES
  TRANSPORT
  ACCOMMODATION
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String

  rule      UserRule @default(EMPLOYEE)

  refounds  Refound[]

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("users")
}

model Refound {
  id        String   @id @default(uuid())
  name      String
  amount    Float
  category  Category
  filename  String

  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id])

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("refounds")
}
```

## Comandos executados

```bash
# Gerar migration e aplicar no banco
npx prisma migrate dev --name create-tables

# Abrir interface visual para inspecionar dados
npx prisma studio
```

## Variação: Usando variável de ambiente (produção)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

```env
# .env
DATABASE_URL="file:./dev.db"
```

## Variação: Adicionando mais campos ao User

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  avatarUrl String?  @map("avatar_url")
  phone     String?

  rule      UserRule @default(EMPLOYEE)

  refounds  Refound[]

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("users")
}
```

## Variação: Enum com mais valores

```prisma
enum Category {
  FOOD
  OTHERS
  SERVICES
  TRANSPORT
  ACCOMMODATION
  HEALTH
  EDUCATION
  EQUIPMENT
}
```

## Variação: Modelo com status enum

```prisma
enum RefoundStatus {
  PENDING
  APPROVED
  REJECTED
}

model Refound {
  id        String        @id @default(uuid())
  name      String
  amount    Float
  category  Category
  filename  String
  status    RefoundStatus @default(PENDING)

  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id])

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("refounds")
}
```

## Variação: Relacionamento com onDelete cascade

```prisma
model Refound {
  id        String   @id @default(uuid())
  name      String
  amount    Float
  category  Category
  filename  String

  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")

  @@map("refounds")
}
```

## Padrão: Timestamps reutilizáveis

Estes dois campos aparecem em todos os modelos da aula. Sempre inclua no final do modelo:

```prisma
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt      @map("updated_at")
```

- `createdAt`: Preenchido automaticamente na criação
- `updatedAt`: Nullable (`?`) porque não existe na criação; atualizado automaticamente pelo Prisma em cada `update()`