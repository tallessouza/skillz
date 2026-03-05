# Code Examples: Relacionamentos no Prisma ORM

## Schema completo da aula

### Antes (sem relacionamento)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id   String @id @default(uuid())
  name String
}

model Question {
  id      String @id @default(uuid())
  title   String
  content String
  userId  String @map("user_id")
}
```

Problema: `userId` aceita qualquer string, sem verificacao.

### Depois (com relacionamento)

```prisma
model User {
  id        String     @id @default(uuid())
  name      String
  questions Question[]
}

model Question {
  id      String @id @default(uuid())
  title   String
  content String
  userId  String @map("user_id")
  user    User   @relation(fields: [userId], references: [id])
}
```

## Comandos executados

### Criar migration

```bash
npx prisma migrate dev --name relations
```

Se falhar por violacao de FK:
```bash
# 1. Deletar registros invalidos via Prisma Studio ou query
# 2. Re-executar
npx prisma migrate dev --name relations
```

### Abrir Prisma Studio

```bash
npx prisma studio
```

Reiniciar apos mudancas no schema (Ctrl+C e rodar novamente).

## Variacoes de relacionamento

### One-to-one

```prisma
model User {
  id      String  @id @default(uuid())
  profile Profile?
}

model Profile {
  id     String @id @default(uuid())
  bio    String
  userId String @unique @map("user_id")
  user   User   @relation(fields: [userId], references: [id])
}
```

Note: `@unique` no `userId` e `Profile?` (opcional, sem array) definem one-to-one.

### One-to-many (da aula)

```prisma
model User {
  id        String     @id @default(uuid())
  questions Question[]
}

model Question {
  id     String @id @default(uuid())
  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id])
}
```

### Many-to-many (extensao do conceito)

```prisma
model Question {
  id         String     @id @default(uuid())
  title      String
  categories Category[]
}

model Category {
  id        String     @id @default(uuid())
  name      String
  questions Question[]
}
```

Prisma cria automaticamente a tabela intermediaria (join table).

## Testando a integridade

### Request que FALHA (FK invalida)

```http
POST /questions
Content-Type: application/json

{
  "title": "Como inserir no banco?",
  "content": "...",
  "userId": "qualquer_coisa"
}
```

Resposta: erro de foreign key constraint.

### Request que FUNCIONA (FK valida)

```http
POST /questions
Content-Type: application/json

{
  "title": "Como inserir no banco?",
  "content": "...",
  "userId": "uuid-valido-de-um-usuario-existente"
}
```

## Navegando relacionamentos em queries

```typescript
// Buscar usuario com suas perguntas
const userWithQuestions = await prisma.user.findUnique({
  where: { id: userId },
  include: { questions: true }
})

// Buscar pergunta com dados do usuario
const questionWithUser = await prisma.question.findUnique({
  where: { id: questionId },
  include: { user: true }
})
```