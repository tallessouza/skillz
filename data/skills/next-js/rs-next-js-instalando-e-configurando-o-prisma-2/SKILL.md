---
name: rs-next-js-instalando-configurando-prisma
description: "Applies Prisma ORM setup and configuration patterns in Next.js projects with PostgreSQL. Use when user asks to 'setup prisma', 'configure database', 'create prisma schema', 'model a table', 'connect to postgres', or 'initialize ORM'. Covers installation, schema modeling, naming conventions (@@map), environment variables, and migrations. Make sure to use this skill whenever setting up Prisma in a Next.js or TypeScript project. Not for advanced Prisma queries, relations, or production deployment configurations."
---

# Instalando e Configurando o Prisma

> Configurar o Prisma como intermediario entre TypeScript e PostgreSQL, garantindo autocomplete, type-safety e protecao contra SQL injection.

## Rules

1. **Adicione artifacts gerados ao .gitignore** — `pgdata` e `generated` (Prisma Client) nao devem subir ao repositorio, porque sao gerados localmente e variam por ambiente
2. **Instale Prisma CLI como devDependency e @prisma/client como dependency** — porque o CLI so e usado em desenvolvimento, mas o client roda em producao
3. **Use `@@map` para normalizar nomes no banco** — Model em PascalCase singular no codigo (`Appointment`), tabela em snake_case plural no banco (`appointments`), porque segue convencoes de banco de dados
4. **Nunca hardcode a connection string** — use `env("DATABASE_URL")` no schema e defina no `.env`, porque expor credenciais no codigo e risco de seguranca
5. **Crie um `.env.example` sem valores sensiveis** — para que outros devs saibam quais variaveis sao necessarias sem expor credenciais
6. **Nomeie a primeira migration como `init`** — `npx prisma migrate dev --name init`, porque estabelece um ponto de partida claro no historico de migrations

## How to write

### .gitignore entries

```gitignore
# Database volume
pgdata

# Prisma generated client
generated
```

### Instalacao

```bash
# Client como dependency de producao
npm install @prisma/client

# CLI como devDependency
npm install -D prisma

# Inicializar com provider PostgreSQL
npx prisma init --datasource-provider postgresql
```

### Schema com @@map

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Appointment {
  id          String   @id @default(uuid())
  tutorName   String
  petName     String
  phone       String
  description String
  schedule    DateTime

  @@map("appointments")
}
```

### Variaveis de ambiente

```env
# .env (real — no .gitignore)
DATABASE_URL="postgresql://docker:docker@localhost:5432/petshop?schema=public"
```

```env
# .env.example (commitado no repositorio)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

### Executar migration

```bash
npx prisma migrate dev --name init
```

## Example

**Before (SQL puro no codigo — problematico):**
```typescript
// Sem autocomplete, sem tipos, vulneravel a SQL injection
const result = await pool.query(
  `SELECT * FROM appointments WHERE tutor_name = '${name}'`
)
```

**After (com Prisma configurado):**
```typescript
// Autocomplete, type-safe, protegido contra injection
const appointments = await prisma.appointment.findMany({
  where: { tutorName: name }
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto Next.js novo com PostgreSQL | Instalar Prisma como ORM padrao |
| Docker gerando pasta de dados local | Adicionar ao .gitignore imediatamente |
| Model com nome composto | PascalCase singular no model, snake_case plural no @@map |
| Campos de ID | `String @id @default(uuid())` para IDs universais |
| Campos de data/hora | Usar tipo `DateTime` do Prisma |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `url = "postgresql://docker:docker@..."` (hardcoded) | `url = env("DATABASE_URL")` |
| `model appointments {` (plural/minusculo) | `model Appointment {` + `@@map("appointments")` |
| Instalar tudo como dependency | `prisma` como devDependency, `@prisma/client` como dependency |
| Commitar `.env` com credenciais | Commitar `.env.example` sem valores reais |
| Escrever SQL puro em projeto TypeScript | Usar Prisma para queries type-safe |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
