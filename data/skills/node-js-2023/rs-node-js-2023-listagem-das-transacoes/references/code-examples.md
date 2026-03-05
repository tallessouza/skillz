# Code Examples: Listagem das Transações

## Exemplo 1: Rota de listagem completa

```typescript
// routes/transactions.ts
import { knex } from '../database'

app.get('/', async () => {
  const transactions = await knex('transactions').select()

  return { transactions }
})
```

**Passo a passo:**
1. `knex('transactions')` — seleciona a tabela
2. `.select()` — busca todos os campos (nao precisa de `'*'`)
3. Retorna dentro de objeto nomeado `{ transactions }`

**Variacao — com campos especificos:**

```typescript
// Se quiser selecionar campos especificos:
const transactions = await knex('transactions').select('id', 'title', 'amount')
```

## Exemplo 2: Rota de busca por ID

```typescript
import { z } from 'zod'
import { knex } from '../database'

const getTransactionParmsSchema = z.object({
  id: z.string().uuid(),
})

app.get('/:id', async (request) => {
  const { id } = getTransactionParmsSchema.parse(request.params)

  const transaction = await knex('transactions')
    .where({ id })
    .first()

  return { transaction }
})
```

**Passo a passo:**
1. Define schema Zod com `id` como string UUID
2. Faz parse dos params (valida e extrai)
3. Desestrutura `{ id }` do resultado
4. Busca no banco com `.where({ id }).first()`
5. `.first()` garante retorno de objeto unico (nao array)
6. Retorna em objeto `{ transaction }`

## Exemplo 3: Extensibilidade do retorno em objeto

```typescript
// Versao inicial
app.get('/', async () => {
  const transactions = await knex('transactions').select()
  return { transactions }
})

// Versao futura com paginacao — nao quebra consumers existentes
app.get('/', async () => {
  const transactions = await knex('transactions').select()
  const total = await knex('transactions').count('id as count').first()

  return {
    transactions,
    total: total?.count ?? 0,
  }
})
```

## Exemplo 4: Testando no Insomnia/HTTP client

```http
### Listar todas as transacoes
GET http://localhost:3333/transactions

### Buscar transacao por ID
GET http://localhost:3333/transactions/550e8400-e29b-41d4-a716-446655440000
```

## Exemplo 5: Nota sobre Zod atualizado

```typescript
// Versao antiga do Zod:
const schema = z.object({
  id: z.string().uuid(),
})

// Versao nova do Zod (conforme nota da aula):
const schema = z.object({
  id: z.uuid(),
})
```