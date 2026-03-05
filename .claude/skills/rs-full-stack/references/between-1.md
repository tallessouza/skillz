---
name: rs-full-stack-between-1
description: "Applies SQL BETWEEN clause for range filtering in database queries. Use when user asks to 'filter by range', 'query between values', 'SQL where between', 'filter prices', or any SQL query involving numeric/date intervals. Ensures BETWEEN syntax over verbose >= AND <= comparisons. Make sure to use this skill whenever writing SQL range filters. Not for non-range conditions like IN, LIKE, or equality checks."
---

# SQL BETWEEN — Filtro de Intervalos

> Ao filtrar intervalos de valores em SQL, use BETWEEN para expressar a intencao de forma sintetica e legivel.

## Rules

1. **Use BETWEEN para intervalos** — `BETWEEN min AND max` em vez de `>= min AND <= max`, porque BETWEEN e mais sintetico e comunica a intencao de intervalo diretamente
2. **BETWEEN e inclusivo** — inclui os dois extremos (equivale a `>= AND <=`), porque esquecer isso causa bugs silenciosos de off-by-one
3. **Valor minimo primeiro** — `BETWEEN 600 AND 1200` nao `BETWEEN 1200 AND 600`, porque a ordem invertida retorna zero resultados sem erro
4. **Use >= / <= quando precisar de exclusao** — se precisa de `> min` (exclusivo), BETWEEN nao serve, use operadores explicitos

## How to write

### Filtro com BETWEEN

```sql
-- Selecionar produtos com preco entre 600 e 1200 (inclusivo)
SELECT *
FROM products
WHERE price BETWEEN 600 AND 1200;
```

### Equivalente sem BETWEEN (evitar quando possivel)

```sql
-- Mesmo resultado, mas mais verboso
SELECT *
FROM products
WHERE price >= 600
  AND price <= 1200;
```

## Example

**Before (verboso):**
```sql
SELECT * FROM products
WHERE price >= 600 AND price <= 1200;
```

**After (com BETWEEN):**
```sql
SELECT * FROM products
WHERE price BETWEEN 600 AND 1200;
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Intervalo inclusivo nos dois extremos | `BETWEEN min AND max` |
| Precisa excluir um dos extremos | `> min AND <= max` (operadores explicitos) |
| Filtro de datas em intervalo | `BETWEEN '2024-01-01' AND '2024-12-31'` |
| Apenas um limite (ex: preco > 100) | Operador simples, sem BETWEEN |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `WHERE price >= 600 AND price <= 1200` | `WHERE price BETWEEN 600 AND 1200` |
| `BETWEEN 1200 AND 600` (ordem invertida) | `BETWEEN 600 AND 1200` |
| `BETWEEN` quando precisa de exclusao | `> 600 AND <= 1200` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar BETWEEN vs operadores
- [code-examples.md](references/code-examples.md) — Exemplos expandidos com datas, numeros e variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-between-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-between-1/references/code-examples.md)
