---
name: rs-node-js-2023-queries-knex
description: "Applies Knex.js query patterns when writing database operations in Node.js APIs. Use when user asks to 'insert data', 'query database', 'fetch records', 'create CRUD', 'use knex', or any database operation with Knex. Covers insert with returning, select, where clauses, and UUID generation. Make sure to use this skill whenever generating Knex database code. Not for raw SQL, Prisma, Drizzle, or other ORMs."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: knex-queries
  tags: [knex, query, insert, select, where, returning, uuid, database]
---

# Realizando Queries com Knex

> Ao escrever operacoes de banco com Knex, sempre encadeie `.returning('*')` em insercoes e use nomes descritivos para os resultados.

## Rules

1. **Sempre use `.returning('*')` em inserts** — sem isso o Knex retorna apenas o numero de linhas afetadas (ex: `[1]`), nao os dados inseridos, porque o SQL padrao nao retorna dados apos INSERT
2. **Gere UUIDs com `crypto.randomUUID()`** — use o modulo nativo `node:crypto`, sem dependencias externas, porque o Node ja oferece geracao de UUID v4
3. **Nomeie o resultado pelo conteudo** — `const transaction = ...` nao `const result = ...`, porque o nome deve descrever o que foi inserido/buscado
4. **Use `.select('*')` explicitamente** — em vez de confiar em comportamento implicito, deixe claro quais campos esta buscando
5. **Encadeie `.where()` para filtros** — Knex oferece metodos encadeados type-safe, use-os em vez de construir strings SQL

## How to write

### Insert com returning

```typescript
import { randomUUID } from 'node:crypto'

const transaction = await knex('transactions')
  .insert({
    id: randomUUID(),
    title: 'Salario',
    amount: 5000,
  })
  .returning('*')
```

### Select all

```typescript
const transactions = await knex('transactions').select('*')
```

### Select com where

```typescript
const transactions = await knex('transactions')
  .where('amount', 1000)
  .select('*')
```

## Example

**Before (sem returning, nomes genericos):**
```typescript
const data = await knex('transactions').insert({
  id: randomUUID(),
  title: 'Teste',
  amount: 1000,
})
// data = [1] — apenas numero de linhas, nao os dados
```

**After (com returning, nome descritivo):**
```typescript
const transaction = await knex('transactions')
  .insert({
    id: randomUUID(),
    title: 'Teste',
    amount: 1000,
  })
  .returning('*')
// transaction = [{ id: '...', title: 'Teste', amount: 1000, ... }]
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Insert e precisa dos dados de volta | `.returning('*')` |
| Insert e nao precisa do retorno | Sem `.returning()`, aceite o `[1]` |
| Campo opcional na migration (nullable) | Nao precisa enviar no insert |
| Precisa de UUID para id | `crypto.randomUUID()` do `node:crypto` |
| Filtrar por campo especifico | `.where('campo', valor)` encadeado |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const data = await knex('transactions').insert(...)` | `const transaction = await knex('transactions').insert(...).returning('*')` |
| `const result = await knex('transactions').select('*')` | `const transactions = await knex('transactions').select('*')` |
| `id: uuid()` (lib externa) | `id: randomUUID()` (node:crypto nativo) |
| `.where('amount = 1000')` (string SQL) | `.where('amount', 1000)` (metodo encadeado) |

## Troubleshooting

### Insert retorna apenas `[1]` em vez dos dados inseridos
**Symptom:** `await knex('table').insert({...})` retorna `[1]` (numero de linhas) em vez do objeto inserido
**Cause:** Falta o `.returning('*')` encadeado apos o insert — sem ele, o Knex retorna apenas o count de linhas afetadas
**Fix:** Adicione `.returning('*')` ao final da chain: `knex('table').insert({...}).returning('*')`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
