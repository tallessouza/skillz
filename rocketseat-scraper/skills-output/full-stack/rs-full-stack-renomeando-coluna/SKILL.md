---
name: rs-full-stack-renomeando-coluna
description: "Applies SQL ALTER TABLE RENAME COLUMN syntax when renaming database columns. Use when user asks to 'rename a column', 'change column name', 'alter table rename', or 'modify field name' in SQL. Ensures correct RENAME COLUMN ... TO syntax. Make sure to use this skill whenever generating SQL that changes column names. Not for adding, dropping, or changing column types."
---

# Renomear Coluna com SQL

> Use ALTER TABLE com RENAME COLUMN para renomear colunas de forma segura e declarativa.

## Rules

1. **Use RENAME COLUMN, nunca workarounds** — `ALTER TABLE ... RENAME COLUMN old TO new`, porque e o comando padrao SQL e preserva dados, indices e constraints
2. **Sempre especifique a tabela** — `ALTER TABLE product RENAME COLUMN ...`, porque omitir a tabela causa erro de sintaxe
3. **Use TO entre os nomes** — a keyword `TO` separa o nome antigo do novo, porque e parte obrigatoria da sintaxe

## How to write

### Renomear uma coluna

```sql
ALTER TABLE product
RENAME COLUMN name TO description;
```

### Reverter a renomeacao

```sql
ALTER TABLE product
RENAME COLUMN description TO name;
```

## Example

**Before (tentativa incorreta):**
```sql
-- Errado: tentar UPDATE ou recriar a coluna
ALTER TABLE product DROP COLUMN name;
ALTER TABLE product ADD COLUMN description TEXT;
-- Perde todos os dados!
```

**After (com esta skill):**
```sql
-- Correto: renomeia preservando dados
ALTER TABLE product
RENAME COLUMN name TO description;
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Renomear campo existente | `ALTER TABLE t RENAME COLUMN old TO new` |
| Precisa reverter | Inverta os nomes no mesmo comando |
| Multiplas colunas | Execute um `RENAME COLUMN` por coluna |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Drop + Add column (perde dados) | `RENAME COLUMN old TO new` |
| Criar coluna nova e copiar dados | `RENAME COLUMN old TO new` |
| Usar UPDATE para "renomear" | `RENAME COLUMN old TO new` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes