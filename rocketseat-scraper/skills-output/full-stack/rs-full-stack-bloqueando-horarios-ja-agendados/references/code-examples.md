# Code Examples: Bloqueando Horários Já Agendados

## Exemplo 1: Função hoursLoad original (sem bloqueio)

```javascript
// Antes — só verificava se horário estava no passado
function hoursLoad(date) {
  hoursList.innerHTML = ""

  hours.forEach((hour) => {
    // hours vem de utils — array com horários de funcionamento
    // ex: ["09:00", "10:00", "11:00", ..., "21:00"]
    const isHourPast = dayjs(hour).isBefore(dayjs())

    hoursList.innerHTML += `<li class="hour ${isHourPast ? "unavailable" : ""}">${hour}</li>`
  })
}

// Chamada:
hoursLoad(selectedDate)
```

## Exemplo 2: Função hoursLoad com bloqueio (versão final)

```javascript
function hoursLoad(date, dailySchedules) {
  hoursList.innerHTML = ""

  // Obtém lista de horários ocupados
  const unavailableHours = dailySchedules.map((schedule) =>
    dayjs(schedule.when).format("HH:mm")
  )

  hours.forEach((hour) => {
    const isBefore = dayjs(hour).isBefore(dayjs())
    const available = !unavailableHours.includes(hour) && !isBefore

    hoursList.innerHTML += `<li class="hour ${available ? "" : "unavailable"}">${hour}</li>`
  })
}

// Chamada atualizada — passa agendamentos como segundo argumento:
hoursLoad(selectedDate, dailySchedules)
```

## Exemplo 3: Estrutura dos dados da API

```javascript
// O que a API retorna para os agendamentos do dia:
const dailySchedules = [
  {
    id: "abc123",
    name: "João da Silva",
    when: "2024-02-15T20:00:00.000Z"
  },
  {
    id: "def456",
    name: "Maria Santos",
    when: "2024-02-15T14:00:00.000Z"
  }
]

// Após o map:
const unavailableHours = ["20:00", "14:00"]
```

## Exemplo 4: O bug AND vs OR demonstrado ao vivo

```javascript
// ERRADO (bug que o instrutor cometeu):
const available = !unavailableHours.includes(hour) || !isBefore
// Para hour="20:00" (ocupado), isBefore=false:
// !true || !false → false || true → true ← ERRADO! Mostra como disponível

// CORRETO (correção):
const available = !unavailableHours.includes(hour) && !isBefore
// Para hour="20:00" (ocupado), isBefore=false:
// !true && !false → false && true → false ← CORRETO! Mostra como indisponível
```

## Exemplo 5: Array de horários de funcionamento (utils)

```javascript
// src/utils/hours.js
export const hours = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00", "21:00"
]
```

## Variação: Versão com Set para performance

```javascript
// Para muitos agendamentos, Set tem O(1) lookup vs O(n) do includes
function hoursLoad(date, dailySchedules) {
  hoursList.innerHTML = ""

  const unavailableHoursSet = new Set(
    dailySchedules.map((schedule) =>
      dayjs(schedule.when).format("HH:mm")
    )
  )

  hours.forEach((hour) => {
    const isBefore = dayjs(hour).isBefore(dayjs())
    const available = !unavailableHoursSet.has(hour) && !isBefore

    hoursList.innerHTML += `<li class="hour ${available ? "" : "unavailable"}">${hour}</li>`
  })
}
```

## Variação: React/componente

```tsx
function TimeSlotList({ date, schedules }: Props) {
  const unavailableHours = useMemo(
    () => schedules.map((s) => dayjs(s.when).format("HH:mm")),
    [schedules]
  )

  return (
    <ul>
      {BUSINESS_HOURS.map((hour) => {
        const isPast = dayjs(`${date} ${hour}`).isBefore(dayjs())
        const isAvailable = !unavailableHours.includes(hour) && !isPast

        return (
          <li key={hour} className={isAvailable ? "available" : "unavailable"}>
            {hour}
          </li>
        )
      })}
    </ul>
  )
}
```