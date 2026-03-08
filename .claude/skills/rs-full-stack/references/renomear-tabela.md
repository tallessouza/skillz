---
name: rs-full-stack-renomear-tabela
description: "Applies correct SQL syntax for renaming tables using ALTER TABLE RENAME TO. Use when user asks to 'rename a table', 'change table name', 'alter table name', or 'fix table name in SQL'. Make sure to use this skill whenever generating SQL that modifies table names. Not for renaming columns, indexes, or other database objects."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql-fundamentals
  tags: [sql, alter-table, rename, ddl, schema]
---

# Renomear Tabela SQL

> Use `ALTER TABLE ... RENAME TO` para renomear tabelas, nunca recrie a tabela.

## Rules

1. **Use ALTER TABLE com RENAME TO** — `ALTER TABLE old_name RENAME TO new_name`, porque preserva dados, índices e relacionamentos existentes
2. **Nunca recrie a tabela para renomear** — recriar perde dados e quebra foreign keys
3. **Atualize todas as referências** — queries, views e foreign keys que referenciam o nome antigo precisam ser atualizadas após o rename

## How to write

```sql
-- Renomear tabela
ALTER TABLE products RENAME TO items;

-- Reverter se necessário
ALTER TABLE items RENAME TO products;
```

## Example

**Before (incorreto — recriar tabela):**
```sql
CREATE TABLE items AS SELECT * FROM products;
DROP TABLE products;
```

**After (com esta skill):**
```sql
ALTER TABLE products RENAME TO items;
```

## Heuristics

| Situação | Faça |
|----------|------|
| Nome da tabela com erro de digitação | `ALTER TABLE wrong_name RENAME TO correct_name` |
| Mudança de domínio (products → items) | `ALTER TABLE` + atualizar queries dependentes |
| Tabela referenciada por FKs | Verificar se o banco atualiza FKs automaticamente (PostgreSQL sim, MySQL depende) |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `CREATE TABLE new AS SELECT * FROM old; DROP TABLE old;` | `ALTER TABLE old RENAME TO new;` |
| `DROP TABLE` + `CREATE TABLE` para renomear | `ALTER TABLE ... RENAME TO` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Foreign keys quebradas apos rename | Banco nao atualizou FKs automaticamente | Verifique e atualize FKs manualmente (depende do SGBD) |
| Queries retornam "table not found" | Queries ainda referenciam o nome antigo | Atualize todas as queries, views e stored procedures |
| Dados perdidos ao "renomear" | Usou CREATE + DROP em vez de RENAME TO | Use `ALTER TABLE old RENAME TO new` que preserva dados |
| Erro de permissao ao renomear | Usuario sem privilegio ALTER na tabela | Conceda privilegio ALTER ou use usuario admin |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-renomear-tabela/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-renomear-tabela/references/code-examples.md)
