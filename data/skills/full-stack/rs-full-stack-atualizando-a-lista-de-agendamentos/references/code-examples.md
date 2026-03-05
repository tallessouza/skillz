# Code Examples: Atualizando a Lista Apos Mutacoes

## Exemplo 1: Estrutura do modulo centralizado (do transcript)

```javascript
// schedules/load.js — funcao centralizada
export async function scheduleDay() {
  // 1. Pega a data do input
  const date = document.getElementById("date").value

  // 2. Busca agendamentos na API baseado na data
  const schedules = await fetchSchedulesByDate(date)

  // 3. Exibe os agendamentos
  renderSchedules(schedules)

  // 4. Renderiza horarios disponiveis
  renderAvailableHours(schedules)
}
```

## Exemplo 2: Uso no onChange de data

```javascript
// Quando usuario muda a data, recarrega tudo
dateInput.addEventListener("change", async () => {
  await scheduleDay()
})
```

## Exemplo 3: Uso no submit do formulario (do transcript)

```javascript
import { scheduleDay } from "./schedules/load.js"

form.onsubmit = async (e) => {
  e.preventDefault()

  const name = clientName.value
  const date = dateInput.value
  const hour = selectedHour

  // Faz o agendamento
  await apiPost("/schedules", { name, date, hour })

  alert("Agendamento realizado com sucesso!")

  // Recarrega os agendamentos (mostra o novo + atualiza horarios)
  await scheduleDay()

  // Limpa o input de nome do cliente
  clientName.value = ""
}
```

## Exemplo 4: Variacao com fetch real

```javascript
// schedules/api.js
export async function fetchSchedulesByDate(date) {
  const response = await fetch(`/api/schedules?date=${date}`)
  return response.json()
}

// schedules/render.js
export function renderSchedules(schedules) {
  const list = document.getElementById("schedules-list")
  list.innerHTML = schedules
    .map(s => `<li>${s.hour} - ${s.name}</li>`)
    .join("")
}

// schedules/hours.js
export function renderAvailableHours(schedules) {
  const allHours = ["08:00", "09:00", "10:00", "11:00", "12:00",
                    "13:00", "14:00", "15:00", "16:00", "17:00"]
  const bookedHours = schedules.map(s => s.hour)

  const hoursContainer = document.getElementById("hours")
  hoursContainer.innerHTML = allHours
    .map(hour => {
      const isBooked = bookedHours.includes(hour)
      return `<button ${isBooked ? "disabled" : ""} 
                class="${isBooked ? "booked" : "available"}">
                ${hour}
              </button>`
    })
    .join("")
}

// schedules/load.js — orquestra tudo
import { fetchSchedulesByDate } from "./api.js"
import { renderSchedules } from "./render.js"
import { renderAvailableHours } from "./hours.js"

export async function scheduleDay() {
  const date = document.getElementById("date").value
  const schedules = await fetchSchedulesByDate(date)
  renderSchedules(schedules)
  renderAvailableHours(schedules)
}
```

## Exemplo 5: Variacao com limpeza completa do form

```javascript
// Se preferir resetar tudo (incluindo data para hoje)
form.onsubmit = async (e) => {
  e.preventDefault()

  await apiPost("/schedules", { name, date, hour })
  alert("Agendamento realizado!")

  // Volta data para hoje
  dateInput.valueAsDate = new Date()

  // Recarrega com data de hoje
  await scheduleDay()

  // Limpa nome
  clientName.value = ""

  // Remove selecao de horario
  document.querySelectorAll(".hour-btn.selected")
    .forEach(btn => btn.classList.remove("selected"))
}
```

## Exemplo 6: O mesmo padrao em contexto diferente (todo list)

```javascript
// O padrao e identico: centralizar load, chamar apos mutacao
async function loadTodos() {
  const todos = await fetch("/api/todos").then(r => r.json())
  renderTodoList(todos)
  updateCounter(todos)
}

// No submit
todoForm.onsubmit = async (e) => {
  e.preventDefault()
  await fetch("/api/todos", {
    method: "POST",
    body: JSON.stringify({ text: todoInput.value })
  })
  await loadTodos()     // recarrega lista
  todoInput.value = ""  // limpa input
}

// No delete
async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: "DELETE" })
  await loadTodos()  // mesma funcao centralizada
}
```