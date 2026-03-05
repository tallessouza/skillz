# Code Examples: Fuso Horário e Timestamps

## 1. Entendendo o Epoch

```javascript
// O epoch do JavaScript
const epoch = new Date(0)

// Em UTC (absoluto):
console.log(epoch.toISOString())
// "1970-01-01T00:00:00.000Z"

// Em fuso local (Brasil, UTC-3):
console.log(epoch.toString())
// "Wed Dec 31 1969 21:00:00 GMT-0300 (Horário Padrão de Brasília)"

// O timestamp interno é o mesmo:
console.log(epoch.getTime()) // 0
```

## 2. Timestamp Atual

```javascript
// Três formas de obter o timestamp atual
const timestamp1 = Date.now()                    // mais eficiente, não cria objeto
const timestamp2 = new Date().getTime()          // cria objeto Date intermediário
const timestamp3 = +new Date()                   // coerção numérica (menos legível)

// Todos retornam milissegundos desde epoch UTC
console.log(timestamp1) // ex: 1772485200000
```

## 3. Local vs UTC — Comparação Direta

```javascript
const date = new Date('2026-03-01T12:00:00Z') // meio-dia UTC

// Métodos LOCAL (dependem do ambiente)
console.log(date.getHours())        // 9 (no Brasil, UTC-3)
console.log(date.getDate())         // 1
console.log(date.toString())        // "Sun Mar 01 2026 09:00:00 GMT-0300"
console.log(date.toLocaleString('pt-BR'))
// "01/03/2026, 09:00:00"

// Métodos UTC (absolutos)
console.log(date.getUTCHours())     // 12
console.log(date.getUTCDate())      // 1
console.log(date.toISOString())     // "2026-03-01T12:00:00.000Z"
console.log(date.toUTCString())     // "Sun, 01 Mar 2026 12:00:00 GMT"
```

## 4. Armadilha: Criar Datas sem Timezone Explícito

```javascript
// PERIGOSO — comportamento varia entre ambientes
const ambiguous = new Date("2026-03-01")
// Alguns browsers interpretam como UTC, outros como local

// SEGURO — Z indica UTC explicitamente
const explicit = new Date("2026-03-01T00:00:00Z")

// SEGURO — timestamp numérico é sempre UTC
const fromTimestamp = new Date(1772438400000)
```

## 5. Padrão para APIs: Armazenar e Transmitir

```typescript
// No servidor — armazene UTC
interface Event {
  name: string
  scheduledAt: number  // timestamp em ms (UTC implícito)
}

const event: Event = {
  name: 'Reunião',
  scheduledAt: Date.now()
}

// Na API — transmita ISO UTC
const response = {
  ...event,
  scheduledAt: new Date(event.scheduledAt).toISOString()
  // "2026-03-01T15:30:00.000Z"
}

// No frontend — exiba local
const displayDate = new Date(response.scheduledAt)
  .toLocaleString('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short'
  })
// "1 de março de 2026, 12:30"
```

## 6. Comparação de Datas

```javascript
const date1 = new Date('2026-03-01T10:00:00Z')
const date2 = new Date('2026-03-01T13:00:00-03:00') // mesmo instante!

// ERRADO — strings são diferentes
console.log(date1.toString() === date2.toString()) // true (ambos no mesmo fuso local)
// Mas em fusos diferentes, toString() diverge

// CORRETO — timestamps são iguais
console.log(date1.getTime() === date2.getTime()) // true
// Ambos representam o mesmo ponto absoluto no tempo
```

## 7. Verificando o Deslocamento do Ambiente

```javascript
// Minutos de diferença entre UTC e fuso local
const offsetMinutes = new Date().getTimezoneOffset()
// Brasil: 180 (3 horas * 60 minutos)
// Nota: valor positivo = oeste de UTC

const offsetHours = offsetMinutes / 60
console.log(`Fuso local: UTC${offsetHours > 0 ? '-' : '+'}${Math.abs(offsetHours)}`)
// "Fuso local: UTC-3"
```