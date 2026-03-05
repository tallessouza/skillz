---
name: rs-full-stack-servico-buscar-agendamentos
description: "Applies fetch-and-filter pattern when building API service functions that retrieve and filter data by date. Use when user asks to 'fetch schedules', 'list appointments', 'filter by day', 'create a service to get data', or 'buscar agendamentos'. Enforces async/await with try/catch, response.json() conversion, and client-side filtering with dayjs. Make sure to use this skill whenever creating API fetch services that filter by date in JavaScript/React Native. Not for POST/create services, database queries, or backend route implementation."
---

# Servico de Busca com Filtro por Data

> Ao criar um servico que busca dados de uma API e filtra por data, separe em tres etapas claras: requisicao, conversao e filtragem.

## Rules

1. **Separe busca e filtro em etapas explicitas** — requisicao → conversao JSON → filtragem, porque cada etapa pode falhar independentemente e facilita debug
2. **Use async/await com try/catch** — toda chamada fetch e precisa de tratamento de erro com mensagem clara para o usuario
3. **Receba a data como parametro** — a funcao de busca recebe `date` e filtra internamente, porque desacopla a logica de selecao de data da busca
4. **Use dayjs.isSame com granularidade 'day'** — `dayjs(date).isSame(item.when, 'day')` para comparar apenas o dia, ignorando hora/minuto
5. **Centralize a URL base em um config** — importe `apiConfig.BASE_URL` para nao repetir URLs em cada servico
6. **Nomeie o arquivo pelo padrao Entidade-Acao** — `schedule-fetch-by-day.js`, `schedule-create.js`, porque facilita encontrar servicos por entidade

## How to write

### Servico de busca com filtro por dia

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

## Example

**Before (tudo misturado, sem etapas claras):**
```javascript
export async function getSchedules(d) {
  const res = await fetch("http://localhost:3000/schedules")
  const json = await res.json()
  return json.filter(s => s.when.includes(d))
}
```

**After (com this skill applied):**
```javascript
import dayjs from "dayjs"
import { apiConfig } from "./api-config"

export async function scheduleFetchByDay(date) {
  try {
    const response = await fetch(`${apiConfig.BASE_URL}/schedules`)
    const data = await response.json()

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

## Heuristics

| Situation | Do |
|-----------|-----|
| API ja filtra por query param | Passe o dia na URL e pule o filter no client |
| API retorna tudo sem filtro | Use filter + dayjs no client |
| Comparacao precisa de hora | Use `isSame(when, 'hour')` em vez de `'day'` |
| Multiplos filtros (dia + status) | Encadeie `.filter()` ou combine condicoes no mesmo filter |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `s.when.includes(date)` (string match) | `dayjs(date).isSame(s.when, "day")` (date-aware) |
| `fetch("http://localhost:3000/...")` hardcoded | `fetch(\`${apiConfig.BASE_URL}/...\`)` |
| `function getData()` nome generico | `function scheduleFetchByDay(date)` nome descritivo |
| fetch sem try/catch | Sempre envolva em try/catch com alert para o usuario |
| `res.json()` sem await | `await response.json()` — json() retorna Promise |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao em etapas, quando filtrar no client vs server, e uso do dayjs
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes e anotacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-servico-para-buscar-agendamentos-do-dia/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-servico-para-buscar-agendamentos-do-dia/references/code-examples.md)
