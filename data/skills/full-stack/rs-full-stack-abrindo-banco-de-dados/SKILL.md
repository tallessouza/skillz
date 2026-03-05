---
name: rs-full-stack-abrindo-banco-de-dados
description: "Guides through opening and inspecting SQLite databases using Beekeeper Studio. Use when user asks to 'open database', 'view SQLite', 'inspect tables', 'connect to database with Beekeeper', or 'check migration history'. Applies steps for connecting Beekeeper to SQLite, verifying table structure, and inspecting migration history. Make sure to use this skill whenever setting up database visualization for a Node.js/Knex project. Not for creating migrations, writing queries, or database schema design."
---

# Abrindo Banco de Dados SQLite com Beekeeper

> Apos criar migrations, sempre verificar visualmente o banco para confirmar que a estrutura foi criada corretamente.

## Prerequisites

- Beekeeper Studio instalado
- Banco SQLite ja criado (migrations executadas)
- Arquivo `.db` existente no projeto

## Steps

### Step 1: Conectar ao banco

1. Abrir Beekeeper Studio
2. Clicar em "Nova Conexao"
3. Selecionar **SQLite** como tipo
4. Clicar em "Choose File" e navegar ate `src/database/database.db`
5. Nomear a conexao (ex: nome do projeto)
6. Clicar em **Save** e depois **Connect**

### Step 2: Verificar tabelas criadas pela migration

Apos conectar, verificar as tabelas presentes:

| Tabela | Proposito |
|--------|-----------|
| Tabela do dominio (ex: `courses`) | Dados da aplicacao |
| `sqlite_sequence` | Controle de auto-incremento do SQLite |
| `knex_migrations` | Historico de migrations executadas |
| `knex_migrations_lock` | Lock de controle de migrations |

### Step 3: Inspecionar estrutura das colunas

Clicar na tabela do dominio e verificar:
- Colunas correspondem ao que foi definido na migration
- Tipos inferidos corretamente (ex: `increments()` vira `INTEGER` automaticamente)
- Campos `created_at` / timestamps presentes se definidos

### Step 4: Verificar historico de migrations

```sql
SELECT * FROM knex_migrations;
```

Retorna: `id`, `name` (nome do arquivo da migration), `migration_time` (timestamp de execucao).

### Step 5: Verificar sequencia de auto-incremento

```sql
SELECT * FROM sqlite_sequence;
```

Retorna: `name` (tabela) e `seq` (ultimo valor usado no auto-incremento).

## Output format

Confirmacao visual de que:
- Tabela do dominio existe com colunas corretas
- Migration registrada no historico
- Banco pronto para receber dados

## Error handling

- Se arquivo `.db` nao encontrado: verificar se migrations foram executadas (`npx knex migrate:latest`)
- Se tabela nao aparece: verificar se a migration tem erro de sintaxe
- Se Beekeeper nao conecta: verificar se o path esta correto e o arquivo nao esta locked por outro processo

## Verification

- `SELECT * FROM tabela_dominio` retorna resultado vazio mas sem erro (tabela existe)
- `SELECT * FROM knex_migrations` mostra a migration executada com timestamp

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre tabelas internas do SQLite e Knex
- [code-examples.md](references/code-examples.md) — Queries de inspecao e exemplos de verificacao