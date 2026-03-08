---
name: 2023-criando-primeira-migration
description: "Sets up Knex migrations with TypeScript support using TSX loader, separated config from connection, and knexfile at project root. Use when user asks to 'create first migration', 'setup Knex migrations', 'configure database versioning', or 'use Knex with TypeScript'. Enforces: separate config export from knex instance, knexfile.ts at root importing config, TSX loader script in package.json, double dash for npm run arguments. Make sure to use this skill whenever setting up database migration infrastructure with Knex in a TypeScript Node.js project. Not for Prisma migrations, raw SQL migrations, or JavaScript-only projects."
category: workflow
tags: [knex, migrations, modules, prisma, typescript]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: database-migrations
  tags: [knex, migrations, typescript, sqlite, database, tsx]
---

# Criando Primeira Migration com Knex

> Migrations sao o controle de versao do banco de dados — permitem que times trabalhem na mesma base de dados sem conflitos, assim como o Git faz para codigo.

## O que sao migrations

Migrations sao um historico ordenado por data/hora de todas as alteracoes feitas no banco de dados. O Knex cria automaticamente uma tabela `migrations` que registra quais migrations ja foram executadas. Quando outro dev puxa o codigo, basta rodar um comando para o banco atualizar com as migrations pendentes.

## Prerequisites

- Knex instalado (`npm i knex`)
- Driver do banco instalado (ex: `sqlite3`, `pg`)
- TSX instalado para suporte TypeScript (`npm i tsx -D`)
- Arquivo `database.ts` com configuracoes do Knex separadas

## Steps

### Step 1: Separar config do Knex da conexao

Extrair as configuracoes em uma variavel `config` separada da instancia do Knex, para que o knexfile possa importar apenas a config sem criar uma conexao.

```typescript
// src/database.ts
import { knex as setupKnex, Knex } from 'knex'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
```

### Step 2: Criar o knexfile.ts

```typescript
// knexfile.ts (raiz do projeto)
import { config } from './src/database'

export default config
```

### Step 3: Criar script com TSX loader no package.json

O Knex CLI nao suporta TSX nativamente. Usar `--loader tsx` no Node para interpretar TypeScript.

```json
{
  "scripts": {
    "knex": "node --no-warnings --loader tsx ./node_modules/.bin/knex"
  }
}
```

### Step 4: Criar a migration

```bash
npm run knex -- migrate:make create-nome-da-tabela
```

O `--` antes dos parametros e obrigatorio para que o npm repasse os argumentos ao knex e nao interprete como seus.

### Step 5: Configurar .gitignore

```
db/*.db
```

## Heuristics

| Situacao | Faca |
|----------|------|
| SQLite reclama de default values | Adicione `useNullAsDefault: true` na config |
| Knex CLI nao encontra config | Crie `knexfile.ts` na raiz importando a config |
| Erro de TypeScript na CLI | Use o script com `--loader tsx` |
| Warning do Node ao rodar | Adicione `--no-warnings` ao script |
| Nome da migration | Use verbo + tabela: `create-users`, `add-price-to-products` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Importar a instancia do knex no knexfile | Importar apenas o objeto `config` |
| Rodar `npx knex` direto com TypeScript | Usar `npm run knex --` com loader TSX |
| Passar parametros sem `--` apos `npm run` | `npm run knex -- migrate:make nome` |
| Deixar config e conexao na mesma exportacao | Separar `config` e `knex` como exports distintos |
| Criar pasta de migrations na raiz | Configurar `migrations.directory` para `./db/migrations` |

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
