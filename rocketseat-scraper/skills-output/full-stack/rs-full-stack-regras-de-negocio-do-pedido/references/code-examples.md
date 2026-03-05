# Code Examples: Regras de Negócio do Pedido

## Exemplo completo da aula — Validações do pedido

### Setup de imports

```typescript
import { knex } from "@/database/knex"
import { AppError } from "@/utils/app-error"
```

### Buscar e validar sessão

```typescript
const session = await knex<TablesSessionsRepository>("table_sessions")
  .where({ id: table_session_id })
  .first()

if (!session) {
  throw new AppError("Session table not found")
}

if (session.closed_at) {
  throw new AppError("This table is closed")
}
```

### Buscar e validar produto

```typescript
const product = await knex<ProductRepository>("products")
  .where({ id: product_id })
  .first()

if (!product) {
  throw new AppError("Product not found")
}

// Agora product.price está disponível com segurança
```

## Variações do mesmo padrão

### Para um endpoint de atualização de pedido

```typescript
async function updateOrder({ order_id, quantity }) {
  const order = await knex("orders").where({ id: order_id }).first()

  if (!order) {
    throw new AppError("Order not found")
  }

  const session = await knex("table_sessions")
    .where({ id: order.table_session_id })
    .first()

  if (!session) {
    throw new AppError("Session table not found")
  }

  if (session.closed_at) {
    throw new AppError("This table is closed")
  }

  await knex("orders").where({ id: order_id }).update({ quantity })
}
```

### Para um endpoint de fechar mesa

```typescript
async function closeTable({ table_session_id }) {
  const session = await knex("table_sessions")
    .where({ id: table_session_id })
    .first()

  if (!session) {
    throw new AppError("Session table not found")
  }

  if (session.closed_at) {
    throw new AppError("This table is already closed")
  }

  await knex("table_sessions")
    .where({ id: table_session_id })
    .update({ closed_at: knex.fn.now() })
}
```

### Para verificar existência de mesa antes de abrir sessão

```typescript
async function openTable({ table_id }) {
  const table = await knex("tables").where({ id: table_id }).first()

  if (!table) {
    throw new AppError("Table not found")
  }

  const activeSession = await knex("table_sessions")
    .where({ table_id })
    .whereNull("closed_at")
    .first()

  if (activeSession) {
    throw new AppError("This table already has an active session")
  }

  const [session] = await knex("table_sessions")
    .insert({ table_id })
    .returning("*")

  return session
}
```

## Teste manual demonstrado na aula

O instrutor testou via Insomnia/Postman:

| Cenário | Input | Resultado |
|---------|-------|-----------|
| Sessão 1 (fechada) | `table_session_id: 1` | `"This table is closed"` |
| Sessão 2 (aberta) | `table_session_id: 2` | Passa validação |
| Sessão 60 (não existe) | `table_session_id: 60` | `"Session table not found"` |
| Produto 116 (não existe) | `product_id: 116` | `"Product not found"` |
| Produto 16 (existe) | `product_id: 16` | Retorna dados do produto com preço |