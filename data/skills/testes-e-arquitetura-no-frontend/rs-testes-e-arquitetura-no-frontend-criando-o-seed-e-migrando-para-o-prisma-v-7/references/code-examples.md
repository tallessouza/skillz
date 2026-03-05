# Code Examples: Prisma v7 Migration e Seed

## 1. Upgrade dos pacotes

```bash
# Atualizar Prisma CLI e Client
pnpm install prisma@latest @prisma/client@latest

# Instalar adapter e driver PostgreSQL (producao)
pnpm install @prisma/adapter-pg pg

# Instalar tipagens e ferramentas (desenvolvimento)
pnpm install -D @types/pg tsx dotenv @faker-js/faker
```

## 2. package.json — Adicionar type module e scripts

```json
{
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed"
  }
}
```

## 3. tsconfig.json — Opcoes necessarias

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "target": "ES2023",
    "moduleResolution": "bundler",
    "module": "esnext"
  }
}
```

## 4. schema.prisma — Simplificado (sem URL)

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

model Prompt {
  id        String   @id @default(uuid())
  title     String
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("prompts")
}
```

## 5. prisma.config.ts — Configuracao completa

```typescript
import path from "node:path";
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    migrations: path.join("prisma", "migrations"),
  },
  seed: {
    command: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
```

## 6. lib/prisma.ts — Nova instanciacao com adapter

```typescript
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
```

## 7. prisma/seed.ts — Seed completo com FakerJS

```typescript
import { faker } from "@faker-js/faker";
import { prisma } from "../lib/prisma";

async function clean() {
  await prisma.prompt.deleteMany();
}

async function seed() {
  if (!prisma) return;

  const count = Number(process.env.SEED_COUNT) || 20;

  await clean();

  const promises = Array.from({ length: count }, () =>
    prisma.prompt.create({
      data: {
        title: faker.lorem.words(3),
        content: faker.lorem.paragraphs(2),
      },
    })
  );

  await Promise.all(promises);

  console.log(`Seeded ${count} prompts`);
}

seed();
```

## 8. Executando

```bash
# Gerar o client
pnpm db:generate

# Rodar migrations
pnpm db:migrate

# Popular o banco
pnpm db:seed
```

## 9. Checklist de migracao v6 → v7

- [ ] `pnpm install prisma@latest @prisma/client@latest`
- [ ] Adicionar `"type": "module"` no package.json
- [ ] Atualizar target para ES2023+ no tsconfig
- [ ] Usar `moduleResolution: "bundler"` (Next.js)
- [ ] Instalar `@prisma/adapter-pg` e `pg`
- [ ] Instalar `@types/pg` como devDependency
- [ ] Criar `prisma.config.ts` com datasource URL
- [ ] Remover `url = env("DATABASE_URL")` do schema.prisma
- [ ] Atualizar instanciacao do PrismaClient com adapter
- [ ] Deletar pasta generated antiga e rodar `prisma generate`
- [ ] Testar migrations e seed