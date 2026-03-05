---
name: rs-full-stack-avg
description: "Applies SQL AVG aggregate function patterns when writing database queries. Use when user asks to 'calculate average', 'get mean value', 'average price', 'media de valores', or any query involving averages. Enforces correct AVG syntax with column specification, FROM clause, and optional WHERE filtering. Make sure to use this skill whenever generating SQL queries that compute averages. Not for SUM, COUNT, MIN, MAX, or other aggregate functions."
---

# SQL AVG — Calculando Médias

> Use AVG(coluna) para calcular a média de valores numéricos, sempre especificando a coluna e a tabela.

## Rules

1. **Passe a coluna dentro do AVG** — `AVG(Price)` não `AVG(*)`, porque AVG precisa de uma coluna numérica específica
2. **Sempre declare FROM** — `SELECT AVG(Price) FROM Products`, porque sem FROM o banco não sabe onde buscar
3. **Combine com WHERE para filtrar** — `AVG(Price) ... WHERE category = 'áudio'`, porque média sem contexto raramente é útil
4. **Strings entre aspas no WHERE** — `WHERE category = 'áudio'` não `WHERE category = áudio`, porque valores texto exigem aspas
5. **AVG = Average** — nome vem de "average" (média em inglês), facilita memorizar

## How to write

### Média simples de uma coluna

```sql
SELECT AVG(Price) FROM Products;
```

### Média com filtro por categoria

```sql
SELECT AVG(Price)
FROM Products
WHERE category = 'áudio';
```

### Média com alias descritivo

```sql
SELECT AVG(Price) AS average_price
FROM Products
WHERE category = 'áudio';
```

## Example

**Before (erro comum):**
```sql
-- Tentando calcular média sem especificar coluna
SELECT AVG(*) FROM Products;

-- Ou sem FROM
SELECT AVG(Price);
```

**After (com esta skill aplicada):**
```sql
SELECT AVG(Price) FROM Products;

-- Com filtro
SELECT AVG(Price)
FROM Products
WHERE category = 'áudio';
```

## Heuristics

| Situação | Faça |
|----------|------|
| Média geral de uma coluna | `SELECT AVG(coluna) FROM tabela` |
| Média filtrada por condição | Adicione `WHERE` após `FROM` |
| Precisa nomear o resultado | Use `AS alias_descritivo` |
| Múltiplas médias | Múltiplos `AVG()` no mesmo SELECT |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `AVG(*)` | `AVG(Price)` — especifique a coluna |
| `SELECT AVG(Price)` (sem FROM) | `SELECT AVG(Price) FROM Products` |
| `WHERE category = áudio` | `WHERE category = 'áudio'` — aspas no texto |
| `SELECT Price FROM ...` e calcular no app | `SELECT AVG(Price) FROM ...` — deixe o banco calcular |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre AVG, quando usar e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-avg/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-avg/references/code-examples.md)
