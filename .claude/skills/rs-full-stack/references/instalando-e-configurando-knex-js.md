---
name: rs-full-stack-instalando-configurando-knex
description: "Applies Knex.js setup and configuration patterns when creating a Node.js API with SQLite. Use when user asks to 'setup knex', 'configure database', 'create knexfile', 'setup migrations', or 'initialize sqlite with knex'. Generates knexfile.ts, package.json script, and folder structure following Skillz conventions. Make sure to use this skill whenever setting up Knex.js in a TypeScript project. Not for Prisma, TypeORM, Drizzle, or other ORMs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: knex-setup
  tags: [knex, sqlite, database, migrations, typescript]
---

# Instalando e Configurando Knex.js

> Ao configurar Knex.js, defina client, connection, migrations e seeds no knexfile.ts, crie o script no package.json, e valide criando a primeira migration.

## Rules

1. **Fixe versoes especificas** — `knex@3.1.0` e `sqlite3@5.1.7`, porque versoes flutuantes quebram builds em producao
2. **knexfile.ts na raiz do projeto** — nunca dentro de src/, porque o Knex CLI espera na raiz por padrao
3. **Banco dentro de src/database/** — `./src/database/database.db`, porque separa dados de codigo fonte
4. **Extensao ts para migrations e seeds** — porque o projeto usa TypeScript e o Knex suporta nativamente
5. **Script knex usa --import tsx** — `node --import tsx node_modules/.bin/knex`, porque permite executar o CLI com suporte a TypeScript
6. **useNullAsDefault: true** — obrigatorio para SQLite, porque SQLite nao suporta valores default da mesma forma que outros bancos

## How to write

### knexfile.ts

```typescript
import type { Knex } from "knex"

export default {
  client: "sqlite3",
  connection: {
    filename: "./src/database/database.db",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./src/database/migrations",
  },
  seeds: {
    extension: "ts",
    directory: "./src/database/seeds",
  },
} satisfies Knex.Config
```

### Script no package.json

```json
{
  "scripts": {
    "knex": "node --import tsx node_modules/.bin/knex"
  }
}
```

### Estrutura de pastas

```
src/
└── database/
    ├── migrations/   # criada automaticamente na primeira migration
    ├── seeds/
    └── database.db   # criado ao rodar a primeira migration
```

## Example

**Criar a primeira migration:**

```bash
npm run knex -- migrate:make create-product
```

**Output esperado:**
```
Created Migration: ./src/database/migrations/20240101120000_create-product.ts
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto TypeScript com Knex | Sempre use `extension: "ts"` em migrations e seeds |
| SQLite como banco | Sempre adicione `useNullAsDefault: true` |
| Pasta migrations nao existe | Deixe o Knex criar automaticamente na primeira migration |
| Precisa rodar comando Knex | Use `npm run knex -- <comando>`, nunca `npx knex` diretamente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `npx knex migrate:make` | `npm run knex -- migrate:make` (garante tsx) |
| `connection: "./database.db"` | `connection: { filename: "./src/database/database.db" }` (objeto com filename) |
| Instalar sem versao fixa | `knex@3.1.0` e `sqlite3@5.1.7` |
| knexfile.js em projeto TS | `knexfile.ts` com tipagem |
| Esquecer node_modules no .gitignore | Adicionar `node_modules` ao `.gitignore` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `npx knex` nao reconhece TypeScript | tsx nao configurado no script | Usar `npm run knex -- <comando>` com script que inclui `--import tsx` |
| Migration nao cria a pasta | Primeira execucao sem pasta existente | Knex cria automaticamente na primeira migration — execute `npm run knex -- migrate:make` |
| Erro "SQLITE_CANTOPEN" | Caminho do banco incorreto | Verificar que `connection.filename` aponta para caminho valido |
| `useNullAsDefault` ausente gera warnings | SQLite requer essa config | Adicionar `useNullAsDefault: true` no knexfile.ts |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada configuracao e por que cada campo existe
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes