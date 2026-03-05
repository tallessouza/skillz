---
name: rs-full-stack-group-by-1
description: "Applies SQL GROUP BY patterns when writing queries that aggregate data by categories. Use when user asks to 'count by category', 'group results', 'aggregate per type', 'sum by group', or any SQL query needing grouping. Enforces correct clause order (SELECT, FROM, WHERE, GROUP BY, ORDER BY), alias usage in ORDER BY, and multi-line formatting for readability. Make sure to use this skill whenever generating SQL with aggregate functions like COUNT, SUM, AVG combined with categories. Not for single-row aggregations without grouping, JOIN operations, or HAVING clause filtering."
---

# GROUP BY — Agrupando Registros em SQL

> Sempre que usar funcoes de agregacao (COUNT, SUM, AVG) com colunas de categoria, agrupe com GROUP BY para obter resultados por grupo, nao uma unica linha.

## Rules

1. **Sempre use GROUP BY com funcoes de agregacao quando houver colunas nao-agregadas no SELECT** — sem GROUP BY, o banco retorna apenas a primeira linha encontrada com o total geral, porque ele nao sabe que voce quer resultados por grupo
2. **Selecione a coluna de agrupamento, nao uma coluna arbitraria** — `SELECT category, COUNT(*)` nao `SELECT name, COUNT(*)`, porque o nome nao representa o grupo
3. **Use ALIAS para colunas agregadas** — `COUNT(*) AS total` torna o resultado legivel e permite referenciar no ORDER BY
4. **ORDER BY pode usar o ALIAS** — `ORDER BY total DESC` funciona porque o alias foi definido no SELECT
5. **WHERE vem antes do GROUP BY** — a ordem das clausulas e fixa: SELECT → FROM → WHERE → GROUP BY → ORDER BY
6. **Formate queries grandes em multiplas linhas** — uma clausula por linha facilita leitura e manutencao

## How to write

### Contagem por categoria

```sql
SELECT
  category,
  COUNT(*) AS total
FROM
  products
GROUP BY
  category
ORDER BY
  total DESC;
```

### Com filtro WHERE antes do GROUP BY

```sql
SELECT
  category,
  COUNT(*) AS total
FROM
  products
WHERE
  price > 600
GROUP BY
  category
ORDER BY
  total DESC;
```

## Example

**Before (erro comum — sem GROUP BY):**
```sql
SELECT name, COUNT(*) AS total FROM products;
-- Retorna: "MOUSE" | 5
-- Apenas o primeiro registro + contagem total, sem agrupamento
```

**After (com GROUP BY aplicado):**
```sql
SELECT
  category,
  COUNT(*) AS total
FROM
  products
GROUP BY
  category
ORDER BY
  total DESC;
-- Retorna: audio 2, acessorio 1, geral 1, imagem 1
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa contar/somar por categoria | SELECT coluna_grupo, COUNT(*) ... GROUP BY coluna_grupo |
| Quer ordenar pelo resultado agregado | Use ALIAS no SELECT e referencie no ORDER BY |
| Precisa filtrar ANTES de agrupar | WHERE vem antes do GROUP BY |
| Query ficou longa (3+ clausulas) | Uma clausula por linha |
| Quer do maior pro menor | ORDER BY total DESC |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `SELECT name, COUNT(*) FROM products` (sem GROUP BY) | `SELECT category, COUNT(*) AS total FROM products GROUP BY category` |
| `SELECT * FROM products GROUP BY category` | `SELECT category, COUNT(*) AS total FROM products GROUP BY category` |
| `... FROM products GROUP BY category WHERE price > 100` | `... FROM products WHERE price > 100 GROUP BY category` |
| `ORDER BY COUNT(*)` repetindo a funcao | `COUNT(*) AS total ... ORDER BY total` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que GROUP BY existe e como o banco processa sem ele
- [code-examples.md](references/code-examples.md) — Todos os exemplos SQL da aula com variacoes e cenarios adicionais