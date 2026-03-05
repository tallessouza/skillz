# Code Examples: Captura de Formulario e Inicializacao de Data

## Exemplo 1: Estrutura completa do submit.js

Codigo final da aula:

```javascript
// src/modules/form/submit.js
import dayjs from "dayjs"

const form = document.querySelector("form")

form.onsubmit = (event) => {
  // Previne comportamento padrao de carregar a pagina
  event.preventDefault()

  console.log("enviado")
}

const selectedDate = document.getElementById("date")

// Data atual para formatar o input
const inputToday = dayjs(new Date()).format("YYYY-MM-DD")

// Carrega a data atual e define a data minima como sendo a data atual
selectedDate.value = inputToday
selectedDate.min = inputToday
```

## Exemplo 2: main.js com imports organizados

```javascript
// src/main.js
import "./style/global.css"

// JS
import "./modules/form/submit.js"
```

## Exemplo 3: HTML do input de data (referencia)

```html
<input type="date" id="date" />
```

O `id="date"` e o que o `document.getElementById("date")` busca no JS.

## Variacao: Sem dayjs (vanilla JS)

Se nao quiser usar dayjs, o equivalente vanilla:

```javascript
const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, "0")
const day = String(today.getDate()).padStart(2, "0")
const inputToday = `${year}-${month}-${day}`

selectedDate.value = inputToday
selectedDate.min = inputToday
```

Dayjs simplifica significativamente essa formatacao.

## Variacao: addEventListener em vez de onsubmit

```javascript
const form = document.querySelector("form")

form.addEventListener("submit", (event) => {
  event.preventDefault()
  // logica de captura
})
```

Ambas abordagens funcionam. `addEventListener` permite multiplos handlers; `onsubmit` e mais direto para um unico handler.

## Variacao: Definindo data maxima tambem

```javascript
const inputToday = dayjs(new Date()).format("YYYY-MM-DD")
const inputMaxDate = dayjs(new Date()).add(30, "day").format("YYYY-MM-DD")

selectedDate.value = inputToday
selectedDate.min = inputToday
selectedDate.max = inputMaxDate // Limita agendamento a 30 dias no futuro
```

## Evolucao: Capturando dados do formulario

O proximo passo natural (proximas aulas) seria capturar os valores:

```javascript
form.onsubmit = (event) => {
  event.preventDefault()

  const name = document.getElementById("name").value
  const date = document.getElementById("date").value
  const hour = document.getElementById("hour").value

  // Enviar para API
  fetch("/api/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, date, hour }),
  })
}
```