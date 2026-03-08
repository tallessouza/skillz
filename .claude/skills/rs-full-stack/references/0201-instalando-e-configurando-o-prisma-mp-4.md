---
name: rs-full-stack-instalando-configurando-prisma
description: "Applies Prisma ORM setup workflow when initializing a new Node.js project with database support. Use when user asks to 'install prisma', 'setup database', 'configure ORM', 'add prisma to project', or 'create database connection'. Covers prisma and @prisma/client installation, prisma init with provider selection, and PrismaClient singleton with query logging. Make sure to use this skill whenever setting up Prisma from scratch in any Node.js/TypeScript project. Not for Prisma schema modeling, migrations, seeding, or advanced Prisma features like middleware."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [prisma, orm, database, sqlite, setup, prisma-client]
---

# Instalando e Configurando o Prisma

> Configure o Prisma ORM em 3 passos: instalar dependencias, inicializar com provider, e criar o modulo de conexao.

## Prerequisites

- Projeto Node.js/TypeScript ja inicializado com `package.json`
- npm disponivel no terminal
- Estrutura `src/` existente no projeto

## Steps

### Step 1: Instalar dependencias

```bash
# Prisma CLI como dependencia de desenvolvimento
npm i prisma@6.2.1 -D

# Prisma Client como dependencia de producao (usado em runtime)
npm i @prisma/client@6.2.1
```

Prisma CLI (`prisma`) e usado apenas em desenvolvimento para gerar schemas e rodar migrations. O `@prisma/client` e a dependencia de producao que conecta ao banco dentro da aplicacao.

### Step 2: Inicializar o Prisma com provider

```bash
npx prisma init --datasource-provider sqlite
```

Esse comando cria:
- `prisma/schema.prisma` — arquivo de schema com o provider configurado
- `.env` — com a variavel `DATABASE_URL` (para SQLite, aponta para um arquivo local)

Providers disponiveis: `sqlite`, `postgresql`, `mysql`, `sqlserver`, `mongodb`.

### Step 3: Criar modulo de conexao

Criar `src/database/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient({
  log: ["query"],
})
```

A opcao `log: ["query"]` exibe no console cada query SQL executada pelo Prisma, porque isso facilita debug e acompanhamento do que o ORM esta fazendo. Para silenciar, remova a propriedade `log`.

## Output format

Apos execucao, a estrutura do projeto deve conter:

```
project/
├── prisma/
│   └── schema.prisma      # Schema com provider configurado
├── src/
│   └── database/
│       └── prisma.ts       # Singleton do PrismaClient
├── .env                    # DATABASE_URL
└── package.json            # prisma (devDep) + @prisma/client (dep)
```

## Error handling

- Se `npx prisma init` falhar, verificar se `prisma` foi instalado como devDependency
- Se import do `@prisma/client` falhar, verificar se o pacote foi instalado como dependencia de producao
- Se queries nao aparecem no log, confirmar que `log: ["query"]` foi passado ao PrismaClient

## Verification

1. Verificar que `prisma/schema.prisma` existe e contem o provider correto
2. Verificar que `src/database/prisma.ts` exporta uma instancia do PrismaClient
3. Confirmar no `package.json` que `prisma` esta em `devDependencies` e `@prisma/client` em `dependencies`

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo precisa de banco | Use SQLite para simplicidade, PostgreSQL para producao |
| Quer ver queries no console | Passe `log: ["query"]` no PrismaClient |
| Quer Prisma silencioso | Instancie `new PrismaClient()` sem opcoes |
| Precisa do client em varios arquivos | Importe sempre de `src/database/prisma.ts` (singleton) |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instalar `prisma` como dep de producao | `npm i prisma -D` (devDependency) |
| Instalar `@prisma/client` como devDep | `npm i @prisma/client` (dependencia de producao) |
| Criar `new PrismaClient()` em cada arquivo | Criar um unico modulo `prisma.ts` e importar dele |
| Rodar `npx prisma init` sem `--datasource-provider` | Sempre especificar o provider: `--datasource-provider sqlite` |

## Troubleshooting

### Problem: Import of `@prisma/client` fails with "Cannot find module"
- **Cause**: `@prisma/client` was not installed as a production dependency, or `prisma generate` was not run after schema changes
- **Fix**: Run `npm i @prisma/client` (without `-D`) and then `npx prisma generate` to regenerate the client

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de dependencias, singleton pattern e query logging
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes