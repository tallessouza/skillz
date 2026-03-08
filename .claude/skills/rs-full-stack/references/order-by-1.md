---
name: rs-full-stack-order-by-1
description: "Applies SQL ORDER BY clause patterns when writing SELECT queries that need sorting. Use when user asks to 'sort results', 'order by column', 'organize query output', 'list alphabetically', or 'combine WHERE with ORDER BY'. Enforces correct clause order (SELECT → WHERE → ORDER BY), ASC/DESC usage, and sorting for both numeric and text columns. Make sure to use this skill whenever generating SQL queries that return ordered results. Not for INSERT, UPDATE, DELETE operations or index optimization."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: sql
  tags: [sql, order-by, select, ordenacao, asc-desc]
---

# ORDER BY — Ordenacao de Registros no SELECT

> Utilize ORDER BY para controlar a ordem dos registros retornados, sempre respeitando a sequencia de clausulas do SQL.

## Rules

1. **ORDER BY vem depois de WHERE** — a ordem do SQL e `SELECT → FROM → WHERE → ORDER BY`, porque inverter causa erro de sintaxe
2. **ASC e o padrao** — omitir ASC ou escrever explicitamente produz o mesmo resultado (menor para maior, A-Z), porque o banco assume crescente por padrao
3. **Use DESC para inverter** — do maior para o menor (numeros) ou Z-A (texto), porque nao existe outra forma de inverter a ordenacao
4. **ORDER BY funciona com numeros e texto** — colunas numericas ordenam por valor, colunas de texto ordenam alfabeticamente, porque o banco detecta o tipo da coluna
5. **Combine WHERE + ORDER BY livremente** — filtre primeiro, ordene depois, porque WHERE reduz o conjunto e ORDER BY organiza o resultado

## How to write

### Ordenacao basica (crescente)

```sql
-- Padrao: menor para maior (ASC implicito)
SELECT * FROM products ORDER BY price;

-- Equivalente explicito
SELECT * FROM products ORDER BY price ASC;
```

### Ordenacao decrescente

```sql
-- Maior para menor
SELECT * FROM products ORDER BY price DESC;
```

### Ordenacao alfabetica

```sql
-- A-Z por nome
SELECT * FROM products ORDER BY name;

-- Z-A por nome
SELECT * FROM products ORDER BY name DESC;
```

### Combinando WHERE + ORDER BY

```sql
-- Filtra categoria e ordena por preco (menor para maior)
SELECT * FROM products
WHERE category = 'audio'
ORDER BY price;

-- Filtra e ordena do maior para menor
SELECT * FROM products
WHERE category = 'audio'
ORDER BY price DESC;
```

## Example

**Before (sem ordenacao):**
```sql
SELECT * FROM products;
-- Retorna na ordem de insercao (por ID), sem controle
```

**After (com ORDER BY aplicado):**
```sql
-- Produtos mais caros primeiro
SELECT * FROM products ORDER BY price DESC;

-- Clientes em ordem alfabetica filtrados por cidade
SELECT * FROM clients
WHERE city = 'São Paulo'
ORDER BY name;
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Listar produtos/clientes para exibicao | ORDER BY name (alfabetico) |
| Mostrar mais caros/recentes primeiro | ORDER BY price DESC ou ORDER BY created_at DESC |
| Filtrar E ordenar | WHERE primeiro, ORDER BY depois |
| Nao precisa de ordem especifica | Omita ORDER BY (banco retorna por ordem de registro) |
| Quer deixar a ordenacao explicita | Escreva ASC mesmo sendo padrao, para clareza |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `SELECT * FROM products WHERE price ORDER BY category = 'x'` | `SELECT * FROM products WHERE category = 'x' ORDER BY price` |
| `ORDER BY price DESK` (typo) | `ORDER BY price DESC` |
| `WHERE category = 'x' ORDER BY price WHERE active = true` | `WHERE category = 'x' AND active = true ORDER BY price` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Erro de sintaxe na query com ORDER BY | ORDER BY antes de WHERE | Corrija a ordem: `SELECT → FROM → WHERE → ORDER BY` |
| Ordenacao nao funciona como esperado | Coluna contem texto com numeros (ex: "10" antes de "2") | Converta para tipo numerico ou use `CAST` na ordenacao |
| `ORDER BY price DESK` da erro | Typo no DESC | Corrija para `DESC` (sem K) |
| Resultado nao esta ordenado | ORDER BY omitido da query | Adicione `ORDER BY coluna` ao final do SELECT |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ordem de clausulas, ASC/DESC e comportamento padrao
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-order-by-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-order-by-1/references/code-examples.md)
