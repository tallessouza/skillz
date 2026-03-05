# Code Examples: Evento de Carregamento do Conteudo

## Estrutura de arquivos do projeto

```
src/
├── main.js              # Ponto de entrada, importa modulos
├── modules/
│   ├── submit.js        # Logica do formulario de agendamento
│   └── load.js          # Evento DOMContentLoaded, renderiza conteudo
```

## main.js — importando modulos

```javascript
import "./modules/submit.js"
import "./modules/load.js"
```

## load.js — versao basica (como no inicio da aula)

```javascript
// Verificando que o evento funciona
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM esta pronto")
})
```

## load.js — versao com renderizacao de horarios

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const now = new Date()
  const currentHour = now.getHours()
  const selectedDate = document.querySelector("#date").value

  const isToday = selectedDate === now.toISOString().split("T")[0]

  // Array de horarios do salao (definido previamente)
  const openingHours = [7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20]

  const periods = {
    morning: { label: "Manhã", hours: openingHours.filter((h) => h < 12) },
    afternoon: {
      label: "Tarde",
      hours: openingHours.filter((h) => h >= 12 && h < 18),
    },
    night: { label: "Noite", hours: openingHours.filter((h) => h >= 18) },
  }

  Object.entries(periods).forEach(([period, { label, hours }]) => {
    const section = document.querySelector(`[data-period="${period}"]`)
    if (!section) return

    const ul = section.querySelector("ul")
    ul.innerHTML = "" // limpa conteudo estatico

    hours.forEach((hour) => {
      // Filtra horarios passados se for hoje
      if (isToday && hour <= currentHour) return

      const li = document.createElement("li")
      li.classList.add("hour")

      const button = document.createElement("button")
      button.type = "button"
      button.textContent = `${String(hour).padStart(2, "0")}:00`

      li.appendChild(button)
      ul.appendChild(li)
    })
  })
})
```

## HTML comentado — como o instrutor deixou

```html
<div data-period="morning">
  <header>Manhã</header>
  <ul>
    <!-- Exemplo de estrutura (carregado via JS):
    <li class="hour">
      <button type="button">09:00</button>
    </li>
    -->
  </ul>
</div>

<div data-period="afternoon">
  <header>Tarde</header>
  <ul>
    <!-- Exemplo de estrutura (carregado via JS):
    <li class="hour">
      <button type="button">13:00</button>
    </li>
    -->
  </ul>
</div>

<div data-period="night">
  <header>Noite</header>
  <ul>
    <!-- Exemplo de estrutura (carregado via JS):
    <li class="hour">
      <button type="button">18:00</button>
    </li>
    -->
  </ul>
</div>
```

## Erro classico: grafia errada do evento

```javascript
// ERRADO — falha silenciosa, nenhum erro no console
document.addEventListener("DOMContentLoad", () => {
  console.log("Isso NUNCA vai executar")
})

// CORRETO — note o "ed" no final
document.addEventListener("DOMContentLoaded", () => {
  console.log("Isso executa quando o DOM esta pronto")
})
```

## Variacao: filtrar horarios quando usuario muda a data

```javascript
// Reutilizar a logica de renderizacao quando a data muda
const dateInput = document.querySelector("#date")

dateInput.addEventListener("change", () => {
  renderAvailableHours(dateInput.value)
})

function renderAvailableHours(selectedDate) {
  const now = new Date()
  const isToday = selectedDate === now.toISOString().split("T")[0]
  const currentHour = isToday ? now.getHours() : -1

  openingHours.forEach((hour) => {
    if (hour <= currentHour) return
    // ... renderizar
  })
}
```