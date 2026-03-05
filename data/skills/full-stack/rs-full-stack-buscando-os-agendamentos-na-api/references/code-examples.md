# Code Examples: Buscando Dados da API com Async/Await

## Exemplo 1: Import do service (como feito na aula)

```javascript
// modules/schedules/load.js
import { scheduleFetchByDay } from "./services/schedule-fetch-by-day.js"
```

O instrutor destaca: coloque a extensao `.js` e use autocomplete para evitar erros no nome.

## Exemplo 2: Funcao de carregamento async

```javascript
// Antes — funcao sincrona (ERRO)
function load(date) {
  const dailySchedules = await scheduleFetchByDay({ date })
  // TypeError: await is only valid in async functions
}

// Depois — funcao async (CORRETO)
async function load(date) {
  const dailySchedules = await scheduleFetchByDay({ date })
  console.log(dailySchedules)
}
```

## Exemplo 3: Parametro como objeto vs posicional

```javascript
// Posicional — fragil
async function load(date) {
  const dailySchedules = await scheduleFetchByDay(date)
}

// Objeto — flexivel (preferido pelo instrutor)
async function load(date) {
  const dailySchedules = await scheduleFetchByDay({ date })
}

// Quando precisar adicionar filtro novo:
async function load(date) {
  const dailySchedules = await scheduleFetchByDay({ date, status: "confirmed" })
  // Nenhuma chamada existente quebrou
}
```

## Exemplo 4: Validacao no console antes de renderizar

```javascript
async function load(date) {
  const dailySchedules = await scheduleFetchByDay({ date })

  // Passo 1: validar dados (temporario)
  console.log(dailySchedules)
  // Output: [{ id: "1", name: "Rodrigo", when: "2024-01-15T09:00:00" }]

  // Passo 2: renderizar (proxima aula)
  // renderSchedules(dailySchedules)
}
```

## Exemplo 5: Service completo (contexto do projeto)

```javascript
// services/schedule-fetch-by-day.js
export async function scheduleFetchByDay({ date }) {
  const response = await fetch(`http://localhost:3333/schedules?date=${date}`)
  const schedules = await response.json()
  return schedules
}
```

## Exemplo 6: Fluxo completo do modulo

```javascript
// modules/schedules/load.js
import { scheduleFetchByDay } from "./services/schedule-fetch-by-day.js"
import { hoursLoad } from "./hours-load.js"

async function load(date) {
  // 1. Carrega horarios disponiveis
  const hours = hoursLoad({ date })

  // 2. Busca agendamentos do dia na API
  const dailySchedules = await scheduleFetchByDay({ date })

  // 3. Renderiza (implementado na proxima aula)
  // renderSchedules(dailySchedules, hours)
}
```

## Variacao: Tratamento de erro

```javascript
async function load(date) {
  try {
    const dailySchedules = await scheduleFetchByDay({ date })
    console.log(dailySchedules)
  } catch (error) {
    console.error("Falha ao buscar agendamentos:", error.message)
  }
}
```

## Variacao: Multiplos fetches paralelos

```javascript
async function load(date) {
  const [dailySchedules, availableHours] = await Promise.all([
    scheduleFetchByDay({ date }),
    fetchAvailableHours({ date }),
  ])

  console.log({ dailySchedules, availableHours })
}
```