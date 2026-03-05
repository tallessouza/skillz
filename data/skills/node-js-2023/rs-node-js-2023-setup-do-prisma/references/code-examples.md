# Code Examples: Setup do Prisma

## Instalacao completa

```bash
# CLI do Prisma (devDependency — so roda em dev)
pnpm install prisma -D

# Client do Prisma (dependency — roda em producao)
pnpm install @prisma/client

# Inicializar estrutura do Prisma
pnpm prisma init
```

Resultado do `prisma init`:
- Cria `prisma/schema.prisma`
- Cria `.env` com `DATABASE_URL` placeholder

## .gitignore atualizado

```gitignore
# Adicionar imediatamente apos prisma init
.env
data
```

O `data` se refere a pasta de dados do Docker (volumes), que tambem nao deve ir pro repositorio.

## DATABASE_URL no .env

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/nest-clean?schema=public"
```

Estrutura: `postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO?schema=public`

As credenciais devem bater com o `docker-compose.yml`:
```yaml
services:
  postgres:
    environment:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: nest-clean
    ports:
      - "5432:5432"
```

## Schema completo da aula

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       String     @id @default(uuid())
  name     String
  email    String     @unique
  password String
  questions Question[]

  @@map("users")
}

model Question {
  id        String    @id @default(uuid())
  title     String
  slug      String    @unique
  content   String
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt @map("updated_at")
  authorId  String    @map("author_id")
  author    User      @relation(fields: [authorId], references: [id])

  @@map("questions")
}
```

### Detalhamento de cada campo

**User:**
- `id` — UUID gerado automaticamente pelo Prisma
- `name` — String obrigatoria
- `email` — String unica (constraint de unicidade no banco)
- `password` — String obrigatoria (hash, nao texto plano)
- `questions` — Relacao 1:N (um user tem muitas questions)

**Question:**
- `id` — UUID gerado automaticamente
- `title` — Titulo da pergunta
- `slug` — URL-friendly, unico (para rotas amigaveis)
- `content` — Corpo da pergunta
- `createdAt` — Preenchido automaticamente com `now()` na criacao
- `updatedAt` — `null` na criacao, preenchido automaticamente em updates pelo `@updatedAt`
- `authorId` — FK para User, renomeado de `userId` para semantica
- `author` — Relacao N:1 com User

## Rodando migrations

```bash
# Criar e aplicar migration
pnpm prisma migrate dev --name create-users-and-questions
```

Resultado: cria arquivo SQL em `prisma/migrations/` com o DDL:

```sql
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "author_id" TEXT NOT NULL,
    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "questions_slug_key" ON "questions"("slug");
ALTER TABLE "questions" ADD CONSTRAINT "questions_author_id_fkey" 
    FOREIGN KEY ("author_id") REFERENCES "users"("id");
```

## Prisma Studio

```bash
# Abrir interface grafica no navegador
pnpm prisma studio
```

Abre em `http://localhost:5555` com visualizacao dos models User e Question.

## Extensao VS Code recomendada

Instalar a extensao "Prisma" no VS Code para:
- Syntax highlighting no `.prisma`
- Auto-complete de tipos e decorators
- Formatacao automatica do schema