# Code Examples: Numeros Magicos

## Exemplo 1: setTimeout com numero magico

### O problema
```typescript
// Quanto tempo e isso? Impossivel saber sem calcular
setTimeout(() => {
  // algum codigo
}, 2592000000)
```

### Passo 1: Calculo inline
```typescript
// Melhor — cada fator e reconhecivel
setTimeout(() => {
  // algum codigo
}, 1000 * 60 * 60 * 24 * 30)
// 1000ms = 1s, *60 = 1min, *60 = 1h, *24 = 1dia, *30 = 30dias
```

### Passo 2: Constante nomeada
```typescript
const THIRTY_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 30

setTimeout(() => {
  // algum codigo
}, THIRTY_DAYS_IN_MS)
```

### Passo 3: Alternativa com comentario (para uso unico)
```typescript
setTimeout(() => {
  // algum codigo
}, 1000 * 60 * 60 * 24 * 30) // 30 dias
```

## Exemplo 2: Numeric separators

```typescript
// Que numero e esse? Conte os zeros...
const value1 = 1000000000

// Ah, 1 bilhao! Facil de ver com separadores
const value2 = 1_000_000_000

// Funciona com qualquer numero grande
const microsecondsPerDay = 86_400_000_000
```

## Exemplo 3: Precos em centavos

```typescript
// Ruim — "price" nao diz o formato
function applyDiscount(price: number, discount: number): number {
  return price - (price * discount) / 100
}

// Bom — unidade explicita no nome
function applyDiscount(priceInCents: number, discountInPercent: number): number {
  return priceInCents - (priceInCents * discountInPercent) / 100
}
```

### Por que centavos?
```typescript
// Problema com float
console.log(0.1 + 0.2) // 0.30000000000000004

// Solucao: trabalhe em centavos (inteiros)
const priceInCents = 1990 // R$ 19,90
const taxInCents = 199    // R$ 1,99
const totalInCents = priceInCents + taxInCents // 2189 = R$ 21,89 (exato!)
```

## Exemplo 4: Horarios em minutos

```typescript
// Ruim — string nao permite calculos
const meetingTime = "18:00"

// Bom — minutos desde meia-noite, facil de calcular
const meetingStartInMinutes = 18 * 60 // 1080 = 18:00
const meetingDurationInMinutes = 90

const meetingEndInMinutes = meetingStartInMinutes + meetingDurationInMinutes // 1170 = 19:30
```

## Exemplo 5: Variacoes praticas

### Configuracao de cache
```typescript
// Ruim
const CACHE_TTL = 3600

// Bom
const CACHE_TTL_IN_SECONDS = 60 * 60 // 1 hora
```

### Limite de upload
```typescript
// Ruim
const MAX_FILE_SIZE = 5242880

// Bom
const MAX_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024 // 5 MB
```

### Retry com backoff
```typescript
// Ruim
await sleep(30000)

// Bom
const RETRY_DELAY_IN_MS = 30 * 1_000 // 30 segundos
await sleep(RETRY_DELAY_IN_MS)
```

### Meses no JavaScript
```typescript
// Cuidado: JavaScript retorna 0 para janeiro!
const currentMonth = new Date().getMonth() // 0 = Jan, 11 = Dec

// Ao comparar, documente o comportamento
if (currentMonth === 0) { // January (JS months are 0-indexed)
  // logica de janeiro
}
```