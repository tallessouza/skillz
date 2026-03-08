---
name: rs-ia-node-marketplace-criar-buscar-carrinho-2
description: "Enforces cart creation and retrieval patterns using PostgreSQL JSON aggregation in Node.js. Use when user asks to 'create a shopping cart', 'add items to cart', 'fetch cart with items', 'aggregate SQL joins into JSON', or 'nest related rows as arrays'. Applies two-step insert (cart then cart_items), JSON_AGG with JSON_BUILD_OBJECT for nested responses, and GROUP BY to collapse joins. Make sure to use this skill whenever building cart endpoints or aggregating one-to-many SQL results into JSON arrays. Not for NoSQL databases, ORM-based queries, or frontend cart state management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: cart
  tags: [e-commerce, ia-node, postgresql, node-js]
---

# Criar e Buscar Carrinho com Agregacao JSON

> Ao criar entidades com relacionamentos, insira a entidade pai primeiro, use o ID retornado para os filhos, e ao buscar use JSON_AGG para colapsar joins em arrays.

## Rules

1. **Insira em duas etapas** — primeiro o `cart` (retornando o ID), depois o `cart_items` com o `cart_id` recem-criado, porque o item depende do carrinho existir
2. **Resolva dependencias antes do insert** — busque o produto para obter `store_id` antes de criar o carrinho, porque o cart precisa de dados que so existem em outras tabelas
3. **Use RETURNING para capturar IDs** — `INSERT INTO ... RETURNING id` evita um SELECT extra, porque o banco ja tem o valor na mesma operacao
4. **Agregue com JSON_AGG + JSON_BUILD_OBJECT** — ao buscar entidades com filhos, construa arrays JSON no SQL ao inves de retornar linhas duplicadas, porque o consumidor espera objetos aninhados
5. **Sempre use GROUP BY com agregacoes** — sem GROUP BY o banco nao sabe como colapsar as linhas do join, gerando erro ou resultados incorretos
6. **Limpe dados de teste com TRUNCATE** — use `afterEach` com TRUNCATE nas tabelas de teste para garantir isolamento entre testes

## How to write

### Criacao do carrinho (duas etapas)

```typescript
// 1. Buscar produto para obter store_id
const product = await client.query<{ store_id: string }>(
  'SELECT store_id FROM products WHERE id = $1',
  [productId]
);
if (!product.rows[0]) throw new NotFoundException('Produto nao encontrado');

// 2. Criar carrinho retornando ID
const cartRows = await client.query<{ id: number }>(
  'INSERT INTO carts (user_id, store_id) VALUES ($1, $2) RETURNING id',
  [userId, product.rows[0].store_id]
);

// 3. Criar item do carrinho
await client.query(
  'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
  [cartRows.rows[0].id, productId, quantity]
);

return cartRows.rows[0].id;
```

### Busca com JSON aggregation

```typescript
const result = await client.query(`
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
```

## Example

**Before (join retorna linhas duplicadas):**
```sql
SELECT c.id, p.name, ci.quantity
FROM carts c
JOIN cart_items ci ON ci.cart_id = c.id
JOIN products p ON p.id = ci.product_id
-- Resultado: uma linha por item, cart.id repetido
```

**After (agregacao colapsa em um objeto):**
```sql
SELECT c.id,
  JSON_AGG(JSON_BUILD_OBJECT('name', p.name, 'quantity', ci.quantity)) AS items
FROM carts c
JOIN cart_items ci ON ci.cart_id = c.id
JOIN products p ON p.id = ci.product_id
GROUP BY c.id
-- Resultado: uma linha por carrinho, items como array JSON
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Entidade pai + filhos no mesmo endpoint | Insert pai com RETURNING, depois filhos |
| Busca retorna joins com linhas repetidas | JSON_AGG + GROUP BY |
| Precisa de campo de outra tabela para insert | SELECT antes do INSERT, valide existencia |
| Testes criam dados no banco | TRUNCATE nas tabelas afetadas no afterEach |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `INSERT INTO carts ... INSERT INTO cart_items` sem RETURNING | `INSERT INTO carts ... RETURNING id` e use o id retornado |
| `SELECT * FROM carts JOIN cart_items` sem agregacao | `SELECT c.id, JSON_AGG(...) ... GROUP BY c.id` |
| Criar cart_item sem validar se produto existe | `SELECT store_id FROM products WHERE id = $1` antes |
| JSON_AGG sem GROUP BY | Sempre adicionar `GROUP BY` na coluna da entidade pai |

## Troubleshooting

### Carrinho retorna vazio mesmo com items
**Symptom:** GET /cart retorna carrinho sem items ou com items nulos
**Cause:** Inner join exclui carrinhos sem items, ou left join retorna [{id: null}] em vez de []
**Fix:** Use left join com filter `WHERE items.id IS NOT NULL` e coalesce para array vazio

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
