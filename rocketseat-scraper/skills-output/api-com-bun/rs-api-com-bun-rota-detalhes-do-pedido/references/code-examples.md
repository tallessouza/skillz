# Code Examples: Rota de Detalhes do Pedido

## Exemplo completo da rota

```typescript
import Elysia, { t } from 'elysia'
import { auth } from '../auth'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { db } from '../../db/connection'

export const getOrderDetails = new Elysia().use(auth).get(
  '/orders/:id',
  async ({ getCurrentUser, params, set }) => {
    const { id: orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
        status: true,
        totalInCents: true,
        createdAt: true,
      },
      where(fields, { eq }) {
        return eq(fields.id, orderId)
      },
      with: {
        customer: {
          columns: {
            name: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          columns: {
            id: true,
            priceInCents: true,
            quantity: true,
          },
          with: {
            product: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!order) {
      set.status = 400
      return { message: 'Order not found' }
    }

    return order
  },
  {
    params: t.Object({
      id: t.String(),
    }),
  }
)
```

## Registro da rota no server

```typescript
import { getOrderDetails } from './routes/get-order-details'

// No arquivo do server
app.use(getOrderDetails)
```

## Resposta JSON resultante

```json
{
  "id": "abc123",
  "status": "pending",
  "totalInCents": 5000,
  "createdAt": "2024-01-15T10:30:00Z",
  "customer": {
    "name": "John Doe",
    "phone": "11999999999",
    "email": "john@example.com"
  },
  "orderItems": [
    {
      "id": "item1",
      "priceInCents": 2500,
      "quantity": 2,
      "product": {
        "name": "Pizza Margherita"
      }
    }
  ]
}
```

## Evolucao incremental do `with`

### Passo 1: Apenas customer
```typescript
with: {
  customer: true,  // traz TODOS os campos do customer
}
```

### Passo 2: Customer + orderItems
```typescript
with: {
  customer: true,
  orderItems: true,  // traz items mas sem dados do produto
}
```

### Passo 3: orderItems com produto aninhado
```typescript
with: {
  customer: true,
  orderItems: {
    with: {
      product: true,  // agora traz produto dentro de cada item
    },
  },
}
```

### Passo 4: Com selecao de colunas (versao final)
```typescript
with: {
  customer: {
    columns: { name: true, phone: true, email: true },
  },
  orderItems: {
    columns: { id: true, priceInCents: true, quantity: true },
    with: {
      product: { columns: { name: true } },
    },
  },
}
```

## Tipagem de parametros com Elysia

```typescript
// Usando t (TypeBox) do Elysia para tipar params
{
  params: t.Object({
    id: t.String(),
  }),
}
```