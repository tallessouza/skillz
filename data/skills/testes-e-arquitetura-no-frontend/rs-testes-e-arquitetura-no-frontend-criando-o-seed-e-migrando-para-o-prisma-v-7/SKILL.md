---
name: rs-testes-arq-frontend-prisma-v7-seed
description: "Applies Prisma v7 migration patterns and seed creation when setting up or upgrading Prisma in Next.js projects. Use when user asks to 'migrate Prisma', 'upgrade Prisma to v7', 'create a seed file', 'setup Prisma with Postgres adapter', or 'populate database for testing'. Covers prisma.config.ts setup, PG adapter pattern, TypeScript client rewrite changes, and FakerJS seed creation. Make sure to use this skill whenever upgrading Prisma or creating database seeds in Next.js projects. Not for Prisma schema design, query optimization, or production data migration."
---

# Prisma v7 Migration e Seed com FakerJS

> Ao migrar para Prisma v7, configure o adapter PG explicitamente, mova a database URL para prisma.config.ts, e crie seeds com FakerJS para dados realistas.

## Rules

1. **Defina `type: "module"` no package.json** — porque Prisma v7 exige ESM para funcionar corretamente com o novo client TypeScript
2. **Use target ES2023+ no tsconfig** — porque o Prisma v7 requer Node >= 20.19 e TypeScript atualizado
3. **Use `moduleResolution: "bundler"` no Next.js** — nao `node`, porque o Next.js usa bundler resolution e o Prisma v7 respeita isso
4. **Instale `@prisma/adapter-pg` e `pg` como dependencias de producao** — porque o Prisma v7 nao embute mais o driver, voce configura o adapter explicitamente
5. **Mova a database URL do schema.prisma para prisma.config.ts** — porque o datasource no schema nao aceita mais `env("DATABASE_URL")` diretamente
6. **Use FakerJS para dados de seed** — porque dados realistas (frases, paragrafos, nomes) tornam seeds e testes mais proximos da realidade do que strings hardcoded

## How to write

### prisma.config.ts

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

### Instanciacao do Prisma Client (lib/prisma.ts)

```typescript
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
```

### Seed com FakerJS (prisma/seed.ts)

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

  for (let i = 0; i < count; i++) {
    await prisma.prompt.create({
      data: {
        title: faker.lorem.words(3),
        content: faker.lorem.paragraphs(2),
      },
    });
  }
}

seed();
```

## Example

**Before (Prisma v6 — schema.prisma):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**After (Prisma v7 — schema.prisma + prisma.config.ts):**
```prisma
// schema.prisma — sem url
datasource db {
  provider = "postgresql"
}
```
```typescript
// prisma.config.ts — url aqui
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Migrando de Prisma v6 para v7 | Atualize prisma + @prisma/client, instale adapter-pg, crie prisma.config.ts |
| Usando Next.js com Prisma v7 | Use `moduleResolution: "bundler"` no tsconfig, nao `node` |
| Criando seed para testes | Use FakerJS para gerar dados realistas, limpe a base antes de popular |
| Node < 20.19 | Atualize o Node antes de migrar — v7 nao suporta versoes anteriores |
| Precisando de tipagem do pg | Instale `@types/pg` como devDependency |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `url = env("DATABASE_URL")` no schema.prisma (v7) | Configure `datasource.url` no prisma.config.ts |
| `new PrismaClient()` sem adapter (v7) | `new PrismaClient({ adapter })` com PrismaPg |
| Seed com strings hardcoded repetitivas | Use `faker.lorem.words()`, `faker.lorem.paragraphs()` |
| `moduleResolution: "node"` com Next.js | Use `moduleResolution: "bundler"` |
| Manter pasta generated antiga apos upgrade | Delete e rode `prisma generate` novamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
