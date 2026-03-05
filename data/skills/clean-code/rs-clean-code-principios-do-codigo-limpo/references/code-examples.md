# Code Examples: Principios do Codigo Limpo

Esta aula e conceitual e nao contem exemplos de codigo diretos. Os principios se manifestam em praticas de time, nao em snippets. Abaixo, exemplos praticos que ilustram cada principio.

## Testes Automatizados — Confianca no codigo

```typescript
// SEM testes: zero confianca ao alterar
function calculateDiscount(price: number, userType: string): number {
  if (userType === 'premium') return price * 0.8
  if (userType === 'vip') return price * 0.7
  return price
}
// Dev novo altera e reza para nao quebrar nada

// COM testes: confianca para alterar e refatorar
describe('calculateDiscount', () => {
  it('applies 20% discount for premium users', () => {
    expect(calculateDiscount(100, 'premium')).toBe(80)
  })

  it('applies 30% discount for vip users', () => {
    expect(calculateDiscount(100, 'vip')).toBe(70)
  })

  it('returns full price for regular users', () => {
    expect(calculateDiscount(100, 'regular')).toBe(100)
  })
})
```

## Revisao — Frankenstein vs Consistencia

```typescript
// SEM revisao: cada dev com seu estilo (Frankenstein)
// Arquivo 1 (Dev A):
function getUsers() { return db.query('SELECT * FROM users') }

// Arquivo 2 (Dev B):
const fetchProducts = async () => {
  const res = await fetch('/api/products')
  return res.json()
}

// Arquivo 3 (Dev C):
class OrderService {
  retrieve_orders(user_id) { /* snake_case misturado */ }
}

// COM revisao: time converge para um padrao
async function getUsers(): Promise<User[]> {
  return db.query('SELECT * FROM users')
}

async function getProducts(): Promise<Product[]> {
  const response = await fetch('/api/products')
  return response.json()
}

async function getOrdersByUser(userId: string): Promise<Order[]> {
  return db.query('SELECT * FROM orders WHERE user_id = $1', [userId])
}
```

## KISS — Simplicidade vs Complexidade desnecessaria

```typescript
// VIOLANDO KISS: usando pattern sofisticado para problema simples
class UserNotificationStrategyFactory {
  private strategies: Map<string, NotificationStrategy>

  constructor() {
    this.strategies = new Map()
    this.strategies.set('email', new EmailStrategy())
    this.strategies.set('sms', new SmsStrategy())
  }

  getStrategy(type: string): NotificationStrategy {
    return this.strategies.get(type) ?? new NoOpStrategy()
  }
}

// KISS aplicado: resolve o mesmo problema com simplicidade
function notifyUser(userId: string, message: string, channel: 'email' | 'sms') {
  if (channel === 'email') {
    sendEmail(userId, message)
  } else {
    sendSms(userId, message)
  }
}
```

## Iteracoes Curtas — PR bomba vs PRs incrementais

```
// PR BOMBA (ruim): 1 PR com tudo
PR #42: "Implement user authentication system"
  - 47 files changed
  - +2,847 lines, -156 lines
  - Aberta ha 12 dias
  - Reviewer: "LGTM" (nao leu nada)

// ITERACOES CURTAS (bom): feature quebrada em PRs pequenas
PR #42: "Add User model and migration"
  - 3 files changed, +45 lines
  - Revisada em 30 min

PR #43: "Add password hashing utility"
  - 2 files changed, +38 lines
  - Revisada em 20 min

PR #44: "Add login endpoint"
  - 4 files changed, +67 lines
  - Revisada em 45 min

PR #45: "Add auth middleware"
  - 3 files changed, +52 lines
  - Revisada em 30 min

PR #46: "Connect auth to routes and add feature flag"
  - 5 files changed, +34 lines
  - Revisada em 25 min
```

## Refatoracao — Codigo acumulando remendos

```typescript
// Versao 1: simples e limpo
function formatPrice(priceInCents: number): string {
  return `R$ ${(priceInCents / 100).toFixed(2)}`
}

// 6 meses depois, sem refatoracao: remendos acumulados
function formatPrice(priceInCents: number, currency?: string, locale?: string, showSymbol?: boolean, discount?: number, coupon?: string): string {
  let price = priceInCents / 100
  if (discount) price = price * (1 - discount / 100)
  if (coupon === 'BLACKFRIDAY') price = price * 0.5
  if (coupon === 'WELCOME10') price = price * 0.9
  // TODO: add more coupons
  const symbol = showSymbol !== false ? (currency || 'R$') : ''
  // João added this for the international sprint
  if (locale === 'en-US') return `${symbol} ${price.toFixed(2)}`
  // Maria's fix for the comma issue
  if (locale === 'pt-BR' || !locale) return `${symbol} ${price.toFixed(2).replace('.', ',')}`
  return `${symbol} ${price.toFixed(2)}`
}

// COM refatoracao constante: responsabilidades separadas
function applyDiscount(priceInCents: number, discountPercent: number): number {
  return Math.round(priceInCents * (1 - discountPercent / 100))
}

function applyCoupon(priceInCents: number, couponCode: string): number {
  const discounts: Record<string, number> = {
    BLACKFRIDAY: 50,
    WELCOME10: 10,
  }
  const discount = discounts[couponCode] ?? 0
  return applyDiscount(priceInCents, discount)
}

function formatPrice(priceInCents: number, locale = 'pt-BR', currency = 'BRL'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(priceInCents / 100)
}
```