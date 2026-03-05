# Code Examples: Comentarios vs Documentacao

## 1. Comentarios validos (POR QUE)

### Workaround de biblioteca

```typescript
// express-validator v6 doesn't chain .bail() correctly with custom validators
// Workaround: validate in two separate chains. See: https://github.com/express-validator/express-validator/issues/1000
const validateEmail = [
  body('email').isEmail(),
]
const validateEmailUnique = [
  body('email').custom(checkUniqueEmail),
]
```

### Limitacao de infraestrutura

```typescript
// Supabase free tier has 500 concurrent connections limit
// Using connection pooling with max 10 connections per instance
// to avoid hitting the limit with multiple serverless functions
const pool = new Pool({ max: 10 })
```

### Padrao nao-convencional justificado

```typescript
// Intentionally NOT using React.memo here — the component re-renders
// on every parent update anyway due to context dependency, and memo
// adds comparison overhead without benefit. Measured: +2ms per render with memo.
function DashboardPanel({ children }: Props) {
  const theme = useTheme() // triggers re-render on theme change
  return <div className={theme.panel}>{children}</div>
}
```

### TODO com referencia

```typescript
// TODO(PROJ-456): Replace with native Array.groupBy when Node 22 is our minimum
// Currently using lodash.groupBy as polyfill
const groupedOrders = groupBy(orders, 'status')
```

## 2. Comentarios invalidos (O QUE — devem ser removidos)

```typescript
// BAD: Explaining what the code does
// Get all users from the database
const users = await db.users.findMany()

// BAD: Narrating obvious logic
// Check if user is admin
if (user.role === 'admin') {
  // Grant access
  grantAccess(user)
}

// BAD: Documentation disguised as comments
// This function validates the order by checking:
// 1. The order has at least one item
// 2. All items have positive quantities
// 3. The total matches the sum of item prices
// 4. The customer exists in the database
// 5. The shipping address is valid
function validateOrder(order: Order): boolean {
  // ... (the function name + well-written code should convey this)
}
```

## 3. Refatorando comentarios-documentacao

### Antes (comentario explicando O QUE)

```typescript
// Calculate the discount based on the customer tier:
// - Gold customers get 20% off
// - Silver customers get 10% off
// - Bronze customers get 5% off
// - Regular customers get no discount
function calculateDiscount(customer: Customer, amount: number): number {
  if (customer.tier === 'gold') return amount * 0.2
  if (customer.tier === 'silver') return amount * 0.1
  if (customer.tier === 'bronze') return amount * 0.05
  return 0
}
```

### Depois (codigo autoexplicativo)

```typescript
const DISCOUNT_RATE_BY_TIER: Record<CustomerTier, number> = {
  gold: 0.20,
  silver: 0.10,
  bronze: 0.05,
  regular: 0,
}

function calculateDiscountByCustomerTier(customer: Customer, amountInCents: number): number {
  return amountInCents * (DISCOUNT_RATE_BY_TIER[customer.tier] ?? 0)
}
```

Nenhum comentario necessario — o codigo diz tudo.