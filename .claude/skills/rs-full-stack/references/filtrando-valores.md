---
name: rs-full-stack-filtrando-valores
description: "Enforces correct SQL WHERE clause filtering with comparison operators when writing database queries. Use when user asks to 'filter records', 'query database', 'write SQL', 'select where', or 'find rows matching condition'. Applies comparison operators including equals, not-equal, greater-than, less-than, and their or-equal variants. Make sure to use this skill whenever generating SQL queries with conditions. Not for JOIN operations, subqueries, or aggregate functions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql-queries
  tags: [sql, where, comparison-operators, filtering, select]
---

# Filtrando Valores com WHERE no SQL

> Use a clausula WHERE com operadores de comparacao para filtrar registros de forma precisa e previsivel.

## Rules

1. **Use `<>` para diferente, nunca `!=`** — `WHERE price <> 800` nao `WHERE price != 800`, porque `<>` e o padrao SQL ANSI e funciona em todos os bancos
2. **Entenda a diferenca entre `>` e `>=`** — `> 550` exclui 550, `>= 550` inclui 550, porque o operador estrito descarta o valor exato do limite
3. **Use `>=` ou `<=` quando o valor limite deve ser incluido** — `WHERE price >= 550` inclui produtos com preco exatamente 550, porque sem o igual o registro do limite fica de fora
4. **Sempre especifique a coluna antes do operador** — `WHERE price > 500` nao `WHERE > 500 price`, porque SQL exige coluna-operador-valor nessa ordem
5. **Teste com valores conhecidos primeiro** — verifique se o filtro retorna o esperado com um valor que voce sabe existir, porque isso valida a logica antes de refinar

## How to write

### Igualdade e diferenca

```sql
-- Buscar valor exato
SELECT * FROM products WHERE price = 800;

-- Excluir valor especifico (todos MENOS os de preco 800)
SELECT * FROM products WHERE price <> 800;
```

### Maior e menor (sem incluir o limite)

```sql
-- Produtos com preco ACIMA de 550 (550 fica de fora)
SELECT * FROM products WHERE price > 550;

-- Produtos com preco ABAIXO de 600 (600 fica de fora)
SELECT * FROM products WHERE price < 600;
```

### Maior ou igual / menor ou igual (incluindo o limite)

```sql
-- Produtos com preco a partir de 550 (550 incluso)
SELECT * FROM products WHERE price >= 550;

-- Produtos com preco ate 800 (800 incluso)
SELECT * FROM products WHERE price <= 800;
```

## Example

**Before (erro comum — exclui o valor limite sem querer):**
```sql
-- Quero todos os produtos a partir de R$550
SELECT * FROM products WHERE price > 550;
-- PROBLEMA: produto de R$550,00 nao aparece!
```

**After (com esta skill aplicada):**
```sql
-- Todos os produtos a partir de R$550 (inclusive)
SELECT * FROM products WHERE price >= 550;
-- CORRETO: produto de R$550,00 agora aparece
```

## Heuristics

| Situacao | Operador |
|----------|----------|
| Buscar valor exato | `=` |
| Excluir valor especifico | `<>` |
| Acima de X (sem incluir X) | `>` |
| Abaixo de X (sem incluir X) | `<` |
| A partir de X (incluindo X) | `>=` |
| Ate X (incluindo X) | `<=` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `WHERE price != 800` | `WHERE price <> 800` |
| `WHERE price > 550` (querendo incluir 550) | `WHERE price >= 550` |
| `WHERE price < 800` (querendo incluir 800) | `WHERE price <= 800` |
| `WHERE 800 = price` | `WHERE price = 800` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Filtro exclui registro que deveria incluir | Uso de `>` em vez de `>=` (ou `<` em vez de `<=`) | Usar operador com igual quando o limite deve ser incluso |
| `!=` causa erro em alguns bancos | Operador nao padrao SQL ANSI | Substituir por `<>` que funciona em todos os bancos |
| Query retorna 0 resultados inesperadamente | Valor comparado nao existe na coluna | Testar com `SELECT DISTINCT coluna` para ver valores existentes |
| Comparacao com string falha silenciosamente | Falta aspas simples ao redor do valor string | Usar `WHERE name = 'valor'` com aspas simples |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cada operador e quando usar
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes