---
name: rs-node-js-2023-criando-primeira-migration
description: "Applies Knex migration setup and creation patterns when configuring database migrations in Node.js with TypeScript. Use when user asks to 'create a migration', 'setup knex', 'configure database tables', 'add knex migrations', or 'setup database versioning'. Covers knexfile config, TSX loader, migration directory setup, and CLI commands. Make sure to use this skill whenever setting up Knex migrations in a TypeScript Node.js project. Not for Prisma, Drizzle, TypeORM, or other ORMs."
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

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-criando-primeira-migration/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-criando-primeira-migration/references/code-examples.md)
