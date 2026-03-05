# Code Examples: Listando Pedidos com Joins

## Exemplo completo da aula — evolução passo a passo

### Passo 1: Query básica sem join

```typescript
app.get("/orders/:table_session_id", async (request, reply) => {
  const { table_session_id } = request.params

  const order = await knex("orders")
    .where("table_session_id", table_session_id)

  return reply.json(order)
})
```

Retorno neste ponto: todos os campos de `orders` (id, table_session_id, product_id, quantity, price). Problema: não mostra o nome do produto.

### Passo 2: Adicionando select explícito com qualificação

```typescript
const order = await knex("orders")
  .select(
    "orders.id",
    "orders.table_session_id",
    "orders.product_id"
  )
  .where("orders.table_session_id", table_session_id)
```

Agora controlamos exatamente quais colunas voltam, e cada uma está qualificada com o nome da tabela.

### Passo 3: Conectando com tabela de produtos via join

```typescript
const order = await knex("orders")
  .select(
    "orders.id",
    "orders.table_session_id",
    "orders.product_id",
    "products.name"
  )
  .join("products", "products.id", "orders.product_id")
  .where("orders.table_session_id", table_session_id)
```

O `.join()` conecta `products.id` (chave primária) com `orders.product_id` (chave estrangeira).

### Passo 4: Versão final com preço e quantidade

```typescript
const order = await knex("orders")
  .select(
    "orders.id",
    "orders.table_session_id",
    "orders.product_id",
    "orders.price",       // preço do PEDIDO, não do produto
    "orders.quantity",
    "products.name"
  )
  .join("products", "products.id", "orders.product_id")
  .where("orders.table_session_id", table_session_id)
```

## Variações do padrão

### Com múltiplos joins (ex: incluir nome da mesa)

```typescript
const order = await knex("orders")
  .select(
    "orders.id",
    "orders.price",
    "orders.quantity",
    "products.name as product_name",
    "table_sessions.table_id"
  )
  .join("products", "products.id", "orders.product_id")
  .join("table_sessions", "table_sessions.id", "orders.table_session_id")
  .where("orders.table_session_id", table_session_id)
```

### Com alias para evitar conflito de nomes no retorno

```typescript
const order = await knex("orders")
  .select(
    "orders.id as order_id",
    "orders.price as order_price",
    "products.name as product_name",
    "products.price as current_product_price"  // para comparação
  )
  .join("products", "products.id", "orders.product_id")
  .where("orders.table_session_id", table_session_id)
```

### Sessão inexistente — retorno vazio

```typescript
// GET /orders/999 (sessão que não existe)
// Retorno: [] (array vazio, status 200)
// Não precisa de validação adicional
```