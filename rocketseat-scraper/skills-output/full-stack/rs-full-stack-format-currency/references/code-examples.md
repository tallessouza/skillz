# Code Examples: Formatação de Moeda (formatCurrency)

## Exemplo da aula — Implementação completa

### 1. Criando a função utilitária

```typescript
// utils/format-currency.ts
export function formatCurrency(value: number) {
  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return currency.format(value).replace("R$", "").trim()
}
```

### 2. Objeto de exemplo com valor numérico

```typescript
// Antes (string com formatação manual):
const refundExample = {
  amount: "R$ 34,50", // ❌ string formatada
}

// Depois (número puro):
const refundExample = {
  amount: 34.5, // ✅ número com ponto decimal
}
```

### 3. Usando no componente Dashboard

```typescript
// pages/dashboard.tsx
import { formatCurrency } from "@/utils/format-currency"

// Onde antes era exibido direto:
<span>{refundExample.amount}</span>

// Agora usa a função de formatação:
<span>{formatCurrency(refundExample.amount)}</span>
```

### 4. Componente RefundItem com símbolo R$ no layout

```tsx
// components/refund-item.tsx
interface RefundItemProps {
  amount: number
}

export function RefundItem({ amount }: RefundItemProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-gray-500">R$</span>
      <span className="font-semibold">{formatCurrency(amount)}</span>
    </div>
  )
}
```

## Variações úteis

### Com símbolo incluído (quando layout não tem R$)

```typescript
export function formatCurrencyFull(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
  // 34.5 → "R$ 34,50"
}
```

### Sem casas decimais (para valores inteiros)

```typescript
export function formatCurrencyWhole(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace("R$", "").trim()
  // 1500 → "1.500"
}
```

### Múltiplas moedas

```typescript
export function formatMoney(value: number, currency: string = "BRL", locale: string = "pt-BR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value)
  // formatMoney(34.5, "USD", "en-US") → "$34.50"
  // formatMoney(34.5, "EUR", "de-DE") → "34,50 €"
}
```

### Valores vindos como string da API

```typescript
// Quando a API retorna string ao invés de number
const amountFromApi = "34.5" // string

const formatted = formatCurrency(Number(amountFromApi))
// "34,50"
```

## Resultado visual

```
Entrada: 34.5 (number)
                ↓
Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
                ↓
"R$ 34,50" (string com símbolo)
                ↓
.replace("R$", "").trim()
                ↓
"34,50" (string sem símbolo, pronta para UI)
```