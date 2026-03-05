# Code Examples: Data e Hora com Fuso Horário

## Exemplo 1: Fluxo completo da aula

```javascript
// Criar data atual
const now = new Date()

// Ver o formato ISO
console.log(now.toISOString())
// "2024-01-15T19:58:10.123Z"

// Criar data com offset +03:00
const isoBase = now.toISOString().replace("Z", "")
const dateWithTimezone = new Date(`${isoBase}+03:00`)

// Comparar
console.log("Sem fuso:", now.toLocaleString())
// "15/01/2024, 19:58:10"

console.log("Com +03:00:", dateWithTimezone.toLocaleString())
// "15/01/2024, 16:58:10" (andou 3h para trás)
```

## Exemplo 2: Offset negativo

```javascript
const now = new Date()
const isoBase = now.toISOString().replace("Z", "")

const dateMinus3 = new Date(`${isoBase}-03:00`)
console.log("Com -03:00:", dateMinus3.toLocaleString())
// Hora anda 3h para frente
```

## Exemplo 3: Comparando múltiplos fusos

```javascript
const baseTime = "2024-06-15T12:00:00.000"

const utc = new Date(`${baseTime}Z`)
const saoPaulo = new Date(`${baseTime}-03:00`)
const tokyo = new Date(`${baseTime}+09:00`)
const newYork = new Date(`${baseTime}-05:00`)

console.log("UTC:      ", utc.toISOString())       // 12:00 UTC
console.log("São Paulo:", saoPaulo.toISOString())   // 15:00 UTC
console.log("Tokyo:    ", tokyo.toISOString())      // 03:00 UTC
console.log("New York: ", newYork.toISOString())    // 17:00 UTC
```

## Exemplo 4: Função utilitária

```javascript
function createDateWithOffset(offsetHours) {
  const now = new Date()
  const iso = now.toISOString().replace("Z", "")
  const sign = offsetHours >= 0 ? "+" : "-"
  const absHours = Math.abs(offsetHours).toString().padStart(2, "0")
  return new Date(`${iso}${sign}${absHours}:00`)
}

const moscowTime = createDateWithOffset(3)
const brasiliaTime = createDateWithOffset(-3)

console.log("Moscou:", moscowTime.toLocaleString())
console.log("Brasília:", brasiliaTime.toLocaleString())
```

## Exemplo 5: Usando com data fixa (não atual)

```javascript
// Criar uma data específica em um fuso específico
const meetingInTokyo = new Date("2024-03-20T09:00:00.000+09:00")
const meetingInSaoPaulo = new Date("2024-03-20T09:00:00.000-03:00")

// Ambas às 9h local, mas em momentos UTC diferentes
console.log("Tokyo 9h =", meetingInTokyo.toISOString())
// "2024-03-20T00:00:00.000Z" (meia-noite UTC)

console.log("SP 9h =", meetingInSaoPaulo.toISOString())
// "2024-03-20T12:00:00.000Z" (meio-dia UTC)

// Diferença: 12 horas entre os dois momentos reais
```

## Exemplo 6: Formatação com toLocaleString e timezone

```javascript
const date = new Date("2024-01-15T14:30:00.000-03:00")

// Exibir em diferentes formatos
console.log(date.toLocaleString("pt-BR"))
// "15/01/2024 14:30:00"

console.log(date.toLocaleString("en-US"))
// "1/15/2024, 2:30:00 PM"

// Com timezone explícito na exibição
console.log(date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }))
console.log(date.toLocaleString("pt-BR", { timeZone: "Asia/Tokyo" }))
```