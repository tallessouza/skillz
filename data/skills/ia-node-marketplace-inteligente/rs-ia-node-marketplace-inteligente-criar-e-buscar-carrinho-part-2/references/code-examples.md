# Code Examples: Criar e Buscar Carrinho

## Exemplo completo: funcao addToCart

```typescript
async addToCart(userId: string, productId: string, quantity: number) {
  // Buscar produto para obter store_id
  const product = await this.pgService.query<{ store_id: string }>(
    'SELECT store_id FROM products WHERE id = $1',
    [productId]
  );

  if (!product.rows[0]) {
    throw new NotFoundException('Produto nao encontrado');
  }

  // Criar carrinho
  const cartRows = await this.pgService.query<{ id: number }>(
    `INSERT INTO carts (user_id, store_id)
     VALUES ($1, $2)
     RETURNING id`,
    [userId, product.rows[0].store_id]
  );

  // Criar item do carrinho
  await this.pgService.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES ($1, $2, $3)`,
    [cartRows.rows[0].id, productId, quantity]
  );

  return cartRows.rows[0].id;
}
```

## Exemplo completo: funcao getCart com agregacao

```typescript
async getCart(userId: string) {
  const result = await this.pgService.query(`
    SELECT
      c.id,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', p.id,
          'name', p.name,
          'price', p.price,
          'quantity', ci.quantity
        )
      ) AS items
    FROM carts c
    JOIN cart_items ci ON ci.cart_id = c.id
    JOIN products p ON p.id = ci.product_id
    WHERE c.user_id = $1 AND c.active = true
    GROUP BY c.id
  `, [userId]);

  return result.rows;
}
```

## Exemplo: setup de testes com limpeza

```typescript
describe('CartService', () => {
  let postgreService: PostgreService;

  beforeEach(async () => {
    postgreService = app.get(PostgreService);
    // Limpa na primeira execucao tambem
    await postgreService.query('TRUNCATE carts, cart_items');
  });

  afterEach(async () => {
    await postgreService.query('TRUNCATE carts, cart_items');
  });

  it('should create cart and return id', async () => {
    const cartId = await service.addToCart('user-1', 'product-1', 2);
    expect(cartId).toBeDefined();
  });

  it('should return cart with items', async () => {
    await service.addToCart('user-1', 'product-1', 2);
    const cart = await service.getCart('user-1');

    expect(cart[0].items).toHaveLength(1);
    expect(cart[0].items[0].id).toBe('product-1');
    expect(cart[0].items[0].quantity).toBe(2);
  });
});
```

## SQL puro: comparacao join normal vs agregado

### Sem agregacao (problema)
```sql
SELECT c.id, p.id AS product_id, p.name, ci.quantity
FROM carts c
JOIN cart_items ci ON ci.cart_id = c.id
JOIN products p ON p.id = ci.product_id
WHERE c.user_id = 'user-1';

-- Resultado:
-- id | product_id | name      | quantity
-- 1  | prod-1     | Camiseta  | 2
-- 1  | prod-2     | Calcas    | 1
-- (cart.id repetido em cada linha)
```

### Com agregacao (solucao)
```sql
SELECT c.id,
  JSON_AGG(
    JSON_BUILD_OBJECT(
      'id', p.id,
      'name', p.name,
      'quantity', ci.quantity
    )
  ) AS items
FROM carts c
JOIN cart_items ci ON ci.cart_id = c.id
JOIN products p ON p.id = ci.product_id
WHERE c.user_id = 'user-1'
GROUP BY c.id;

-- Resultado:
-- id | items
-- 1  | [{"id":"prod-1","name":"Camiseta","quantity":2},{"id":"prod-2","name":"Calcas","quantity":1}]
```