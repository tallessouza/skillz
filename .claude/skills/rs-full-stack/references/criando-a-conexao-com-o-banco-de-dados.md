---
name: rs-full-stack-criando-conexao-banco
description: "Generates Knex database connection module when user asks to 'connect to database', 'setup knex', 'create db connection', 'configure database', or 'initialize knex'. Applies pattern: import knex, rename to avoid conflict, import config, export configured instance. Make sure to use this skill whenever setting up database connectivity in a Node/TypeScript project using Knex. Not for Prisma, TypeORM, Sequelize, or other ORMs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: database-knex
  tags: [knex, database, connection, typescript, configuration]
---

# Conexao com Banco de Dados via Knex

> Crie um modulo dedicado que exporta uma instancia configurada do Knex, separando configuracao de conexao.

## Rules

1. **Arquivo dedicado para conexao** — crie `src/database/knex.ts` separado da configuracao, porque isola o ponto unico de acesso ao banco
2. **Renomeie o import do Knex** — importe como `knexConfig` ou similar para liberar o nome `knex` para o export, porque o consumidor espera `import { knex } from "@/database/knex"`
3. **Importe configuracoes de arquivo separado** — nunca hardcode connection strings no arquivo de conexao, porque configuracao vive em `knexfile` ou `config`
4. **Exporte instancia nomeada** — `export const knex = knexConfig(config)`, porque permite import direto em qualquer parte da aplicacao

## How to write

### Modulo de conexao

```typescript
// src/database/knex.ts
import knexConfig from "knex"
import { config } from "../../knexfile"

export const knex = knexConfig(config)
```

### Uso no restante da aplicacao

```typescript
import { knex } from "@/database/knex"

const users = await knex("users").select("*")
```

## Example

**Before (conexao inline, sem modulo):**
```typescript
// Em cada arquivo que precisa do banco
import knex from "knex"
const db = knex({
  client: "sqlite3",
  connection: { filename: "./dev.db" }
})
const users = await db("users").select("*")
```

**After (com modulo dedicado):**
```typescript
// src/database/knex.ts — unico ponto de conexao
import knexConfig from "knex"
import { config } from "../../knexfile"

export const knex = knexConfig(config)

// Em qualquer outro arquivo
import { knex } from "@/database/knex"
const users = await knex("users").select("*")
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto novo com Knex | Crie `src/database/knex.ts` antes de qualquer query |
| Configuracao ja existe em knexfile | Importe de la, nao duplique |
| Multiplos ambientes (dev/prod) | Configuracao resolve isso, conexao permanece unica |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `import knex from "knex"` em cada arquivo de rota | `import { knex } from "@/database/knex"` centralizado |
| Hardcode de connection string no arquivo de conexao | Import do knexfile/config externo |
| Exportar o construtor knex sem configurar | Exportar instancia ja configurada |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `Error: Cannot find module 'knex'` | Knex nao instalado no projeto | Execute `npm install knex` e o driver do banco (ex: `better-sqlite3`) |
| `SQLITE_CANTOPEN: unable to open database file` | Path do arquivo de banco incorreto no knexfile | Verifique que o path relativo no `connection.filename` esta correto em relacao a raiz do projeto |
| Nome `knex` conflita com import | Import padrao e export usam o mesmo nome | Renomeie o import para `knexConfig` e exporte como `knex` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de conexao e configuracao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes