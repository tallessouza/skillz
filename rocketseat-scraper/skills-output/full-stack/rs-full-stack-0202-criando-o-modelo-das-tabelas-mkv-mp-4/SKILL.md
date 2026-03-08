---
name: rs-full-stack-criando-modelo-tabelas
description: "Applies Prisma schema modeling patterns when defining database tables, enums, relationships, and migrations. Use when user asks to 'create a model', 'define database schema', 'setup Prisma tables', 'add a relation', or 'run migration'. Covers enum definitions, model fields with decorators, one-to-many relationships, table name mapping, timestamps, and Prisma migrate/studio workflow. Make sure to use this skill whenever writing schema.prisma files or designing relational models with Prisma ORM. Not for raw SQL migrations, Drizzle ORM, or Knex query building."
---

# Modelagem de Tabelas com Prisma

> Defina modelos Prisma com enums tipados, relacionamentos explícitos e mapeamento de nomes para o banco.

## Rules

1. **Use enums para valores fixos** — `enum UserRule { EMPLOYEE MANAGER }`, porque garante type-safety e evita strings soltas no código
2. **ID como string com default uuid** — `id String @id @default(uuid())`, porque gera identificadores únicos sem depender do banco
3. **Campos únicos com @unique** — `email String @unique`, porque o Prisma valida unicidade antes de chegar no banco
4. **Mapeie nomes com @@map e @map** — converta camelCase do Prisma para snake_case no banco, porque mantém convenções de ambos os mundos
5. **Timestamps automáticos** — `createdAt` com `@default(now())` e `updatedAt` com `@updatedAt`, porque elimina lógica manual de datas
6. **Relacionamentos explícitos com @relation** — declare `fields` e `references` sempre, porque o Prisma exige clareza na conexão entre tabelas

## Steps

### Step 1: Configurar datasource

Simplificar o acesso ao banco diretamente no schema quando variáveis de ambiente não são necessárias:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Step 2: Definir enums

```prisma
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
```

### Step 3: Criar modelo com relacionamento 1:N

```prisma
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

### Step 4: Executar migration

```bash
npx prisma migrate dev --name create-tables
```

### Step 5: Verificar com Prisma Studio

```bash
npx prisma studio
```

## Output format

- Arquivo `prisma/schema.prisma` com todos os modelos
- Pasta `prisma/migrations/` com a migration gerada
- Arquivo `dev.db` (SQLite) criado na raiz do projeto

## Error handling

- Se `migrate dev` falha por conflito: delete a pasta `migrations/` e o `dev.db` em desenvolvimento, rode novamente
- Se o relacionamento reclama de campo faltante: verifique que ambos os lados da relação estão declarados (`Refound[]` no User e `@relation` no Refound)

## Verification

- Abra Prisma Studio e confirme que as tabelas aparecem com os campos corretos
- Verifique que os nomes mapeados (snake_case) aparecem no banco

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre mapeamento, enums e padrões de relacionamento
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações