---
name: rs-full-stack-aliases
description: "Applies SQL alias conventions when writing SELECT queries with AS keyword, column renaming, and aggregate labeling. Use when user asks to 'write a query', 'select from database', 'rename column', 'use COUNT', or any SQL query task. Ensures aliases use AS explicitly, quotes for compound names, and descriptive labels for aggregates. Make sure to use this skill whenever generating SQL queries with computed columns or unclear column names. Not for table creation, migrations, or ORM model definitions."
---

# SQL Aliases

> Toda coluna computada ou ambigua recebe um alias descritivo com AS explicito.

## Rules

1. **Sempre use AS explicito** — `COUNT(*) AS total` nao `COUNT(*) total`, porque AS deixa claro que e um alias e nao um comando SQL
2. **Nomeie pelo conteudo, nao pela funcao** — `AS total_de_produtos` nao `AS contagem`, porque o alias deve comunicar o significado do valor retornado
3. **Nomes simples sem aspas** — `AS total` funciona direto, sem necessidade de aspas ou colchetes
4. **Nomes compostos entre aspas ou colchetes** — `AS "total de produtos"` ou `AS [total de produtos]`, porque o SQL interpreta espacos como separadores de comandos
5. **Alias e apenas exibicao** — nunca altera a estrutura da tabela, e um apelido temporario no resultado da query
6. **Renomeie colunas ambiguas** — `id AS product_code` quando o nome original nao comunica o contexto no resultado

## How to write

### Agregacoes com alias

```sql
-- Sempre nomeie o resultado de funcoes agregadas
SELECT COUNT(*) AS total_de_produtos
FROM products;

SELECT AVG(price) AS preco_medio
FROM products;
```

### Renomeando colunas da tabela

```sql
-- Quando o nome original e generico no contexto do resultado
SELECT
  id AS product_code,
  name AS product_name,
  price AS unit_price
FROM products;
```

### Nomes compostos

```sql
-- Com aspas duplas
SELECT COUNT(*) AS "total de produtos"
FROM products;

-- Com colchetes (SQL Server / SQLite)
SELECT COUNT(*) AS [total de produtos]
FROM products;
```

## Example

**Before (resultado ambiguo):**

```sql
SELECT COUNT(*) FROM products;
-- Retorna: coluna chamada "COUNT(*)" com valor 5 — ninguem sabe o que significa
```

**After (com alias descritivo):**

```sql
SELECT COUNT(*) AS total_de_produtos FROM products;
-- Retorna: coluna chamada "total_de_produtos" com valor 5 — claro e intuitivo
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Funcao agregada (COUNT, SUM, AVG, etc.) | Sempre adicione alias descritivo |
| Coluna com nome generico (id, name) em JOIN | Renomeie com contexto: `users.id AS user_id` |
| Nome composto com espacos | Use aspas duplas ou colchetes |
| Nome simples de uma palavra | Sem aspas, direto apos AS |
| Coluna ja tem nome claro no contexto | Alias opcional |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `SELECT COUNT(*)` (sem alias) | `SELECT COUNT(*) AS total` |
| `COUNT(*) total` (sem AS) | `COUNT(*) AS total` |
| `AS total de produtos` (sem aspas) | `AS "total de produtos"` |
| `id` em query com JOIN sem contexto | `id AS product_id` |
| `AS x` ou `AS t` (abreviacoes) | `AS total_products` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes