# Code Examples: Salvando Pedido

## 1. Tipagem completa do Order Repository

```typescript
// src/database/types/order-repository.d.ts
type OrderRepository = {
  id: number
  table_session_id: number
  product_id: number
  quantity: number
  price: number
  created_at: number
  updated_at: number
}
```

## 2. Controller de criação de pedido

```typescript
// Dentro do controller de orders (POST)
// Assume que product já foi buscado e validado anteriormente

await knex<OrderRepository>("orders").insert({
  table_session_id: tableSessionId,
  product_id: productId,
  quantity,
  price: product.price,
})
```

## 3. Versão com retorno removido

O instrutor inicialmente retornava o produto no response, depois removeu:

```typescript
// ANTES (retornava dados desnecessários)
const order = await knex<OrderRepository>("orders").insert({
  table_session_id: tableSessionId,
  product_id: productId,
  quantity,
  price: product.price,
})
response.json(product) // Desnecessário

// DEPOIS (limpo, sem retorno)
await knex<OrderRepository>("orders").insert({
  table_session_id: tableSessionId,
  product_id: productId,
  quantity,
  price: product.price,
})
// Response implícito 200 ou pode retornar 201
```

## 4. Teste manual demonstrado

### Primeiro pedido (prato):
```json
// POST /orders
{
  "table_session_id": 2,
  "product_id": 16,
  "quantity": 1
}
// Resultado no banco: price = 100 (copiado do produto 16)
```

### Segundo pedido (refrigerante):
```json
// POST /orders
{
  "table_session_id": 2,
  "product_id": 23,
  "quantity": 2
}
// Resultado no banco: price = 7.50, quantity = 2
// Total calculável: 2 * 7.50 = 15.00
```

## 5. Variação: insert com retorno do ID

```typescript
// Se precisar retornar o ID do pedido criado
const [orderId] = await knex<OrderRepository>("orders")
  .insert({
    table_session_id: tableSessionId,
    product_id: productId,
    quantity,
    price: product.price,
  })
  .returning("id")

response.status(201).json({ id: orderId })
```

## 6. Consulta de verificação (SQL usado pelo instrutor)

```sql
-- O instrutor verificou os pedidos diretamente no banco
SELECT * FROM orders;

-- Resultado:
-- id | table_session_id | product_id | quantity | price  | created_at | updated_at
-- 1  | 2                | 16         | 1        | 100.00 | ...        | ...
-- 2  | 2                | 23         | 2        | 7.50   | ...        | ...
```

## 7. Cálculo de total do pedido (mencionado como próximo passo)

```typescript
// Futuro: calcular total de uma sessão
const orderItems = await knex<OrderRepository>("orders")
  .where({ table_session_id: tableSessionId })
  .select("quantity", "price")

const total = orderItems.reduce(
  (sum, item) => sum + item.quantity * item.price,
  0
)
```