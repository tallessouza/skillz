# Code Examples: Realizando Queries com Knex

## Exemplo 1: Insert basico (sem returning)

Exatamente como o instrutor demonstrou primeiro:

```typescript
import { randomUUID } from 'node:crypto'

app.get('/hello', async () => {
  const transaction = await knex('transactions')
    .insert({
      id: randomUUID(),
      title: 'Transação de teste',
      amount: 1000,
    })

  return transaction
  // Retorna: 1 (apenas contagem de linhas)
})
```

**Problema:** O retorno e apenas `1`, nao os dados inseridos.

## Exemplo 2: Insert com returning

Correcao feita pelo instrutor:

```typescript
const transaction = await knex('transactions')
  .insert({
    id: randomUUID(),
    title: 'Transação de teste',
    amount: 1000,
  })
  .returning('*')

return transaction
// Retorna: [{ id: 'uuid-aqui', title: 'Transação de teste', amount: 1000, created_at: '...', session_id: null }]
```

**Nota:** `session_id` vem como `null` porque nao foi enviado e o campo e nullable.

## Exemplo 3: Select all

Buscar todas as transacoes:

```typescript
const transactions = await knex('transactions').select('*')

return transactions
// Retorna array com todas as transacoes cadastradas
```

## Exemplo 4: Select com where (com resultado)

Filtrar por amount existente:

```typescript
const transactions = await knex('transactions')
  .where('amount', 1000)
  .select('*')

return transactions
// Retorna transacoes com amount = 1000
```

## Exemplo 5: Select com where (sem resultado)

Filtrar por amount que nao existe:

```typescript
const transactions = await knex('transactions')
  .where('amount', 500)
  .select('*')

return transactions
// Retorna: [] (array vazio, nenhuma transacao com amount 500)
```

## Variacoes praticas

### Insert sem campo opcional

```typescript
// session_id e nullable, nao precisa enviar
const transaction = await knex('transactions')
  .insert({
    id: randomUUID(),
    title: 'Compra mercado',
    amount: 250,
    // session_id omitido — sera null no banco
  })
  .returning('*')
```

### Returning campos especificos

```typescript
// Em vez de retornar tudo, retornar apenas id e title
const transaction = await knex('transactions')
  .insert({
    id: randomUUID(),
    title: 'Pagamento',
    amount: 3000,
  })
  .returning(['id', 'title'])
```

### Where com multiplas condicoes

```typescript
const transactions = await knex('transactions')
  .where('amount', 1000)
  .where('title', 'Transação de teste')
  .select('*')
```