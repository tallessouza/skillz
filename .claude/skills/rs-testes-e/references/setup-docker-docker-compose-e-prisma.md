---
name: rs-testes-e-setup-docker-docker-compose-e-prisma
description: "Generates Docker Compose and Prisma setup for Next.js projects with PostgreSQL. Use when user asks to 'setup docker', 'configure postgres', 'setup prisma', 'connect database', or 'create docker-compose for a Next.js app'. Follows Skillz patterns: Postgres 17 Alpine, health checks, proper .gitignore, Prisma Client singleton. Make sure to use this skill whenever scaffolding a new Next.js project with database. Not for Kubernetes, production deployment, or non-PostgreSQL databases."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: project-setup
  tags: [testing, next-js, react, prisma, docker]
---

# Setup Docker, Docker Compose e Prisma

> Configurar Docker Compose com PostgreSQL e Prisma Client para projetos Next.js em menos de 5 minutos.

## Prerequisites

- Docker ou OrbStack (macOS, mais leve e rapido que Docker Desktop) instalado
- Projeto Next.js com Prisma ja inicializado (`npx prisma init`)
- Schema Prisma com pelo menos um model definido

## Steps

### Step 1: Criar docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:17-alpine
    container_name: {project-name}-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: {project-name}
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

### Step 2: Configurar .gitignore

```gitignore
# database
pg-data

# prisma
generated/prisma
```

### Step 3: Configurar DATABASE_URL no .env

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/{project-name}?schema=public"
```

### Step 4: Subir o container

```bash
docker compose up -d
```

### Step 5: Rodar migrations e gerar client

```bash
npx prisma migrate dev
npx prisma generate
```

### Step 6: Criar singleton do Prisma Client

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "../../generated/prisma";

export const prisma = new PrismaClient();
```

## Output format

Apos execucao, o projeto tera:
- Container PostgreSQL 17 Alpine rodando na porta 5432
- Prisma Client gerado em `generated/prisma/`
- Singleton exportado de `src/lib/prisma.ts`
- `.gitignore` atualizado com `pg-data` e `generated/prisma`

## Error handling

- Se `prisma migrate dev` falhar, verificar se o container esta rodando: `docker ps`
- Se a importacao do PrismaClient der erro, rodar `npx prisma generate` novamente
- Se a porta 5432 estiver ocupada, alterar o mapeamento no docker-compose: `"5433:5432"`

## Verification

```bash
# Container rodando
docker ps | grep postgres

# Prisma conecta ao banco
npx prisma db pull

# Client gerado corretamente
ls generated/prisma/
```

## Heuristics

| Situacao | Acao |
|----------|------|
| macOS | Recomendar OrbStack como alternativa ao Docker Desktop |
| Porta 5432 ocupada | Mapear para outra porta no host |
| Projeto ja tem docker-compose | Adicionar servico postgres ao existente |
| CI/CD | docker-compose sobe o banco antes dos testes |

## Anti-patterns

| Nao faca | Faca |
|----------|------|
| Commitar `pg-data/` | Adicionar ao `.gitignore` |
| Commitar `generated/prisma/` | Adicionar ao `.gitignore` e gerar no build |
| Importar de `@prisma/client` com output customizado | Importar de `generated/prisma` |
| Criar PrismaClient em cada arquivo | Criar singleton em `src/lib/prisma.ts` |
| Usar senha complexa em dev local | `password` e suficiente para desenvolvimento |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
