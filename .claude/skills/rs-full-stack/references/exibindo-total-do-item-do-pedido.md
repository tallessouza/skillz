---
name: rs-full-stack-total-item-pedido
description: "Applies computed columns and aliases in Knex.js queries when building order/invoice listings. Use when user asks to 'calculate total', 'multiply columns', 'add computed field', 'show order total', or 'knex raw expression'. Enforces knex.raw() for arithmetic between columns, proper aliasing with .as(), and orderBy with desc for recent-first listings. Make sure to use this skill whenever generating Knex queries that combine columns arithmetically. Not for raw SQL without Knex, nor for aggregation functions like SUM/COUNT across rows."
---

# Exibindo Total do Item do Pedido

> Ao calcular valores derivados de colunas no banco, use `knex.raw()` com alias descritivo em vez de calcular no JavaScript.

## Rules

1. **Calcule no SQL, nao no JS** — use `knex.raw('orders.price * orders.quantity')` em vez de buscar e multiplicar no codigo, porque o banco e mais eficiente e evita inconsistencias de arredondamento
2. **Sempre use alias em colunas calculadas** — envolva em parenteses e passe `.as('total')`, porque sem alias o nome da coluna sera a expressao crua e ilegivel
3. **Prefixe colunas com nome da tabela** — escreva `orders.price` nao apenas `price`, porque tabelas diferentes podem ter colunas com mesmo nome (ex: `createdAt` existe em produto e pedido)
4. **Ordene por `createdAt` desc para listagens recentes** — ultimo item adicionado aparece primeiro, porque e o comportamento esperado pelo usuario em listagens de pedidos

## How to write

### Coluna calculada com alias

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

### Join com coluna calculada

```typescript
const orderItems = await knex("orders")
  .select(
    "products.name",
    "orders.price",
    "orders.quantity",
    knex.raw("(orders.price * orders.quantity) as total"),
    "orders.created_at"
  )
  .innerJoin("products", "products.id", "orders.product_id")
  .orderBy("orders.created_at", "desc");
```

## Example

**Before (calculo no JS, sem alias, sem prefixo):**

```typescript
const items = await knex("orders").select("price", "quantity", "createdAt");
const result = items.map(item => ({
  ...item,
  total: item.price * item.quantity
}));
```

**After (com this skill applied):**

```typescript
const items = await knex("orders")
  .select(
    "orders.price",
    "orders.quantity",
    knex.raw("(orders.price * orders.quantity) as total"),
    "orders.created_at",
    "orders.updated_at"
  )
  .orderBy("orders.created_at", "desc");
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Multiplicar/somar duas colunas da mesma tabela | `knex.raw('(tabela.col1 * tabela.col2) as alias')` |
| Ambiguidade de coluna em join | Prefixar com nome da tabela: `orders.created_at` |
| Listagem de pedidos/itens | Sempre `orderBy('created_at', 'desc')` |
| Coluna calculada sem nome claro | Envolver em parenteses e usar `.as('nomeDescritivo')` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `knex.raw('price * quantity')` sem alias | `knex.raw('(orders.price * orders.quantity) as total')` |
| `.select("createdAt")` em query com join | `.select("orders.created_at")` |
| Calcular total no `.map()` apos buscar | Calcular direto no SQL com `knex.raw()` |
| `.orderBy("created_at")` sem direcao | `.orderBy("orders.created_at", "desc")` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre calculos no SQL vs JS e aliasing
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-exibindo-total-do-item-do-pedido/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-exibindo-total-do-item-do-pedido/references/code-examples.md)
