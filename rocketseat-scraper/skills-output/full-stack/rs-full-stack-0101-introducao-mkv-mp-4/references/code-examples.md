# Code Examples: Front-end vs Back-end

## Exemplo: Responsabilidades separadas

### Back-end (Node.js) — Regras de negocio

```typescript
// src/services/order-service.ts
// Back-end: logica de negocio pura, sem visual

interface CreateOrderInput {
  userId: string
  items: Array<{ productId: string; quantity: number }>
}

function calculateOrderTotal(items: OrderItem[]): number {
  const subtotal = items.reduce((sum, item) => sum + item.priceInCents * item.quantity, 0)
  const discountInCents = subtotal > 10000 ? subtotal * 0.1 : 0
  return subtotal - discountInCents
}

function validateOrder(input: CreateOrderInput): void {
  if (input.items.length === 0) {
    throw new Error('Order must have at least one item')
  }
}

async function createOrder(input: CreateOrderInput) {
  validateOrder(input)
  const items = await enrichWithPrices(input.items)
  const totalInCents = calculateOrderTotal(items)
  return await repository.save({ userId: input.userId, items, totalInCents })
}
```

### Front-end — Aspecto visual e interatividade

```typescript
// components/OrderSummary.tsx
// Front-end: apresentacao visual, sem regras de negocio

function OrderSummary({ order }) {
  return (
    <div className="order-card">
      <h2>Pedido #{order.id}</h2>
      {order.items.map(item => (
        <div key={item.id} className="item-row">
          <span>{item.name}</span>
          <span>{formatCurrency(item.priceInCents)}</span>
        </div>
      ))}
      <div className="total">
        Total: {formatCurrency(order.totalInCents)}
      </div>
    </div>
  )
}
```

## O que vai onde — Guia rapido

### Pertence ao back-end (Node.js)

```typescript
// Validacao de regras de negocio
function canUserPlaceOrder(user: User): boolean {
  return user.isActive && !user.isSuspended && user.emailVerified
}

// Calculo de valores
function applyDiscount(priceInCents: number, coupon: Coupon): number {
  return priceInCents - (priceInCents * coupon.percentageOff / 100)
}

// Acesso a dados
async function getUserOrders(userId: string) {
  return await database.query('SELECT * FROM orders WHERE user_id = $1', [userId])
}

// Autenticacao
function verifyToken(token: string): UserPayload {
  return jwt.verify(token, process.env.JWT_SECRET)
}
```

### Pertence ao front-end

```typescript
// Formatacao de exibicao
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(cents / 100)
}

// Estado de interface
const [isMenuOpen, setIsMenuOpen] = useState(false)

// Feedback visual
function showSuccessToast(message: string) {
  toast.success(message, { duration: 3000 })
}
```

## Estrutura tipica de um projeto Node.js back-end

```
src/
├── server.ts          # Ponto de entrada do servidor
├── routes/            # Definicao de rotas HTTP
├── controllers/       # Recebem requests, delegam para services
├── services/          # Regras de negocio (core)
├── repositories/      # Acesso a banco de dados
├── middlewares/        # Autenticacao, validacao, logging
└── utils/             # Funcoes auxiliares
```

Nenhuma pasta de "views" ou "components" — back-end nao tem visual.