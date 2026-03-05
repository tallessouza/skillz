# Code Examples: Resumo de Transacoes

## Exemplo 1: Implementacao progressiva (como feito na aula)

### Passo 1 — Sum basico (sem alias, sem first)
```typescript
app.get('/transactions/summary', async () => {
  const summary = await knex('transactions').sum('amount')
  return { summary }
})
// Response: { summary: [{ "sum(`amount`)": 5000 }] }
// Problema: retorna array e nome de coluna feio
```

### Passo 2 — Adicionando .first()
```typescript
app.get('/transactions/summary', async () => {
  const summary = await knex('transactions').sum('amount').first()
  return { summary }
})
// Response: { summary: { "sum(`amount`)": 5000 } }
// Melhorou: retorna objeto, mas nome ainda feio
```

### Passo 3 — Adicionando alias com as (versao final)
```typescript
app.get('/transactions/summary', async () => {
  const summary = await knex('transactions')
    .sum('amount', { as: 'amount' })
    .first()
  return { summary }
})
// Response: { summary: { amount: 5000 } }
// Perfeito: objeto com nome de coluna limpo
```

## Exemplo 2: Variacoes de agregacao com Knex

### Count de registros
```typescript
app.get('/transactions/count', async () => {
  const result = await knex('transactions')
    .count('id', { as: 'total' })
    .first()
  return { result }
})
// Response: { result: { total: 42 } }
```

### Media de valores
```typescript
app.get('/transactions/average', async () => {
  const result = await knex('transactions')
    .avg('amount', { as: 'average' })
    .first()
  return { result }
})
// Response: { result: { average: 250.5 } }
```

### Multiplas agregacoes na mesma query
```typescript
app.get('/transactions/stats', async () => {
  const stats = await knex('transactions')
    .sum('amount', { as: 'total' })
    .count('id', { as: 'count' })
    .avg('amount', { as: 'average' })
    .first()
  return { stats }
})
```

## Exemplo 3: Summary com filtro (proximo passo natural)

```typescript
// Quando implementar identificacao de usuario:
app.get('/transactions/summary', async (request) => {
  const sessionId = request.cookies.sessionId

  const summary = await knex('transactions')
    .where('session_id', sessionId)
    .sum('amount', { as: 'amount' })
    .first()

  return { summary }
})
```

## Exemplo 4: Summary separando creditos e debitos

```typescript
app.get('/transactions/summary', async () => {
  const summary = await knex('transactions')
    .sum('amount', { as: 'amount' })
    .first()

  const credits = await knex('transactions')
    .where('amount', '>', 0)
    .sum('amount', { as: 'credits' })
    .first()

  const debits = await knex('transactions')
    .where('amount', '<', 0)
    .sum('amount', { as: 'debits' })
    .first()

  return {
    summary: {
      total: summary?.amount ?? 0,
      credits: credits?.credits ?? 0,
      debits: debits?.debits ?? 0,
    },
  }
})
```