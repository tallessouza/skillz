# Code Examples: Adicionando Produto no Banco

## Exemplo completo da aula

### Estrutura de pastas

```
src/
├── database/
│   ├── knect.ts              # Conexão centralizada com Knex
│   └── types/
│       └── product-repository.d.ts  # Tipagem global da tabela
├── routes/
│   └── products.ts           # Rotas de produtos
```

### Arquivo de tipagem (product-repository.d.ts)

```typescript
type ProductRepository = {
  id: number
  name: string
  price: number
  created_at: number
}
```

### Controller de criação de produto

```typescript
import { knect } from "@/database/knect"

// Dentro do handler da rota POST /products
// (após validação dos dados do request.body)

const { name, price } = request.body

await knect<ProductRepository>("products").insert({
  name,
  price,
})

return response.status(201).json()
```

## Variações

### Insert retornando o ID criado (PostgreSQL)

```typescript
const [insertedId] = await knect<ProductRepository>("products")
  .insert({
    name,
    price,
  })
  .returning("id")

return response.status(201).json({ id: insertedId })
```

### Insert com múltiplos registros

```typescript
await knect<ProductRepository>("products").insert([
  { name: "Pizza Margherita", price: 3500 },
  { name: "Pizza Calabresa", price: 3200 },
  { name: "Pizza Quatro Queijos", price: 3800 },
])
```

### Outro exemplo de tipagem (.d.ts) para outra tabela

```typescript
// database/types/order-repository.d.ts
type OrderRepository = {
  id: number
  product_id: number
  quantity: number
  total_price: number
  status: string
  created_at: number
}
```

### Usando a tipagem de order

```typescript
await knect<OrderRepository>("orders").insert({
  product_id: productId,
  quantity,
  total_price: quantity * price,
  status: "pending",
})
```

## Teste no Insomnia

O instrutor testou com uma requisição POST que retornou:
- **Status:** 201 Created
- **Body:** vazio (sem conteúdo)

E confirmou o insert executando no banco:
```sql
SELECT * FROM products;
```

Resultado: o produto cadastrado apareceu na tabela.