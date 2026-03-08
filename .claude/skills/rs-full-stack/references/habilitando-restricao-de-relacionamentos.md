---
name: rs-full-stack-habilitando-restricao-relacionamentos
description: "Enforces foreign key constraint configuration in Knex.js with SQLite when setting up database connections. Use when user asks to 'configure knex', 'setup sqlite foreign keys', 'enable foreign key constraints', 'knexfile configuration', or 'database relationships in knex'. Make sure to use this skill whenever configuring Knex.js with SQLite to prevent data inconsistency. Not for PostgreSQL/MySQL setups where foreign keys are enabled by default."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: database-knex
  tags: [knex, sqlite, foreign-keys, pragma, database-config]
---

# Habilitando Restricao de Relacionamentos no Knex.js

> Ao configurar Knex.js com SQLite, habilitar `pragma foreign_keys = ON` no pool de conexao para garantir integridade referencial.

## Rules

1. **Sempre configure `afterCreate` no pool** — SQLite desabilita foreign keys por padrao, sem esse hook relacionamentos nao sao respeitados e dados inconsistentes entram no banco
2. **Use `pool.afterCreate`** — nunca confie que o SQLite vai validar chaves estrangeiras automaticamente, porque cada nova conexao no pool inicia com foreign keys desabilitadas
3. **Chame `done()` apos `connection.run`** — o callback `done` sinaliza que a conexao esta pronta para uso, sem isso o pool trava

## How to write

### Configuracao do knexfile.ts

```typescript
import type { Knex } from "knex"

const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./db/app.db",
  },
  pool: {
    afterCreate: (connection: any, done: Function) => {
      connection.run("PRAGMA foreign_keys = ON", done)
    },
  },
  useNullAsDefault: true,
}

export default config
```

## Example

**Before (foreign keys ignoradas — permite dados inconsistentes):**
```typescript
const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./db/app.db",
  },
}
// Inserir pedido com produto_id inexistente NAO gera erro
```

**After (foreign keys habilitadas — integridade garantida):**
```typescript
const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./db/app.db",
  },
  pool: {
    afterCreate: (connection: any, done: Function) => {
      connection.run("PRAGMA foreign_keys = ON", done)
    },
  },
}
// Inserir pedido com produto_id inexistente gera erro de constraint
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Usando SQLite com Knex.js | Sempre adicionar `pool.afterCreate` com pragma |
| Usando PostgreSQL/MySQL | Foreign keys ja habilitadas por padrao, nao precisa |
| Testes com banco in-memory | Tambem precisa do pragma, cada conexao reseta |
| Erro silencioso de FK | Verificar se pragma esta configurado |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Confiar que SQLite valida FKs sozinho | Configurar `PRAGMA foreign_keys = ON` no pool |
| Esquecer o callback `done` | Sempre passar `done` como segundo argumento do `connection.run` |
| Colocar pragma no migration | Colocar no `pool.afterCreate` do knexfile |
| Validar FKs manualmente na aplicacao | Deixar o banco enforcar via pragma |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Foreign key nao validada ao inserir dados | Pragma `foreign_keys = ON` nao configurado | Adicione `pool.afterCreate` com `PRAGMA foreign_keys = ON` no knexfile |
| Pool de conexoes trava ao iniciar | Callback `done` nao esta sendo chamado no `afterCreate` | Passe `done` como segundo argumento de `connection.run()` |
| FK funciona no dev mas nao no teste | Banco in-memory reseta pragma a cada conexao | Configure o pragma no `afterCreate` tambem no ambiente de teste |
| Erro "SQLITE_CONSTRAINT: FOREIGN KEY constraint failed" | Tentando inserir referencia a registro inexistente | Verifique se o registro pai existe antes de inserir o registro filho |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que SQLite desabilita FKs e impacto na consistencia
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variacoes e cenarios de erro