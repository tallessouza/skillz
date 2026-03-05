# Code Examples: Renderizando Agendamentos por Período

## Exemplo completo do show.js

```javascript
import dayjs from "dayjs"

// Seleciona as sessões: manhã, tarde e noite
const periodMorning = document.getElementById("period-morning")
const periodAfternoon = document.getElementById("period-afternoon")
const periodNight = document.getElementById("period-night")

export function scheduleShow(dailySchedules) {
  try {
    // Limpa as listas
    periodMorning.innerHTML = ""
    periodAfternoon.innerHTML = ""
    periodNight.innerHTML = ""

    // Renderiza os agendamentos por período
    dailySchedules.forEach((schedule) => {
      // Cria elementos
      const item = document.createElement("li")
      const time = document.createElement("strong")
      const name = document.createElement("span")

      // Adiciona id do agendamento
      item.setAttribute("data-id", schedule.id)

      // Horário formatado
      time.textContent = dayjs(schedule.when).format("HH:mm")

      // Nome do usuário
      name.textContent = schedule.name

      // Ícone de cancelar
      const cancelIcon = document.createElement("img")
      cancelIcon.classList.add("cancel-icon")
      cancelIcon.setAttribute("src", "./src/assets/cancel.svg")
      cancelIcon.setAttribute("alt", "Cancelar")

      // Adiciona tempo, nome e ícone no item
      item.append(time, name, cancelIcon)

      // Obtém somente a hora
      const hour = dayjs(schedule.when).hour()

      // Renderiza na sessão condicional: manhã, tarde ou noite
      if (hour <= 12) {
        periodMorning.appendChild(item)
      } else if (hour > 12 && hour <= 18) {
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

## Integração no load.js

```javascript
import { scheduleDayClick } from "./day-click.js"
import { scheduleShow } from "./show.js"

async function loadSchedules(date) {
  try {
    const response = await fetch(`/api/schedules?date=${date}`)
    const dailySchedules = await response.json()

    // Repassa para renderização
    scheduleShow(dailySchedules)
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error)
  }
}
```

## Estrutura HTML correspondente

```html
<aside>
  <!-- Período da manhã -->
  <div>
    <h2>Manhã</h2>
    <ul id="period-morning">
      <!-- Itens inseridos dinamicamente -->
    </ul>
  </div>

  <!-- Período da tarde -->
  <div>
    <h2>Tarde</h2>
    <ul id="period-afternoon">
      <!-- Itens inseridos dinamicamente -->
    </ul>
  </div>

  <!-- Período da noite -->
  <div>
    <h2>Noite</h2>
    <ul id="period-night">
      <!-- Itens inseridos dinamicamente -->
    </ul>
  </div>
</aside>
```

## Item renderizado (resultado no DOM)

```html
<li data-id="abc123">
  <strong>20:00</strong>
  <span>João da Silva</span>
  <img class="cancel-icon" src="./src/assets/cancel.svg" alt="Cancelar">
</li>
```

## Variação: com contagem de itens por período

```javascript
export function scheduleShow(dailySchedules) {
  periodMorning.innerHTML = ""
  periodAfternoon.innerHTML = ""
  periodNight.innerHTML = ""

  const counts = { morning: 0, afternoon: 0, night: 0 }

  dailySchedules.forEach((schedule) => {
    const item = createScheduleItem(schedule)
    const hour = dayjs(schedule.when).hour()

    if (hour <= 12) {
      periodMorning.appendChild(item)
      counts.morning++
    } else if (hour <= 18) {
      periodAfternoon.appendChild(item)
      counts.afternoon++
    } else {
      periodNight.appendChild(item)
      counts.night++
    }
  })

  return counts
}

function createScheduleItem(schedule) {
  const item = document.createElement("li")
  const time = document.createElement("strong")
  const name = document.createElement("span")
  const cancelIcon = document.createElement("img")

  item.setAttribute("data-id", schedule.id)
  time.textContent = dayjs(schedule.when).format("HH:mm")
  name.textContent = schedule.name
  cancelIcon.classList.add("cancel-icon")
  cancelIcon.setAttribute("src", "./src/assets/cancel.svg")
  cancelIcon.setAttribute("alt", "Cancelar")

  item.append(time, name, cancelIcon)
  return item
}
```

## Variação: mensagem quando período está vazio

```javascript
function appendOrShowEmpty(container, items, emptyMessage) {
  if (items.length === 0) {
    const empty = document.createElement("li")
    empty.classList.add("empty-period")
    empty.textContent = emptyMessage
    container.appendChild(empty)
  } else {
    items.forEach((item) => container.appendChild(item))
  }
}
```