---
name: rs-full-stack-remover-tabela
description: "Applies DROP TABLE syntax and safety practices when user asks to 'delete a table', 'remove a table', 'drop table', 'clean up schema', or 'reset database tables'. Enforces caution patterns and IF EXISTS usage. Make sure to use this skill whenever generating SQL that removes database structures. Not for deleting rows (DELETE), truncating data, or dropping columns."
---

# DROP TABLE — Remover Tabelas

> Ao remover tabelas, use sempre IF EXISTS e confirme dependencias antes de executar.

## Rules

1. **Use DROP TABLE IF EXISTS** — `DROP TABLE IF EXISTS nome_tabela;` nao `DROP TABLE nome_tabela;`, porque evita erro se a tabela ja foi removida
2. **Verifique dependencias antes** — cheque foreign keys e views que referenciam a tabela, porque DROP CASCADE pode destruir dados relacionados silenciosamente
3. **DROP TABLE e raro em producao** — use apenas em migrations controladas ou ambientes de desenvolvimento, porque em producao a perda de dados e irreversivel
4. **Prefira migrations reversiveis** — quando possivel, documente o CREATE TABLE correspondente para poder recriar, porque facilita rollback

## How to write

### DROP simples (desenvolvimento)

```sql
-- Remove tabela apenas se existir (seguro para scripts idemopotentes)
DROP TABLE IF EXISTS foods;
```

### DROP com dependencias (migration)

```sql
-- Remove tabelas na ordem correta (dependentes primeiro)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
```

## Example

**Before (perigoso):**
```sql
DROP TABLE foods;
-- Erro se tabela nao existe
-- Sem verificacao de dependencias
```

**After (com esta skill):**
```sql
-- Verificar dependencias antes de remover
DROP TABLE IF EXISTS foods;
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Script de setup/reset | Use DROP TABLE IF EXISTS antes do CREATE TABLE |
| Migration de producao | Gere backup antes, documente rollback |
| Ambiente de desenvolvimento | DROP TABLE IF EXISTS e seguro |
| Tabela com foreign keys apontando para ela | Remova tabelas dependentes primeiro ou use CASCADE com cautela |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `DROP TABLE nome;` | `DROP TABLE IF EXISTS nome;` |
| DROP sem verificar dependencias | Checar foreign keys antes |
| DROP em producao sem backup | `pg_dump` antes de DROP |
| DROP CASCADE sem entender impacto | Listar dependencias primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando e como usar DROP TABLE
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com variacoes e cenarios reais