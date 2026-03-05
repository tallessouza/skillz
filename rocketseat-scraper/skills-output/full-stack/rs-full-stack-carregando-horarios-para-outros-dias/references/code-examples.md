# Code Examples: Recarregar Dados ao Mudar Input

## Exemplo 1: Estrutura de arquivos do projeto

```
src/
├── main.js                    # Entry point — importa todos os modulos
├── form/
│   └── date.change.js         # Handler para mudanca de data
└── schedules/
    └── load.js                # Funcao que carrega horarios (schedulesDay)
```

## Exemplo 2: date.change.js completo

```javascript
// form/date.change.js
const selectedDate = document.getElementById("date")

import { schedulesDay } from "../schedules/load.js"

selectedDate.onchange = () => {
  schedulesDay()
}
```

## Exemplo 3: hours-load.js com limpeza

```javascript
// schedules/load.js
const hoursList = document.getElementById("hours")

export async function schedulesDay() {
  // Limpa a lista de horarios antes de recriar
  hoursList.innerHTML = ""

  const selectedDate = document.getElementById("date").value

  const response = await fetch(`/api/schedules?date=${selectedDate}`)
  const hours = await response.json()

  hours.forEach((hour) => {
    const li = document.createElement("li")
    li.textContent = hour.time
    if (!hour.available) {
      li.classList.add("unavailable")
    }
    hoursList.appendChild(li)
  })
}
```

## Exemplo 4: main.js com imports organizados

```javascript
// main.js

// Form handlers
import "./form/date.change.js"

// Page load
import { schedulesDay } from "./schedules/load.js"

// Carrega horarios na inicializacao
schedulesDay()
```

## Exemplo 5: Variacao — mesmo padrao para outro input

```javascript
// form/professional.change.js — mesmo padrao aplicado a outro campo
const selectedProfessional = document.getElementById("professional")

import { schedulesDay } from "../schedules/load.js"

selectedProfessional.onchange = () => {
  schedulesDay() // reutiliza a mesma funcao
}
```

## Exemplo 6: Variacao — com loading state

```javascript
// schedules/load.js — versao com feedback visual
const hoursList = document.getElementById("hours")

export async function schedulesDay() {
  hoursList.innerHTML = "<li class='loading'>Carregando...</li>"

  try {
    const selectedDate = document.getElementById("date").value
    const response = await fetch(`/api/schedules?date=${selectedDate}`)
    const hours = await response.json()

    hoursList.innerHTML = "" // Limpa o loading

    hours.forEach((hour) => {
      const li = document.createElement("li")
      li.textContent = hour.time
      hoursList.appendChild(li)
    })
  } catch (error) {
    hoursList.innerHTML = "<li class='error'>Erro ao carregar horarios</li>"
  }
}
```

## Exemplo 7: O bug sem limpeza (para referencia)

```javascript
// BUG: sem innerHTML = ""
export async function schedulesDay() {
  // Nao limpa! Cada chamada ACUMULA itens
  const hours = await fetchHours()
  hours.forEach((hour) => {
    hoursList.appendChild(createItem(hour))
  })
}

// Resultado ao mudar data 3 vezes:
// Lista mostra: [horarios dia 1] + [horarios dia 2] + [horarios dia 3]
// Quando deveria mostrar apenas: [horarios dia 3]
```