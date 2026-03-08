---
name: rs-full-stack-adicionando-removendo-coluna
description: "Applies correct ALTER TABLE syntax when adding or removing columns in SQL databases. Use when user asks to 'add a column', 'remove a column', 'alter table', 'modify table structure', or 'change database schema'. Enforces ADD with type/constraints and DROP COLUMN syntax, plus safe execution practices. Make sure to use this skill whenever generating SQL DDL that modifies existing tables. Not for CREATE TABLE, INSERT, UPDATE, or SELECT queries."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [sql, alter-table, ddl, columns, database, schema]
---

# Adicionando e Removendo Colunas com ALTER TABLE

> Ao modificar tabelas existentes, use ALTER TABLE com ADD ou DROP COLUMN, sempre executando apenas o trecho desejado.

## Rules

1. **Use ALTER TABLE para modificar tabelas existentes** — `ALTER TABLE table_name ADD column_name TYPE`, porque CREATE TABLE so serve para tabelas novas
2. **Especifique constraints na adicao** — adicione `NOT NULL`, `DEFAULT`, etc. junto com a coluna, porque adicionar constraints depois e mais trabalhoso e pode falhar com dados existentes
3. **Use DROP COLUMN para remover** — `ALTER TABLE table_name DROP COLUMN column_name`, porque DELETE e DROP TABLE tem significados completamente diferentes
4. **Execute apenas o trecho necessario** — selecione o SQL especifico antes de rodar, porque executar o script inteiro pode rodar comandos indesejados (ADD seguido de DROP, por exemplo)

## How to write

### Adicionar coluna

```sql
ALTER TABLE products
ADD quantity INTEGER NOT NULL;
```

### Remover coluna

```sql
ALTER TABLE products
DROP COLUMN quantity;
```

### Adicionar com valor default (dados existentes)

```sql
ALTER TABLE products
ADD quantity INTEGER NOT NULL DEFAULT 0;
```

## Example

**Before (erro comum — misturar comandos no mesmo script sem selecionar):**

```sql
-- Script inteiro executa tudo de uma vez
ALTER TABLE products ADD quantity INTEGER NOT NULL;
ALTER TABLE products DROP COLUMN quantity;
-- Resultado: adicionou e removeu, efeito zero
```

**After (execucao segura por trecho):**

```sql
-- Executa APENAS esta linha (selecionar antes de rodar):
ALTER TABLE products ADD quantity INTEGER NOT NULL;

-- Depois, separadamente, se necessario:
-- ALTER TABLE products DROP COLUMN quantity;
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Adicionar coluna obrigatoria | `ADD column_name TYPE NOT NULL` |
| Adicionar coluna opcional | `ADD column_name TYPE` (permite NULL) |
| Tabela ja tem dados e coluna e NOT NULL | Adicione `DEFAULT valor` para nao quebrar |
| Remover coluna | `DROP COLUMN column_name` |
| Multiplas alteracoes no mesmo script | Execute cada ALTER separadamente |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `DROP TABLE products` (para remover coluna) | `ALTER TABLE products DROP COLUMN quantity` |
| `DELETE quantity FROM products` | `ALTER TABLE products DROP COLUMN quantity` |
| Rodar script inteiro com ADD e DROP juntos | Selecionar e executar cada comando separadamente |
| `ADD quantity` (sem tipo) | `ADD quantity INTEGER` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `NOT NULL constraint failed` ao adicionar coluna | Tabela ja tem dados e coluna NOT NULL sem DEFAULT | Adicione `DEFAULT valor` na definicao da coluna |
| `no such column` apos DROP | Coluna ja foi removida anteriormente | Verifique a estrutura atual com `PRAGMA table_info(table)` |
| ADD e DROP executaram juntos, efeito zero | Script inteiro foi executado de uma vez | Selecione e execute cada ALTER TABLE separadamente |
| `near "DROP": syntax error` | Sintaxe incorreta do DROP COLUMN | Use `ALTER TABLE table DROP COLUMN column` com nome completo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ALTER TABLE e praticas seguras de execucao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes