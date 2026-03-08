# Code Examples: Verificando Tabelas Criadas no Banco

## Exemplo 1: Schema Prisma completo do projeto

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  rule      String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  delivers Deliver[]

  @@map("users")
}

model Deliver {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  description String
  status      String
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user User          @relation(fields: [userId], references: [id])
  logs DeliverLog[]

  @@map("delivers")
}

model DeliverLog {
  id          String   @id @default(uuid())
  description String
  deliverId   String   @map("deliver_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  deliver Deliver @relation(fields: [deliverId], references: [id])

  @@map("deliver_logs")
}
```

## Exemplo 2: Queries SQL para verificacao

### Listar todas as tabelas

```sql
-- PostgreSQL
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Resultado esperado:**
```
 table_name
-------------------
 _prisma_migrations
 deliver_logs
 delivers
 users
```

### Verificar colunas da tabela users

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

**Resultado esperado:**
```
 column_name | data_type         | is_nullable | column_default
-------------+-------------------+-------------+------------------
 id          | character varying | NO          | gen_random_uuid()
 name        | character varying | NO          | NULL
 email       | character varying | NO          | NULL
 password    | character varying | NO          | NULL
 rule        | character varying | NO          | NULL
 created_at  | timestamp(3)      | NO          | CURRENT_TIMESTAMP
 updated_at  | timestamp(3)      | NO          | NULL
```

### Verificar colunas da tabela delivers

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'delivers'
ORDER BY ordinal_position;
```

### Verificar colunas da tabela deliver_logs

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'deliver_logs'
ORDER BY ordinal_position;
```

### Verificar foreign keys

```sql
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

**Resultado esperado:**
```
 constraint_name              | table_name   | column_name | foreign_table | foreign_column
------------------------------+--------------+-------------+---------------+----------------
 delivers_user_id_fkey        | delivers     | user_id     | users         | id
 deliver_logs_deliver_id_fkey | deliver_logs | deliver_id  | delivers      | id
```

### Verificar migrations aplicadas

```sql
SELECT id, migration_name, finished_at, applied_steps_count
FROM _prisma_migrations
ORDER BY finished_at DESC;
```

## Exemplo 3: Script de verificacao automatizada

```typescript
// scripts/verify-production-tables.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyTables() {
  console.log('Verificando tabelas em producao...\n')

  const tables = await prisma.$queryRaw<{ table_name: string }[]>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `

  const expectedTables = ['users', 'delivers', 'deliver_logs', '_prisma_migrations']

  for (const expected of expectedTables) {
    const found = tables.some(t => t.table_name === expected)
    console.log(`${found ? '[x]' : '[ ]'} Tabela ${expected}`)
  }

  console.log('\nVerificando migrations...')

  const migrations = await prisma.$queryRaw<{ migration_name: string; finished_at: Date }[]>`
    SELECT migration_name, finished_at
    FROM _prisma_migrations
    ORDER BY finished_at DESC
  `

  for (const migration of migrations) {
    console.log(`  - ${migration.migration_name} (${migration.finished_at})`)
  }

  console.log(`\nTotal: ${migrations.length} migrations aplicadas`)

  await prisma.$disconnect()
}

verifyTables().catch(console.error)
```

## Exemplo 4: Verificacao via Beekeeper Studio (passo a passo)

```
1. Abrir Beekeeper Studio
2. Selecionar conexao salva (producao)
3. Clicar em "Connect"
4. No painel esquerdo, expandir "Tables"
5. Verificar presenca de:
   - users
   - delivers
   - deliver_logs
   - _prisma_migrations
6. Clicar em cada tabela para ver colunas
7. Comparar lado a lado com prisma/schema.prisma
```

## Exemplo 5: Comando de build com migration

```json
// package.json — script de build que executa migration
{
  "scripts": {
    "build": "npx prisma migrate deploy && tsc",
    "start": "node dist/server.js"
  }
}
```

O `prisma migrate deploy` no script de build garante que as migrations sao aplicadas antes da aplicacao iniciar em producao.