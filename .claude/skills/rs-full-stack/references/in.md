---
name: rs-full-stack-in
description: "Applies SQL IN clause for multi-value filtering when writing SELECT queries. Use when user asks to 'filter by multiple values', 'select where column matches several options', 'query with a list of values', or 'use IN in SQL'. Ensures correct syntax for both numeric and text values. Make sure to use this skill whenever generating SQL with multiple value conditions that would otherwise require chained OR clauses. Not for JOIN operations, subqueries with IN, or single-value WHERE clauses."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql-fundamentals
  tags: [sql, in-clause, where, filtering, select]
---

# SQL IN — Filtro com Múltiplos Valores

> Use IN para filtrar por uma lista de valores em vez de encadear múltiplos OR.

## Rules

1. **Use IN em vez de OR encadeado** — `WHERE price IN (800, 550)` não `WHERE price = 800 OR price = 550`, porque IN é mais legível e escalável quando a lista cresce
2. **Valores de texto entre aspas simples** — `WHERE category IN ('image', 'audio')` não `WHERE category IN (image, audio)`, porque texto sem aspas causa erro de sintaxe
3. **Valores numéricos sem aspas** — `WHERE price IN (800, 550, 1200)` não `WHERE price IN ('800', '550')`, porque aspas em números podem causar coerção implícita
4. **Separe valores por vírgula** — cada valor dentro dos parênteses separado por vírgula, sem vírgula final

## How to write

### Filtro numérico com IN

```sql
SELECT *
FROM products
WHERE price IN (800, 550, 1200);
```

### Filtro de texto com IN

```sql
SELECT *
FROM products
WHERE category IN ('image', 'audio');
```

## Example

**Before (OR encadeado):**

```sql
SELECT *
FROM products
WHERE price = 800 OR price = 550 OR price = 1200;
```

**After (com IN):**

```sql
SELECT *
FROM products
WHERE price IN (800, 550, 1200);
```

## Heuristics

| Situação | Faça |
|----------|------|
| Filtrar por 2+ valores na mesma coluna | Use IN |
| Filtrar por 1 valor só | Use `=` direto |
| Filtrar por valores que NÃO quer | Use `NOT IN` |
| Lista vem de uma subquery | Use `IN (SELECT ...)` |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `WHERE col = 'a' OR col = 'b' OR col = 'c'` | `WHERE col IN ('a', 'b', 'c')` |
| `WHERE price IN ('800', '550')` (numérico com aspas) | `WHERE price IN (800, 550)` |
| `WHERE category IN (image, audio)` (texto sem aspas) | `WHERE category IN ('image', 'audio')` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Erro de sintaxe com IN | Texto sem aspas simples | Envolver valores de texto com aspas simples: `'valor'` |
| Resultado vazio inesperado | Valores na lista nao existem na tabela | Verificar com `SELECT DISTINCT coluna FROM tabela` |
| Tipo incorreto no filtro | Numeros entre aspas ou texto sem aspas | Usar aspas apenas para texto, numeros sem aspas |
| Virgula extra no final da lista | Virgula apos ultimo valor dentro do IN | Remover virgula apos o ultimo valor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes