# Code Examples: Exibindo Total do Item do Pedido

## Exemplo 1: Evolucao passo a passo (como mostrado na aula)

### Passo 1 — Adicionar coluna calculada sem alias

```typescript
const items = await knex("orders")
  .select(
    "orders.id",
    "orders.price",
    "orders.quantity",
    knex.raw("orders.price * orders.quantity")
  );

// Resultado: coluna com nome estranho como "orders.price * orders.quantity"
```

### Passo 2 — Adicionar alias

```typescript
const items = await knex("orders")
  .select(
    "orders.id",
    "orders.price",
    "orders.quantity",
    knex.raw("(orders.price * orders.quantity) as total")
  );

// Resultado: { id: 1, price: 100, quantity: 1, total: 100 }
```

### Passo 3 — Adicionar created_at e updated_at com prefixo

```typescript
const items = await knex("orders")
  .select(
    "orders.id",
    "orders.price",
    "orders.quantity",
    knex.raw("(orders.price * orders.quantity) as total"),
    "orders.created_at",
    "orders.updated_at"
  );
```

### Passo 4 — Adicionar ordenacao desc

```typescript
const items = await knex("orders")
  .select(
    "orders.id",
    "orders.price",
    "orders.quantity",
    knex.raw("(orders.price * orders.quantity) as total"),
    "orders.created_at",
    "orders.updated_at"
  )
  .orderBy("orders.created_at", "desc");
```

## Exemplo 2: Com join (cenario completo de API)

```typescript
// GET /orders - Listagem de itens do pedido com nome do produto
app.get("/orders", async (request, response) => {
  const orderItems = await knex("orders")
    .select(
      "orders.id",
      "products.name as product_name",
      "orders.price",
      "orders.quantity",
      knex.raw("(orders.price * orders.quantity) as total"),
      "orders.created_at",
      "orders.updated_at"
    )
    .innerJoin("products", "products.id", "orders.product_id")
    .orderBy("orders.created_at", "desc");

  return response.json(orderItems);
});
```

## Exemplo 3: Multiplas colunas calculadas

```typescript
// Quando precisa de subtotal, desconto e total final
const items = await knex("orders")
  .select(
    "orders.id",
    "orders.price",
    "orders.quantity",
    "orders.discount",
    knex.raw("(orders.price * orders.quantity) as subtotal"),
    knex.raw("(orders.price * orders.quantity * orders.discount / 100) as discount_amount"),
    knex.raw("(orders.price * orders.quantity - (orders.price * orders.quantity * orders.discount / 100)) as total")
  )
  .orderBy("orders.created_at", "desc");
```

## Exemplo 4: Valores da aula

Dados demonstrados pelo instrutor:

| price | quantity | total |
|-------|----------|-------|
| 100   | 1        | 100   |
| 7.5   | 2        | 15    |

Confirmando que a multiplicacao no SQL funciona corretamente com decimais.