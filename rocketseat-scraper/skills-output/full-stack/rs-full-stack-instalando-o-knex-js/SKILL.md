---
name: rs-full-stack-instalando-o-knex-js
description: "Applies correct Knex.js and database driver installation when setting up a Node.js project with SQL database access. Use when user asks to 'install knex', 'setup query builder', 'add database to node project', 'configure sqlite', or 'install database driver'. Ensures correct package versions and driver pairing. Make sure to use this skill whenever setting up Knex.js in a JavaScript/TypeScript project. Not for Prisma, TypeORM, Drizzle, or other ORMs."
---

# Instalando o Knex.js

> Ao configurar acesso a banco de dados com Knex.js, instale sempre o query builder E o driver do banco juntos, com versoes especificas.

## Rules

1. **Instale Knex e driver juntos** — nunca instale apenas o Knex sem o driver do banco, porque Knex depende do driver para conectar
2. **Fixe versoes com @version** — use `knex@3.1.0` e `sqlite3@5.1.7` (ou versoes equivalentes do curso), porque versoes diferentes podem ter breaking changes
3. **Escolha o driver correto para o banco** — SQLite usa `sqlite3`, Postgres usa `pg`, MySQL usa `mysql2`, porque cada banco tem seu proprio driver de conexao

## Steps

### Step 1: Instalar Knex + Driver

```bash
# SQLite (usado no curso)
npm i knex@3.1.0 sqlite3@5.1.7

# Postgres (alternativa)
npm i knex@3.1.0 pg

# MySQL (alternativa)
npm i knex@3.1.0 mysql2
```

### Step 2: Verificar instalacao

Confirme que ambos os pacotes aparecem no `package.json` em `dependencies`.

## Driver por banco de dados

| Banco | Pacote driver | Exemplo |
|-------|--------------|---------|
| SQLite | `sqlite3` | `npm i knex sqlite3` |
| PostgreSQL | `pg` | `npm i knex pg` |
| MySQL | `mysql2` | `npm i knex mysql2` |
| MSSQL | `tedious` | `npm i knex tedious` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Instalar so o Knex sem driver | `npm i knex sqlite3` (ambos juntos) |
| Usar versao latest sem fixar | `npm i knex@3.1.0 sqlite3@5.1.7` |
| Instalar driver errado pro banco | Consulte a tabela acima |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre query builders vs ORMs e escolha do Knex
- [code-examples.md](references/code-examples.md) — Comandos de instalacao para todos os bancos suportados