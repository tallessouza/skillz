# Code Examples: Hair Day Project Patterns

## 1. Webpack Configuration (fundamento de bundling)

```javascript
// webpack.config.js — o que frameworks geram automaticamente
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(png|svg)$/, type: "asset/resource" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
  ],
  devServer: {
    port: 3000,
    hot: true,
  },
}
```

## 2. Modulos JS (separacao de responsabilidades)

```javascript
// src/modules/schedules.js
export async function fetchSchedulesByDate(date) {
  const response = await fetch(`/api/schedules?date=${date}`)
  return response.json()
}

export async function createSchedule({ name, time, date }) {
  const response = await fetch("/api/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, time, date }),
  })
  return response.json()
}

export async function cancelSchedule(id) {
  await fetch(`/api/schedules/${id}`, { method: "DELETE" })
}
```

```javascript
// src/modules/slots.js
const BUSINESS_HOURS = {
  open: 8,
  close: 21,
  intervalMinutes: 30,
}

export function generateAllSlots() {
  const slots = []
  for (let hour = BUSINESS_HOURS.open; hour < BUSINESS_HOURS.close; hour++) {
    slots.push(`${String(hour).padStart(2, "0")}:00`)
    if (BUSINESS_HOURS.intervalMinutes === 30) {
      slots.push(`${String(hour).padStart(2, "0")}:30`)
    }
  }
  return slots
}

export function getAvailableSlots(allSlots, bookedTimes) {
  return allSlots.filter(slot => !bookedTimes.includes(slot))
}
```

## 3. Agrupamento por sessao

```javascript
// src/modules/sessions.js
const SESSIONS = {
  morning: { label: "Manhã", start: 8, end: 12 },
  afternoon: { label: "Tarde", start: 12, end: 18 },
  evening: { label: "Noite", start: 18, end: 21 },
}

export function groupBySession(schedules) {
  const grouped = {}

  for (const [key, session] of Object.entries(SESSIONS)) {
    const items = schedules.filter(schedule => {
      const hour = parseInt(schedule.time.split(":")[0])
      return hour >= session.start && hour < session.end
    })

    if (items.length > 0) {
      grouped[session.label] = items
    }
  }

  return grouped
}
```

## 4. Renderizacao dinamica completa

```javascript
// src/modules/render.js
import { groupBySession } from "./sessions.js"

export function renderScheduleList(container, schedules, onCancel) {
  container.innerHTML = ""

  if (schedules.length === 0) {
    container.innerHTML = "<p>Nenhum agendamento para esta data.</p>"
    return
  }

  const grouped = groupBySession(schedules)

  for (const [sessionName, items] of Object.entries(grouped)) {
    const section = document.createElement("div")
    section.className = "session-section"

    const header = document.createElement("h3")
    header.textContent = sessionName
    section.appendChild(header)

    for (const schedule of items) {
      const card = document.createElement("div")
      card.className = "schedule-card"
      card.innerHTML = `
        <span class="time">${schedule.time}</span>
        <span class="name">${schedule.name}</span>
        <button data-id="${schedule.id}" class="cancel-btn">Cancelar</button>
      `
      card.querySelector(".cancel-btn").addEventListener("click", () => {
        if (confirm("Confirmar cancelamento?")) {
          onCancel(schedule.id)
        }
      })
      section.appendChild(card)
    }

    container.appendChild(section)
  }
}

export function renderSlotOptions(selectElement, availableSlots) {
  selectElement.innerHTML = '<option value="">Selecione um horário</option>'

  for (const slot of availableSlots) {
    const option = document.createElement("option")
    option.value = slot
    option.textContent = slot
    selectElement.appendChild(option)
  }
}
```

## 5. Orquestracao principal (index.js)

```javascript
// src/index.js
import { fetchSchedulesByDate, createSchedule, cancelSchedule } from "./modules/schedules.js"
import { generateAllSlots, getAvailableSlots } from "./modules/slots.js"
import { renderScheduleList, renderSlotOptions } from "./modules/render.js"
import "./styles/main.css"

const allSlots = generateAllSlots()
let currentDate = new Date().toISOString().split("T")[0]

const dateInput = document.getElementById("date-input")
const scheduleContainer = document.getElementById("schedules")
const slotSelect = document.getElementById("slot-select")
const nameInput = document.getElementById("name-input")
const bookButton = document.getElementById("book-btn")

async function loadSchedules(date) {
  const schedules = await fetchSchedulesByDate(date)
  const bookedTimes = schedules.map(s => s.time)
  const available = getAvailableSlots(allSlots, bookedTimes)

  renderScheduleList(scheduleContainer, schedules, handleCancel)
  renderSlotOptions(slotSelect, available)
}

async function handleBook() {
  const name = nameInput.value.trim()
  const time = slotSelect.value

  if (!name || !time) return alert("Preencha todos os campos")

  await createSchedule({ name, time, date: currentDate })
  alert("Agendamento realizado!")
  nameInput.value = ""
  await loadSchedules(currentDate)
}

async function handleCancel(id) {
  await cancelSchedule(id)
  alert("Cancelamento realizado!")
  await loadSchedules(currentDate)
}

dateInput.addEventListener("change", (event) => {
  currentDate = event.target.value
  loadSchedules(currentDate)
})

bookButton.addEventListener("click", handleBook)

// Initial load
loadSchedules(currentDate)
```

## 6. Comparacao: Vanilla vs React (mesmo componente)

```javascript
// Vanilla JS — renderizacao manual
function renderScheduleCard(schedule, onCancel) {
  const card = document.createElement("div")
  card.innerHTML = `<span>${schedule.time}</span> <span>${schedule.name}</span>`
  const btn = document.createElement("button")
  btn.textContent = "Cancelar"
  btn.onclick = () => onCancel(schedule.id)
  card.appendChild(btn)
  return card
}
```

```jsx
// React — mesmo componente, reativo
function ScheduleCard({ schedule, onCancel }) {
  return (
    <div>
      <span>{schedule.time}</span>
      <span>{schedule.name}</span>
      <button onClick={() => onCancel(schedule.id)}>Cancelar</button>
    </div>
  )
}
```

A diferenca: no React, quando o estado muda, o componente re-renderiza automaticamente. No vanilla, voce precisa chamar `loadSchedules()` manualmente apos cada mutacao.