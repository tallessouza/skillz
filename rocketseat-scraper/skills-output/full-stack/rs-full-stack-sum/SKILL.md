---
name: rs-full-stack-sum
description: "Applies SQL SUM aggregate function when writing queries that total numeric columns. Use when user asks to 'sum values', 'total a column', 'calculate sum', 'aggregate prices', or 'sum query'. Ensures correct SUM syntax with numeric columns, WHERE filtering, and proper column selection. Make sure to use this skill whenever generating SQL that requires summing or totaling values. Not for COUNT, AVG, or other aggregate functions, nor for application-level arithmetic."
---

# SQL SUM — Soma de Valores

> Usar SUM exclusivamente com colunas numéricas, sempre especificando a tabela e opcionalmente filtrando com WHERE.

## Rules

1. **SUM apenas em colunas numéricas** — `SUM(price)` nao `SUM(name)`, porque colunas texto retornam zero sem erro, causando bugs silenciosos
2. **Sempre especifique a tabela** — `SELECT SUM(price) FROM products`, porque SUM sem FROM e invalido
3. **Combine com WHERE para somas parciais** — `SUM(price) ... WHERE category = 'Audio'`, porque somas filtradas sao o caso de uso mais comum em relatorios
4. **Use alias para clareza** — `SUM(price) AS total_price`, porque o resultado sem alias aparece como coluna sem nome

## How to write

### Soma total de uma coluna

```sql
SELECT SUM(price) FROM products;
```

### Soma com filtro

```sql
SELECT SUM(price) FROM products WHERE category = 'Áudio';
```

### Soma com alias descritivo

```sql
SELECT SUM(price) AS total_price FROM products;
```

## Example

**Before (erro silencioso — coluna texto):**
```sql
SELECT SUM(name) FROM products;
-- Retorna 0, sem erro. Bug silencioso.
```

**After (coluna numerica correta):**
```sql
SELECT SUM(price) FROM products;
-- Retorna a soma real dos precos: ex. 4500
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Somar todos os valores de uma coluna | `SELECT SUM(coluna) FROM tabela` |
| Somar apenas um subconjunto | Adicionar `WHERE` com o filtro desejado |
| Resultado aparece zerado inesperadamente | Verificar se a coluna e numerica |
| Precisa nomear o resultado | Usar `AS alias_name` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `SUM(name)` (coluna texto) | `SUM(price)` (coluna numerica) |
| `SELECT SUM(price)` sem FROM | `SELECT SUM(price) FROM products` |
| `SUM(*)` | `SUM(coluna_especifica)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes