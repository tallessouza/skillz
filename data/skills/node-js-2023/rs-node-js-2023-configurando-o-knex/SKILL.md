---
name: rs-node-js-2023-configurando-o-knex
description: "Generates Knex query builder configuration and database connection setup for Node.js projects. Use when user asks to 'setup knex', 'configure database', 'connect to sqlite', 'add query builder', or 'create database connection file'. Follows pattern: client + connection + export. Make sure to use this skill whenever setting up Knex in a Node.js/TypeScript project. Not for Prisma, TypeORM, Drizzle, or other ORMs."
---

# Configurando o Knex

> Configurar o Knex como query builder requer: instalar knex + driver, criar arquivo de conexao, e exportar a instancia configurada.

## Prerequisites

- Node.js 18+
- Projeto TypeScript configurado
- Driver do banco desejado (sqlite3, pg, mysql2, etc.)

## Steps

### Step 1: Instalar dependencias

```bash
# SQLite
npm install knex sqlite3

# PostgreSQL
npm install knex pg

# MySQL
npm install knex mysql2
```

Instalar como dependencias de producao (sem -D), porque sao necessarias em runtime.

### Step 2: Criar arquivo de conexao

Criar `src/database.ts`:

```typescript
import { knex as setupKnex } from 'knex'

export const knex = setupKnex({
  client: 'sqlite',
  connection: {
    filename: './temp/app.db',
  },
})
```

Renomear a importacao para `setupKnex` porque o export deve ser `knex` — evita conflito de nomes.

### Step 3: Criar pasta temp

```bash
mkdir -p temp
```

A pasta `temp` indica que o SQLite e apenas para desenvolvimento, nao para producao.

### Step 4: Configurar .gitignore

```gitignore
*.db
node_modules
```

Arquivos `.db` nunca devem subir no controle de versao.

### Step 5: Testar a conexao

```typescript
import { knex } from './database'

// Query que funciona sem tabelas — sqlite_schema existe em todo banco SQLite
const tables = await knex('sqlite_schema').select('*')
// Retorna array vazio se nao ha tabelas criadas
```

## Connection por banco

| Banco | client | connection |
|-------|--------|------------|
| SQLite | `'sqlite'` | `{ filename: './temp/app.db' }` |
| PostgreSQL | `'pg'` | `{ host, port, user, password, database }` ou connection string |
| MySQL | `'mysql2'` | `{ host, port, user, password, database }` |

## Output format

```
src/
├── database.ts       # Exporta instancia knex configurada
└── server.ts         # Importa knex de ./database para queries

temp/
└── app.db            # Banco SQLite (gitignored)
```

## Error handling

- Se `temp/` nao existe: criar a pasta antes de executar, porque o caminho do filename e relativo a raiz do projeto
- Se import falha: verificar que knex e o driver estao instalados como dependencias de producao
- Se query falha com "no such table": normal se nenhuma migration foi executada ainda — `sqlite_schema` sempre existe para teste

## Heuristics

| Situacao | Faca |
|----------|------|
| Desenvolvimento local | SQLite com pasta temp |
| Producao | PostgreSQL ou MySQL com variavel de ambiente |
| Testar conexao sem tabelas | Query em `sqlite_schema` |
| Nomear arquivo de banco | `.db` ou `.sqlite` — ambos reconhecidos |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Exportar setupKnex diretamente | Renomear import, exportar como `knex` |
| Instalar driver como devDependency | Instalar como dependencia de producao |
| Commitar arquivo .db no git | Adicionar *.db no .gitignore |
| Hardcodar connection string de producao | Usar variaveis de ambiente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
