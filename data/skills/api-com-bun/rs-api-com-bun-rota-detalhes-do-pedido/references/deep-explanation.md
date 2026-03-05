# Deep Explanation: Rota de Detalhes do Pedido

## Query API vs Select API no Drizzle

O Drizzle oferece duas formas de consultar o banco:

1. **Select API** — funciona como um Query Builder tradicional. Voce escreve a query como se fosse um SELECT SQL, fazendo joins manualmente. E mais flexivel para queries complexas, mas mais verboso.

2. **Query API** — oferece uma experiencia melhor para o desenvolvedor (DX). Usa metodos como `findFirst`, `findMany` com opcoes declarativas como `with` e `columns`. Os relacionamentos sao resolvidos automaticamente a partir das definicoes no schema.

O instrutor enfatiza: **use Query API sempre que possivel**. Nem todas as queries vao funcionar com ela (como veremos em rotas mais complexas), mas para detalhes de entidade unica com relacionamentos, ela e ideal.

## Como o `with` funciona

Os relacionamentos que aparecem no `with` vem das definicoes de `relations` no schema do Drizzle. Por exemplo, se no schema de `orders` voce definiu:

```typescript
export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  restaurant: one(restaurants, { fields: [orders.restaurantId], references: [restaurants.id] }),
  orderItems: many(orderItems),
}))
```

Esses nomes (`customer`, `restaurant`, `orderItems`) sao exatamente o que aparece como opcoes no `with`. O Drizzle faz o join automaticamente baseado nessas definicoes.

## Aninhamento de `with`

O poder real aparece quando voce aninha `with`. No exemplo da aula:

```typescript
with: {
  orderItems: {
    with: {
      product: { columns: { name: true } }
    }
  }
}
```

Isso faz: `orders → orderItems → product`, trazendo o nome do produto dentro de cada item do pedido. Sem isso, voce teria apenas o `productId` nos items, sem saber o titulo do produto.

## Selecao de colunas em cada nivel

O `columns` pode ser aplicado em qualquer nivel da arvore de relacionamentos:
- No nivel raiz (pedido): `id`, `status`, `totalInCents`, `createdAt`
- No customer: `name`, `phone`, `email`
- Nos orderItems: `id`, `priceInCents`, `quantity`
- No product (dentro de orderItems): `name`

Isso resulta em um payload limpo e organizado, sem campos desnecessarios.

## Padrao de autorizacao

O `restaurantId` vem do `getCurrentUser()`. Se o usuario nao e manager de um restaurante, ele nao tem `restaurantId`, e a rota retorna 401 (UnauthorizedError). Isso e verificado ANTES de qualquer query ao banco.

## Tratamento de not found

Em vez de `throw`, o instrutor usa `set.status = 400` com uma mensagem. Isso e especifico do Elysia — voce controla o status da resposta via `set.status` e retorna o body normalmente.