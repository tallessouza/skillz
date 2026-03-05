# Code Examples: Servico de Busca com Filtro por Data

## Exemplo principal da aula

### Arquivo: services/schedule-fetch-by-day.js

```javascript
import dayjs from "dayjs"
import { apiConfig } from "./api-config"

export async function scheduleFetchByDay(date) {
  try {
    // Faz a requisicao
    const response = await fetch(`${apiConfig.BASE_URL}/schedules`)

    // Converte para JSON
    const data = await response.json()

    // Filtra os agendamentos pelo dia selecionado
    const dailySchedules = data.filter((schedule) =>
      dayjs(date).isSame(schedule.when, "day")
    )

    return dailySchedules
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel buscar os agendamentos do dia selecionado.")
  }
}
```

## Servico irmao de referencia: schedule-create.js

O instrutor menciona o servico de criacao que ja existia, seguindo o mesmo padrao:

```javascript
import { apiConfig } from "./api-config"

export async function scheduleCreate(scheduleData) {
  try {
    // Faz a requisicao para enviar os dados do agendamento
    const response = await fetch(`${apiConfig.BASE_URL}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData),
    })

    const data = await response.json()

    // Exibe mensagem de agendamento realizado
    alert("Agendamento realizado com sucesso!")

    return data
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel realizar o agendamento.")
  }
}
```

## Variacao: filtro no servidor (producao)

```javascript
export async function scheduleFetchByDay(date) {
  try {
    const formattedDate = dayjs(date).format("YYYY-MM-DD")
    const response = await fetch(
      `${apiConfig.BASE_URL}/schedules?date=${formattedDate}`
    )
    const dailySchedules = await response.json()
    return dailySchedules
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel buscar os agendamentos do dia selecionado.")
  }
}
```

## Variacao: filtro por hora (granularidade diferente)

```javascript
const schedulesThisHour = data.filter((schedule) =>
  dayjs(date).isSame(schedule.when, "hour")
)
```

## Variacao: multiplos filtros encadeados

```javascript
const confirmedDailySchedules = data
  .filter((schedule) => dayjs(date).isSame(schedule.when, "day"))
  .filter((schedule) => schedule.status === "confirmed")
```

## Uso no componente

```javascript
import { scheduleFetchByDay } from "../services/schedule-fetch-by-day"

// Dentro de um useEffect ou handler
const loadSchedules = async () => {
  const schedules = await scheduleFetchByDay(selectedDate)
  if (schedules) {
    setDailySchedules(schedules)
  }
}
```

## Estrutura da pasta services

```
services/
├── api-config.js           # BASE_URL centralizada
├── schedule-create.js      # POST - criar agendamento
└── schedule-fetch-by-day.js # GET - buscar por dia
```