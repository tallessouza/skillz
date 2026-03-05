# Code Examples: Validacao Pre-Mutacao em Endpoints de Criacao

## Exemplo completo da aula: abertura de mesa

### Versao sem validacao (problema)

```typescript
import { Request, Response } from 'express'
import { knex } from '../database'

async function openTable(request: Request, response: Response) {
  const { table_id } = request.body

  const [session] = await knex('table_sessions')
    .insert({
      table_id,
      opened_at: knex.fn.now()
    })
    .returning('*')

  return response.json(session)
}
```

Problema: cada chamada cria uma nova sessao, mesmo que a mesa ja esteja aberta.

### Versao com validacao (solucao da aula)

```typescript
import { Request, Response } from 'express'
import { knex } from '../database'
import { AppError } from '../utils/AppError'

interface TableSessionsRepository {
  id: string
  table_id: number
  opened_at: string
  closed_at: string | null
}

async function openTable(request: Request, response: Response) {
  const { table_id } = request.body

  // 1. Consultar a sessao mais recente dessa mesa
  const session = await knex<TableSessionsRepository>('table_sessions')
    .where({ table_id })
    .orderBy('opened_at', 'desc')
    .first()

  // 2. Validar se a mesa ja esta aberta
  if (session && !session.closed_at) {
    throw new AppError('This table is already open')
  }

  // 3. Abrir a mesa (somente se validacao passou)
  const [newSession] = await knex('table_sessions')
    .insert({
      table_id,
      opened_at: knex.fn.now()
    })
    .returning('*')

  return response.json(newSession)
}
```

## Variacoes do pattern para outros dominios

### Prevenir pedido duplicado ativo

```typescript
async function createOrder(request: Request, response: Response) {
  const { customer_id } = request.body

  const activeOrder = await knex<OrdersRepository>('orders')
    .where({ customer_id })
    .orderBy('created_at', 'desc')
    .first()

  if (activeOrder && !activeOrder.completed_at) {
    throw new AppError('Customer already has an active order')
  }

  const [order] = await knex('orders')
    .insert({ customer_id, created_at: knex.fn.now() })
    .returning('*')

  return response.json(order)
}
```

### Prevenir sessao de usuario duplicada

```typescript
async function startSession(request: Request, response: Response) {
  const { user_id } = request.body

  const activeSession = await knex<UserSessionsRepository>('user_sessions')
    .where({ user_id })
    .orderBy('started_at', 'desc')
    .first()

  if (activeSession && !activeSession.ended_at) {
    throw new AppError('User already has an active session')
  }

  const [session] = await knex('user_sessions')
    .insert({ user_id, started_at: knex.fn.now() })
    .returning('*')

  return response.json(session)
}
```

## Tecnica de debug do instrutor

O instrutor mostra como inspecionar o retorno da query temporariamente:

```typescript
// Debug temporario — retorna a sessao encontrada para inspecao
const session = await knex<TableSessionsRepository>('table_sessions')
  .where({ table_id })
  .orderBy('opened_at', 'desc')
  .first()

return response.json(session) // Temporario! Remover apos verificar

// Codigo abaixo fica unreachable (proposital durante debug)
```

## Knex: select explicito vs implicito

```typescript
// Com select explicito (quando quer colunas especificas)
const session = await knex<TableSessionsRepository>('table_sessions')
  .select('id', 'table_id', 'opened_at', 'closed_at')
  .where({ table_id })
  .first()

// Sem select (retorna todas as colunas — padrao)
const session = await knex<TableSessionsRepository>('table_sessions')
  .where({ table_id })
  .first()
```

## Knex: where short syntax vs verbose

```typescript
// Short syntax (preferir para igualdade simples)
.where({ table_id })
.where({ table_id, status: 'active' })

// Verbose (usar para operadores diferentes de igualdade)
.where('opened_at', '>', someDate)
.where('amount', '>=', minAmount)
```