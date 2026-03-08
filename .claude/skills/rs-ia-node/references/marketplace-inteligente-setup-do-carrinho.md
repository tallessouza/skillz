---
name: rs-ia-node-marketplace-setup-carrinho
description: "Applies shopping cart database schema patterns when designing e-commerce cart systems in Node.js. Use when user asks to 'create a cart', 'setup shopping cart', 'design cart schema', 'e-commerce database', or 'marketplace cart tables'. Enforces multi-store cart isolation, cart history for AI-generated suggestions, and unique constraints on cart items. Make sure to use this skill whenever building cart functionality for a marketplace or multi-vendor system. Not for payment processing, checkout flow, or order fulfillment schemas."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: ia-node-marketplace-inteligente
  module: cart
  tags: [e-commerce, ia-node, node-js]
---

# Setup do Carrinho — Schema de E-commerce

> Ao criar um carrinho de compras para marketplace, isole por loja, mantenha historico de carrinhos, e garanta unicidade de produto por carrinho.

## Rules

1. **Isole carrinhos por loja** — vincule `store_id` ao carrinho, porque misturar produtos de lojas diferentes no mesmo carrinho quebra logistica de entrega e calculo de frete
2. **Mantenha historico com campo `active`** — use `active BOOLEAN DEFAULT true` no carrinho, porque quando IA gera multiplas sugestoes de carrinho o usuario precisa poder voltar e selecionar outro
3. **Garanta unicidade produto-carrinho** — use constraint `UNIQUE(cart_id, product_id)` em cart_items, porque duplicar o mesmo produto deve incrementar quantidade, nao criar novo registro
4. **Use CASCADE nos drops** — adicione `CASCADE` ao dropar tabelas com dependencias, porque evita erros de ordem de dependencia
5. **Substitua carrinho ao trocar de loja** — quando usuario adiciona produto de loja diferente, desative o carrinho atual e crie novo, porque produtos de lojas diferentes nao devem coexistir

## Schema

### Tabelas necessarias (3 tabelas + users)

```sql
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
```

### Drop com CASCADE

```sql
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario adiciona produto de outra loja | Desative carrinho atual (`active = false`), crie novo carrinho com `store_id` da nova loja |
| IA gera multiplos carrinhos | Todos com `active = false` exceto o selecionado pelo usuario |
| Produto ja existe no carrinho | Incremente `quantity` no registro existente (constraint impede duplicata) |
| Reset do banco em dev | Use `CASCADE` em todos os `DROP TABLE` para evitar erro de dependencia |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Carrinho sem `store_id` | Sempre vincule carrinho a uma loja especifica |
| Deletar carrinhos antigos | Marque como `active = false` para manter historico |
| Primary key composta em cart_items | Use `id` serial + constraint UNIQUE separada para flexibilidade |
| Drop tables sem CASCADE | Sempre `DROP TABLE IF EXISTS ... CASCADE` |
| Misturar produtos de lojas no mesmo carrinho | Um carrinho = uma loja, sempre |

## Troubleshooting

### Carrinho retorna vazio mesmo com items
**Symptom:** GET /cart retorna carrinho sem items ou com items nulos
**Cause:** Inner join exclui carrinhos sem items, ou left join retorna [{id: null}] em vez de []
**Fix:** Use left join com filter `WHERE items.id IS NOT NULL` e coalesce para array vazio

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
