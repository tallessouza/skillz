---
name: rs-full-stack-where-com-igual
description: "Enforces correct SQL SELECT and WHERE equality patterns when writing database queries. Use when user asks to 'query a table', 'filter records', 'select from database', 'write a SELECT', or 'find rows where'. Applies rules: specify columns instead of asterisk, use exact equality with case sensitivity awareness, quote text values, no quotes for numbers. Make sure to use this skill whenever generating SQL queries with equality filters. Not for INSERT, UPDATE, DELETE, or advanced WHERE operators (LIKE, IN, BETWEEN)."
---

# SQL SELECT com WHERE Igual

> Ao consultar dados, especifique colunas explicitamente e use o operador de igualdade com consciencia de case sensitivity.

## Rules

1. **Especifique colunas em vez de asterisco** — `SELECT id, name` nao `SELECT *`, porque em tabelas grandes o asterisco traz dados desnecessarios e compromete performance
2. **Aspas em valores texto, sem aspas em numeros** — `WHERE name = 'Mouse'` e `WHERE price = 1200`, porque o SQL diferencia tipos e aspas erradas causam erro ou cast implicito
3. **Respeite case sensitivity** — `'Mouse'` nao e igual a `'mouse'` na maioria dos bancos, porque a maioria dos bancos SQL sao case sensitive por padrao
4. **Igualdade e exata** — o operador `=` retorna apenas registros com valor identico, sem correspondencia parcial
5. **Ordem das colunas no SELECT define a exibicao** — `SELECT name, id` exibe name primeiro, independente da ordem na tabela

## How to write

### SELECT com colunas especificas
```sql
-- Sempre listar as colunas necessarias
SELECT id, name, category
FROM products;
```

### WHERE com texto (entre aspas)
```sql
SELECT *
FROM products
WHERE name = 'Mouse';
```

### WHERE com numero (sem aspas)
```sql
SELECT *
FROM products
WHERE price = 1200;
```

## Example

**Before (problematico):**
```sql
-- Asterisco desnecessario + case errado
SELECT * FROM products WHERE name = 'mouse';
-- Retorna ZERO registros se o valor salvo e 'Mouse'
```

**After (correto):**
```sql
SELECT id, name, price
FROM products
WHERE name = 'Mouse';
-- Retorna apenas o registro com nome exatamente 'Mouse'
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Tabela pequena em desenvolvimento | `SELECT *` aceitavel para debug rapido |
| Tabela grande em producao | Sempre listar colunas explicitamente |
| Filtro por texto | Verificar case exato do valor no banco |
| Filtro por numero | Usar valor sem aspas |
| Frontend envia parametro de busca | Tratar case no frontend antes de enviar ao banco |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `SELECT * FROM products` (producao) | `SELECT id, name, price FROM products` |
| `WHERE name = 'mouse'` (se valor e 'Mouse') | `WHERE name = 'Mouse'` |
| `WHERE price = '1200'` | `WHERE price = 1200` |
| `WHERE name = '%Mouse%'` (quando quer exato) | `WHERE name = 'Mouse'` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre case sensitivity e performance de SELECT
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes