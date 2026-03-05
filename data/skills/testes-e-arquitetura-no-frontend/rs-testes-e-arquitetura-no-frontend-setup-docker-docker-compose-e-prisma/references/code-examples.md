# Code Examples: Setup Docker, Docker Compose e Prisma

## docker-compose.yml completo da aula

```yaml
services:
  postgres:
    image: postgres:17-alpine
    container_name: skillz-prompt-managerdb
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: skillz-prompt-manager
    volumes:
      - pg-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pg-data:
```

## .env

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillz-prompt-manager?schema=public"
```

## .gitignore (adicoes)

```gitignore
# database
pg-data

# prisma
generated/prisma
```

## src/lib/prisma.ts — Singleton do Prisma Client

```typescript
import { PrismaClient } from "../../generated/prisma";

export const prisma = new PrismaClient();
```

## Uso do prisma em qualquer arquivo

```typescript
import { prisma } from "@/lib/prisma";

// Exemplo: buscar todos os prompts
const prompts = await prisma.prompt.findMany();

// Exemplo: buscar primeiro prompt
const prompt = await prisma.prompt.findFirst();
```

## Comandos executados na aula

```bash
# Subir o container em background
docker compose up -d

# Rodar migrations do Prisma
npx prisma migrate dev

# Gerar o Prisma Client
npx prisma generate
```

## Variacao: prisma.ts com singleton para desenvolvimento (evitar multiplas conexoes em hot reload)

```typescript
import { PrismaClient } from "../../generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

> **Nota:** O instrutor usou a versao simples na aula. A versao com singleton global e recomendada para Next.js em desenvolvimento, pois o hot reload cria multiplas instancias do PrismaClient sem esse pattern.

## Variacao: docker-compose com porta alternativa

```yaml
services:
  postgres:
    image: postgres:17-alpine
    ports:
      - "5433:5432"  # Porta 5433 no host, 5432 no container
```

```env
# .env atualizado para porta alternativa
DATABASE_URL="postgresql://postgres:password@localhost:5433/skillz-prompt-manager?schema=public"
```