# Code Examples: Day.js

## Instalacao

```bash
npm install dayjs
```

## Import

```typescript
import dayjs from 'dayjs'
```

## Comparacao de datas (isBefore / isAfter)

Mencionado na aula como exemplo de funcionalidade que "iria levar algumas linhas para resolver" sem biblioteca:

```typescript
// Verificar se data expirou
const expirationDate = '2026-12-31'
const isExpired = dayjs(expirationDate).isBefore(dayjs())
// false (ainda nao expirou)

// Verificar se evento ja passou
const eventDate = '2025-01-01'
const hasPassed = dayjs(eventDate).isBefore(dayjs())
// true

// Comparar duas datas entre si
const isFirstEarlier = dayjs('2026-01-01').isBefore('2026-06-01')
// true
```

### Equivalente sem day.js (mais verboso):
```typescript
function isBefore(date1: string, date2: string): boolean {
  return new Date(date1).getTime() < new Date(date2).getTime()
}
```

## Adicao de tempo (add)

Destacado na aula: "posso utilizar um metodo add, passando quantos dias eu quero adicionar":

```typescript
// Adicionar dias
const tomorrow = dayjs().add(1, 'day')
const nextWeek = dayjs().add(7, 'day')

// Adicionar meses
const nextMonth = dayjs().add(1, 'month')
const inThreeMonths = dayjs().add(3, 'month')

// Adicionar anos
const nextYear = dayjs().add(1, 'year')

// Adicionar horas/minutos/segundos
const inTwoHours = dayjs().add(2, 'hour')
const inThirtyMinutes = dayjs().add(30, 'minute')
const inTenSeconds = dayjs().add(10, 'second')
```

### Unidades disponiveis para add/subtract:
| Unidade | Abreviacao |
|---------|-----------|
| `day` | `d` |
| `week` | `w` |
| `month` | `M` |
| `year` | `y` |
| `hour` | `h` |
| `minute` | `m` |
| `second` | `s` |
| `millisecond` | `ms` |

## Extracao de componentes

Mencionado na aula: "se eu quisesse pegar so a hora, tem um metodo que retorna para a gente a hora":

```typescript
const now = dayjs()

const hour = now.hour()       // 14
const minute = now.minute()   // 30
const second = now.second()   // 45
const year = now.year()       // 2026
const month = now.month()     // 0-11 (janeiro = 0)
const date = now.date()       // 1-31
const day = now.day()         // 0-6 (domingo = 0)
```

## Setter (retorna novo objeto)

Mencionado na aula: "ele retorna um novo objeto do day.js ja com uma hora definida":

```typescript
// Definir hora especifica (retorna NOVO objeto, imutavel)
const atNoon = dayjs().hour(12)
const atMidnight = dayjs().hour(0).minute(0).second(0)
```

## Formatacao

```typescript
dayjs().format('DD/MM/YYYY')          // "01/03/2026"
dayjs().format('YYYY-MM-DD')          // "2026-03-01"
dayjs().format('DD/MM/YYYY HH:mm')    // "01/03/2026 14:30"
dayjs().format('dddd, D [de] MMMM')   // "Sunday, 1 de March"
```

## Encadeamento

```typescript
// Adicionar 7 dias e formatar
const result = dayjs()
  .add(7, 'day')
  .format('DD/MM/YYYY')

// Verificar se daqui a 30 dias e antes do deadline
const isOnTime = dayjs()
  .add(30, 'day')
  .isBefore('2026-12-31')
```

## Subtracao

```typescript
const yesterday = dayjs().subtract(1, 'day')
const lastMonth = dayjs().subtract(1, 'month')
const lastYear = dayjs().subtract(1, 'year')
```

## Comparacao com moment.js (tamanho)

```bash
# day.js: ~2KB gzipped
npm install dayjs

# moment.js: ~70KB+ gzipped (NAO recomendado para novos projetos)
npm install moment
```

Ambos tem API similar:
```typescript
// moment.js
moment().add(7, 'days').format('DD/MM/YYYY')

// day.js (quase identico, 35x menor)
dayjs().add(7, 'day').format('DD/MM/YYYY')
```