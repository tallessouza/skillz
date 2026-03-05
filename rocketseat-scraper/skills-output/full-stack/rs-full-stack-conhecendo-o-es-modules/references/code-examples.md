# Code Examples: ES Modules (ESM)

## Exemplo basico: export e import

### Named export (preferido)

```typescript
// math.ts
export function sum(a: number, b: number): number {
  return a + b
}

export function multiply(a: number, b: number): number {
  return a * b
}
```

```typescript
// app.ts
import { sum, multiply } from './math'

console.log(sum(2, 3))      // 5
console.log(multiply(2, 3))  // 6
```

### Default export (usar com cautela)

```typescript
// logger.ts
export default function log(message: string) {
  console.log(`[LOG] ${message}`)
}
```

```typescript
// app.ts
import log from './logger'
log('Aplicacao iniciada')
```

## Exemplo de reuso: formatacao compartilhada

```typescript
// utils/format.ts
export function formatCurrency(valueInCents: number): string {
  return `R$ ${(valueInCents / 100).toFixed(2)}`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR')
}
```

```typescript
// pages/invoice.ts
import { formatCurrency, formatDate } from '../utils/format'

export function renderInvoice(invoice: Invoice) {
  return `Valor: ${formatCurrency(invoice.totalInCents)} - Data: ${formatDate(invoice.createdAt)}`
}
```

```typescript
// pages/report.ts
import { formatCurrency } from '../utils/format'

export function renderReport(totals: number[]) {
  return totals.map(t => formatCurrency(t))
}
```

Ambos `invoice.ts` e `report.ts` reutilizam `formatCurrency`. Se a formatacao mudar, corrige-se em um unico lugar.

## Exemplo de organizacao por responsabilidade

```typescript
// services/auth-service.ts — responsabilidade: autenticacao
export function login(email: string, password: string) { /* ... */ }
export function logout() { /* ... */ }
export function isAuthenticated(): boolean { /* ... */ }

// services/user-service.ts — responsabilidade: gerenciamento de usuarios
export function createUser(data: CreateUserInput) { /* ... */ }
export function findUserById(id: string) { /* ... */ }
export function updateUser(id: string, data: Partial<User>) { /* ... */ }

// services/notification-service.ts — responsabilidade: notificacoes
export function sendEmail(to: string, subject: string, body: string) { /* ... */ }
export function sendSMS(to: string, message: string) { /* ... */ }
```

## Re-export (barrel files)

```typescript
// services/index.ts — ponto de entrada do modulo de servicos
export { login, logout, isAuthenticated } from './auth-service'
export { createUser, findUserById, updateUser } from './user-service'
export { sendEmail, sendSMS } from './notification-service'
```

```typescript
// app.ts
import { login, createUser, sendEmail } from './services'
```

## Variacoes de import

```typescript
// Named import (preferido)
import { sum, multiply } from './math'

// Import com alias (quando ha conflito de nomes)
import { format as formatUser } from './user-format'
import { format as formatDate } from './date-format'

// Import tudo como namespace (usar com moderacao)
import * as MathUtils from './math'
MathUtils.sum(1, 2)

// Import para side-effects (raro, ex: polyfills)
import './setup'
```