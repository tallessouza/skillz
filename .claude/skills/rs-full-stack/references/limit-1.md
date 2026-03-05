---
name: rs-full-stack-limit-1
description: "Applies SQL LIMIT clause patterns when writing database queries. Use when user asks to 'query database', 'list top N', 'get first records', 'paginate results', or 'limit SQL results'. Enforces correct ORDER BY + LIMIT composition for ranking queries. Make sure to use this skill whenever generating SQL that returns a subset of rows. Not for application-level pagination logic, ORM configuration, or cursor-based pagination."
---

# SQL LIMIT

> Usar LIMIT para controlar a quantidade exata de registros retornados, sempre combinado com ORDER BY quando a ordem importa.

## Rules

1. **Sempre combine ORDER BY com LIMIT** — `LIMIT` sem `ORDER BY` retorna registros em ordem arbitraria, porque o banco nao garante ordem sem ORDER BY explicito
2. **Especifique a direcao do ORDER BY** — use `DESC` para rankings do maior ao menor, `ASC` para o inverso, porque a omissao assume ASC e pode inverter o resultado esperado
3. **LIMIT vai sempre no final da query** — apos WHERE, ORDER BY, e GROUP BY, porque e a ultima clausula processada pelo SQL
4. **Use LIMIT 1 para buscar o primeiro de um ranking** — `ORDER BY price DESC LIMIT 1` retorna o mais caro, porque e mais eficiente que trazer tudo e filtrar na aplicacao

## How to write

### Top N mais caros/maiores

```sql
SELECT *
FROM products
ORDER BY price DESC
LIMIT 3;
```

### Primeiro do ranking

```sql
SELECT *
FROM products
ORDER BY price DESC
LIMIT 1;
```

### Top N mais recentes

```sql
SELECT *
FROM orders
ORDER BY created_at DESC
LIMIT 10;
```

## Example

**Before (retorna tudo e filtra na aplicacao):**

```sql
SELECT * FROM products ORDER BY price DESC;
-- depois na aplicacao: results.slice(0, 3)
```

**After (filtra no banco):**

```sql
SELECT * FROM products ORDER BY price DESC LIMIT 3;
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa dos N maiores/menores | `ORDER BY column DESC/ASC LIMIT N` |
| Precisa de apenas 1 registro | `LIMIT 1` — mais eficiente que trazer todos |
| Paginacao simples | `LIMIT N OFFSET M` |
| Sem ORDER BY definido | Adicione ORDER BY antes do LIMIT, senao resultado e imprevisivel |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `SELECT * FROM products LIMIT 3` (sem ORDER BY) | `SELECT * FROM products ORDER BY price DESC LIMIT 3` |
| Trazer tudo e filtrar na aplicacao | Usar LIMIT direto no SQL |
| `ORDER BY price LIMIT 3` (direcao implicita) | `ORDER BY price DESC LIMIT 3` (direcao explicita) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre LIMIT, ordem de execucao SQL e performance
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-limit-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-limit-1/references/code-examples.md)
