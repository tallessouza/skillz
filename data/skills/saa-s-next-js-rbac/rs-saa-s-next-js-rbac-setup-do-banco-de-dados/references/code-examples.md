# Code Examples: Setup de Banco de Dados Multi-Tenant SaaS

## Docker Compose para Postgres

```yaml
version: '3.7'

services:
  pg:
    image: bitnami/postgresql:latest
    ports:
      - '5432:5432'
    environment:
      - POSTGRESQL_USERNAME=docker
      - POSTGRESQL_PASSWORD=docker
      - POSTGRESQL_DATABASE=next-saas
```

Comandos:
```bash
docker compose up -d
docker logs -f <container_id>  # -f = follow, continua ouvindo logs
```

## Inicializacao do Prisma

```bash
pnpm i prisma -D          # CLI como devDependency
pnpm prisma init           # Cria pasta prisma/ e .env
```

`.env` gerado:
```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/next-saas?schema=public"
```

## Schema completo

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TokenType {
  PASSWORD_RECOVER
}

enum AccountProvider {
  GITHUB
}

enum Role {
  ADMIN
  MEMBER
  BILLING
}

model User {
  id           String   @id @default(uuid())
  name         String?
  email        String   @unique
  passwordHash String?  @map("password_hash")
  avatarUrl    String?  @map("avatar_url")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  tokens             Token[]
  accounts           Account[]
  invites            Invite[]
  memberOn           Member[]
  ownedOrganizations Organization[]
  ownedProjects      Project[]

  @@map("users")
}

model Token {
  id        String    @id @default(uuid())
  type      TokenType
  createdAt DateTime  @default(now()) @map("created_at")

  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id])

  @@map("tokens")
}

model Account {
  id                String          @id @default(uuid())
  provider          AccountProvider
  providerAccountId String          @unique @map("provider_account_id")

  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id])

  @@unique([provider, userId])
  @@map("accounts")
}

model Invite {
  id        String   @id @default(uuid())
  email     String
  role      Role
  createdAt DateTime @default(now()) @map("created_at")

  authorId String? @map("user_id")
  author   User?   @relation(fields: [authorId], references: [id])

  organizationId String       @map("organization_id")
  organization   Organization @relation(fields: [organizationId], references: [id])

  @@unique([email, organizationId])
  @@index([email])
  @@map("invites")
}

model Member {
  id   String @id @default(uuid())
  role Role   @default(MEMBER)

  organizationId String       @map("organization_id")
  organization   Organization @relation(fields: [organizationId], references: [id])

  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id])

  @@unique([organizationId, userId])
  @@map("members")
}

model Organization {
  id                        String   @id @default(uuid())
  name                      String
  slug                      String   @unique
  domain                    String?  @unique
  shouldAttachUsersByDomain Boolean  @default(false) @map("should_attach_users_by_domain")
  avatarUrl                 String?  @map("avatar_url")
  createdAt                 DateTime @default(now()) @map("created_at")
  updatedAt                 DateTime @updatedAt @map("updated_at")

  ownerId String @map("user_id")
  owner   User   @relation(fields: [ownerId], references: [id])

  invites  Invite[]
  members  Member[]
  projects Project[]

  @@map("organizations")
}

model Project {
  id          String   @id @default(uuid())
  name        String
  description String
  slug        String   @unique
  avatarUrl   String?  @map("avatar_url")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  organizationId String       @map("organization_id")
  organization   Organization @relation(fields: [organizationId], references: [id])

  ownerId String @map("user_id")
  owner   User   @relation(fields: [ownerId], references: [id])

  @@map("projects")
}
```

## Executando migration

```bash
pnpm prisma migrate dev --name "create database structure"
```

Isso gera a pasta `prisma/migrations/` com o SQL correspondente e instala o `@prisma/client` automaticamente.

## Padroes ilustrados

### Padrao: Enum com valor unico (extensibilidade)

```prisma
// Mesmo com um valor, use enum — adicionar novos valores e uma migration simples
enum TokenType {
  PASSWORD_RECOVER
  // Futuro: EMAIL_CONFIRMATION, INVITE_LINK, etc.
}
```

### Padrao: Relacao opcional para dados orfaos

```prisma
// author pode ser deletado, convite persiste
model Invite {
  authorId String? @map("user_id")
  author   User?   @relation(fields: [authorId], references: [id])
}
```

### Padrao: Indice composto para regra de negocio

```prisma
// Um usuario so pode ser membro uma vez por organizacao
@@unique([organizationId, userId])

// Um email so pode ter um convite por organizacao
@@unique([email, organizationId])

// Um usuario so pode ter uma conta por provider
@@unique([provider, userId])
```

### Padrao: Indice simples para busca frequente

```prisma
// Buscar todos os convites de um email (tela "convites pendentes")
@@index([email])
```