# Code Examples: Criando Tabelas com Prisma

## Exemplo 1: Modelo User completo (da aula)

```prisma
model User {
  id    String @id @default(uuid())
  name  String
  email String @unique

  @@map("users")
}
```

## Exemplo 2: Variação com autoincrement (Int ID)

```prisma
model Product {
  id    Int    @id @default(autoincrement())
  name  String
  price Float

  @@map("products")
}
```

## Exemplo 3: Modelo com mais campos e tipos

```prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())

  @@map("posts")
}
```

## Exemplo 4: Campo opcional

```prisma
model User {
  id    String  @id @default(uuid())
  name  String
  email String  @unique
  phone String?

  @@map("users")
}
```

O `?` após o tipo torna o campo opcional (nullable no banco).

## Comando de migration

```bash
# Criar e aplicar migration
npx prisma migrate dev
# Prompt: Enter a name for the new migration
# Resposta: create table users

# Migration gerada em:
# prisma/migrations/20240101120000_create_table_users/migration.sql
```

## SQL gerado pelo Prisma (exemplo da aula)

```sql
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```

## Configuração do .env necessária

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/api?schema=public"
```

Formato: `postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO?schema=public`

## Verificação no Beekeeper Studio

Após rodar a migration, conecte ao banco com as mesmas credenciais do `.env` para confirmar:
- A tabela `users` existe
- As colunas `id`, `name`, `email` estão presentes
- A constraint unique no email está ativa