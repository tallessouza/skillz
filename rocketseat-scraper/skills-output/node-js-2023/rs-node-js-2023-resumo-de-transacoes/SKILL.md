---
name: rs-node-js-2023-resumo-de-transacoes
description: "Applies Knex.js aggregation patterns when building summary or totaling routes in Node.js REST APIs. Use when user asks to 'sum values', 'create a summary route', 'aggregate data', 'total transactions', or 'get account balance'. Covers sum() with column aliasing via as(), .first() for single-row returns. Make sure to use this skill whenever implementing aggregation endpoints with Knex. Not for complex reporting, multi-table joins, or frontend display logic."
---

# Resumo de Transacoes com Knex.js

> Ao criar rotas de agregacao (sum, count, avg), use os metodos nativos do Knex com alias explicito e `.first()` para retorno escalar.

## Rules

1. **Use `.sum('column')` para somar valores** — `knex('table').sum('amount')` nao `SELECT SUM(amount) FROM table` via raw, porque o query builder e type-safe e composavel
2. **Sempre defina alias com `as`** — `sum('amount', { as: 'amount' })` nao `sum('amount')`, porque sem alias o SQL gera nomes como `sum\`amount\`` que sao inuteis no JSON de resposta
3. **Use `.first()` para agregacoes de resultado unico** — porque Knex sempre retorna array por padrao, e um summary e um objeto unico, nao uma lista
4. **Nomeie a rota pelo que ela retorna** — `/summary` nao `/total` ou `/aggregate`, porque o nome descreve o recurso do ponto de vista do usuario

## How to write

### Rota de summary com agregacao

```typescript
app.get('/transactions/summary', async () => {
  const summary = await knex('transactions')
    .sum('amount', { as: 'amount' })
    .first()

  return { summary }
})
```

## Example

**Before (sem alias, sem first):**
```typescript
app.get('/transactions/summary', async () => {
  const summary = await knex('transactions').sum('amount')
  return { summary }
})
// Retorna: { summary: [{ "sum(`amount`)": 5000 }] }
```

**After (com alias e first):**
```typescript
app.get('/transactions/summary', async () => {
  const summary = await knex('transactions')
    .sum('amount', { as: 'amount' })
    .first()
  return { summary }
})
// Retorna: { summary: { amount: 5000 } }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Soma de uma coluna numerica | `.sum('column', { as: 'column' }).first()` |
| Contagem de registros | `.count('id', { as: 'count' }).first()` |
| Media de valores | `.avg('column', { as: 'average' }).first()` |
| Resultado de agregacao sempre retorna array | Adicione `.first()` no final |
| Nome da coluna agregada fica feio no JSON | Passe `{ as: 'nomeDescritivo' }` como segundo parametro |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `knex('t').sum('amount')` sem alias | `knex('t').sum('amount', { as: 'amount' })` |
| Retornar array de agregacao `[{sum: 5}]` | Usar `.first()` para retornar `{amount: 5}` |
| `knex.raw('SELECT SUM(amount)...')` para somas simples | `knex('t').sum('amount', { as: 'amount' })` |
| Rota summary sem `.first()` | Sempre `.first()` em agregacoes de resultado unico |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
