# Code Examples: Carregando Horários Disponíveis

## Exemplo 1: Estrutura de arquivos completa

### page-load.js (entry point)

```javascript
import { schedulesDay } from "./schedules/load.js"

// Executado quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
  schedulesDay()
})
```

### schedules/load.js (centralizador)

```javascript
import { hoursLoad } from "./hours-load.js"

// Seleciona o input de data
const selectedDate = document.getElementById("date")

export function schedulesDay() {
  // Obtém a data do input
  const date = selectedDate.value

  // Renderiza as horas disponíveis
  hoursLoad({ date })

  // Futuramente: carregar agendamentos do dia da API
}
```

### schedules/hours-load.js (carregamento de horários)

```javascript
import dayjs from "dayjs"
import { openingHours } from "../../utils/opening-hours.js"

export function hoursLoad({ date }) {
  const available = openingHours.map((hour) => {
    // Desestrutura para pegar só a hora, ignorando minutos
    const [scheduleHour] = hour.split(":")

    // Adiciona a hora na data e verifica se é futuro
    const isAvailable = dayjs(date)
      .add(scheduleHour, "hour")
      .isAfter(dayjs())

    return { hour: scheduleHour, available: isAvailable }
  })

  return available
}
```

### utils/opening-hours.js (dados estáticos)

```javascript
export const openingHours = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00", "21:00"
]
```

## Exemplo 2: Evolução da desestruturação (passo a passo)

### Passo 1 — Sem desestruturação

```javascript
openingHours.map((hour) => {
  const parts = hour.split(":")
  console.log(parts)
  // Output: ["09", "00"], ["10", "00"], ["11", "00"], ...
})
```

### Passo 2 — Com desestruturação

```javascript
openingHours.map((hour) => {
  const [scheduleHour] = hour.split(":")
  console.log(scheduleHour)
  // Output: "09", "10", "11", ...
})
```

## Exemplo 3: Evolução do filtro de horário passado

### Tentativa 1 — isBefore (invertido)

```javascript
const isHourPast = dayjs(date)
  .add(scheduleHour, "hour")
  .isBefore(dayjs())

// isHourPast = true para horários no passado
// Precisa inverter: available = !isHourPast
```

### Tentativa 2 — isAfter (direto)

```javascript
const isAvailable = dayjs(date)
  .add(scheduleHour, "hour")
  .isAfter(dayjs())

// isAvailable = true para horários no futuro
// Sem inversão necessária
```

## Exemplo 4: Output esperado da função

```javascript
// Se agora são 17:30 e date = "2024-01-15"
const result = hoursLoad({ date: "2024-01-15" })

// Resultado:
[
  { hour: "9", available: false },
  { hour: "10", available: false },
  { hour: "11", available: false },
  { hour: "12", available: false },
  { hour: "13", available: false },
  { hour: "14", available: false },
  { hour: "15", available: false },
  { hour: "16", available: false },
  { hour: "17", available: false },
  { hour: "18", available: true },
  { hour: "19", available: true },
  { hour: "20", available: true },
  { hour: "21", available: true },
]
```

## Exemplo 5: Variação — adicionando filtro de agendados

```javascript
// Extensão futura: recebe também os horários já agendados
export function hoursLoad({ date, bookedHours = [] }) {
  return openingHours.map((hour) => {
    const [scheduleHour] = hour.split(":")

    const isAfterNow = dayjs(date)
      .add(scheduleHour, "hour")
      .isAfter(dayjs())

    const isNotBooked = !bookedHours.includes(scheduleHour)

    return {
      hour: scheduleHour,
      available: isAfterNow && isNotBooked,
    }
  })
}
```