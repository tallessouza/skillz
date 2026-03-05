---
name: rs-full-stack-renderizando-agendamentos-dia
description: "Applies dynamic DOM rendering patterns when building schedule/appointment displays grouped by time periods. Use when user asks to 'render a list', 'display appointments', 'show schedules by period', 'create dynamic HTML elements', or 'group items by time'. Enforces createElement workflow, innerHTML clearing, conditional period assignment, and dayjs formatting. Make sure to use this skill whenever dynamically rendering API data into categorized DOM lists. Not for static HTML, React/Vue components, or CSS styling tasks."
---

# Renderizando Agendamentos por Período

> Ao renderizar listas dinâmicas no DOM, limpe primeiro, crie elementos individuais com createElement, e distribua condicionalmente por categoria.

## Rules

1. **Separe busca de renderização** — crie arquivos distintos (`load.js` para fetch, `show.js` para render), porque responsabilidade única facilita reuso e manutenção
2. **Limpe antes de preencher** — use `innerHTML = ""` em todos os containers antes de inserir novos itens, porque evita duplicação ao recarregar dados
3. **Use createElement, não innerHTML com template strings** — `document.createElement("li")` não `container.innerHTML += "<li>..."`, porque createElement é mais seguro contra XSS e permite manipulação individual
4. **Distribua por período usando hora extraída** — `hour <= 12` manhã, `hour <= 18` tarde, else noite, porque agrupa visualmente sem depender de campo extra na API
5. **Envolva renderização em try/catch** — erros de DOM não devem quebrar silenciosamente, porque o usuário precisa de feedback quando a exibição falha
6. **Adicione data attributes para identificação** — `item.setAttribute("data-id", schedule.id)`, porque permite manipulação posterior (cancelar, editar) sem buscar novamente

## How to write

### Estrutura de arquivo de renderização

```javascript
import dayjs from "dayjs"

// Seleciona containers por período
const periodMorning = document.getElementById("period-morning")
const periodAfternoon = document.getElementById("period-afternoon")
const periodNight = document.getElementById("period-night")

export function scheduleShow(dailySchedules) {
  try {
    // Limpa as listas
    periodMorning.innerHTML = ""
    periodAfternoon.innerHTML = ""
    periodNight.innerHTML = ""

    dailySchedules.forEach((schedule) => {
      // Cria elementos
      const item = document.createElement("li")
      const time = document.createElement("strong")
      const name = document.createElement("span")

      // Adiciona identificador
      item.setAttribute("data-id", schedule.id)

      // Preenche conteúdo
      time.textContent = dayjs(schedule.when).format("HH:mm")
      name.textContent = schedule.name

      // Monta estrutura
      item.append(time, name)

      // Distribui por período
      const hour = dayjs(schedule.when).hour()

      if (hour <= 12) {
        periodMorning.appendChild(item)
      } else if (hour <= 18) {
        periodAfternoon.appendChild(item)
      } else {
        periodNight.appendChild(item)
      }
    })
  } catch (error) {
    console.log(error)
    alert("Não foi possível exibir os agendamentos")
  }
}
```

### Chamada no arquivo de carregamento

```javascript
import { scheduleShow } from "../schedules/show.js"

// Após buscar da API
const dailySchedules = await fetchSchedules(date)
scheduleShow(dailySchedules)
```

## Example

**Before (tudo misturado no load):**
```javascript
async function loadSchedules() {
  const response = await fetch("/api/schedules")
  const data = await response.json()
  const list = document.getElementById("list")
  list.innerHTML = data.map(d =>
    `<li><strong>${d.time}</strong><span>${d.name}</span></li>`
  ).join("")
}
```

**After (separado e seguro):**
```javascript
// load.js
import { scheduleShow } from "./show.js"

async function loadSchedules() {
  const response = await fetch("/api/schedules")
  const dailySchedules = await response.json()
  scheduleShow(dailySchedules)
}

// show.js
export function scheduleShow(dailySchedules) {
  try {
    periodMorning.innerHTML = ""
    // ... createElement pattern per item
  } catch (error) {
    alert("Não foi possível exibir os agendamentos")
  }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Lista vem de API e pode mudar | Sempre limpe innerHTML antes de popular |
| Item precisa de ação futura (cancelar, editar) | Adicione `data-id` via setAttribute |
| Horário precisa de formatação | Use dayjs com `.format("HH:mm")` |
| Itens pertencem a categorias visuais | Extraia critério (hora) e use if/else para distribuir |
| Ícone de ação dentro do item | createElement("img") + setAttribute("src") + classList.add |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `innerHTML += "<li>..."` em loop | `createElement("li")` + `appendChild` |
| Fetch + render no mesmo arquivo | Arquivo separado para cada responsabilidade |
| Render sem try/catch | Sempre envolva renderização em try/catch |
| `item.id = schedule.id` | `item.setAttribute("data-id", schedule.id)` |
| Horário cru da API na tela | `dayjs(schedule.when).format("HH:mm")` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre separação load/show, estratégia de períodos e manipulação DOM
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-renderizando-os-agendamentos-do-dia/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-renderizando-os-agendamentos-do-dia/references/code-examples.md)
