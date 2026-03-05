# Code Examples: Setup do Carrinho

## Schema completo com seed

```sql
-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop com CASCADE (ordem nao importa)
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS stores CASCADE;

-- Tabelas base (stores e products ja existiam)
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id),
  name TEXT NOT NULL,
  description TEXT,
  price_in_cents INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Novas tabelas para carrinho
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  store_id INTEGER REFERENCES stores(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES carts(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
);

-- Seed de usuario
INSERT INTO users (email, name, password) VALUES
  ('user@example.com', 'Test User', 'password123');
```

## Logica de troca de loja (pseudocodigo)

```typescript
async function addToCart(userId: number, productId: number, quantity: number) {
  const product = await getProduct(productId)
  const activeCart = await getActiveCart(userId)

  // Se carrinho ativo e de outra loja, desativa e cria novo
  if (activeCart && activeCart.storeId !== product.storeId) {
    await deactivateCart(activeCart.id) // active = false
    const newCart = await createCart(userId, product.storeId)
    await addCartItem(newCart.id, productId, quantity)
    return newCart
  }

  // Se nao tem carrinho ativo, cria
  if (!activeCart) {
    const newCart = await createCart(userId, product.storeId)
    await addCartItem(newCart.id, productId, quantity)
    return newCart
  }

  // Mesmo loja — adiciona ou incrementa (constraint garante unicidade)
  await upsertCartItem(activeCart.id, productId, quantity)
  return activeCart
}
```

## Query para buscar carrinho ativo com itens

```sql
SELECT
  c.id AS cart_id,
  c.store_id,
  s.name AS store_name,
  ci.product_id,
  p.name AS product_name,
  p.price_in_cents,
  ci.quantity,
  (p.price_in_cents * ci.quantity) AS subtotal_in_cents
FROM carts c
JOIN stores s ON s.id = c.store_id
JOIN cart_items ci ON ci.cart_id = c.id
JOIN products p ON p.id = ci.product_id
WHERE c.user_id = $1
  AND c.active = true
ORDER BY ci.created_at;
```

## Query para listar historico de carrinhos (para IA)

```sql
SELECT
  c.id,
  c.store_id,
  s.name AS store_name,
  c.active,
  c.created_at,
  COUNT(ci.id) AS item_count
FROM carts c
JOIN stores s ON s.id = c.store_id
LEFT JOIN cart_items ci ON ci.cart_id = c.id
WHERE c.user_id = $1
GROUP BY c.id, s.name
ORDER BY c.created_at DESC;
```