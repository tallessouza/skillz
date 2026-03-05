# Code Examples: Separando Horarios por Periodo

## Exemplo completo da aula

```javascript
function hoursLoad() {
  const hoursList = document.getElementById("hours")

  function hourHeaderAdd(title) {
    const header = document.createElement("li")
    header.classList.add("hour-period")
    header.textContent = title
    hoursList.append(header)
  }

  const currentHour = new Date().getHours()

  availableHours.forEach(({ hour }) => {
    // Adiciona cabecalho do periodo antes do primeiro item
    if (hour === 9) {
      hourHeaderAdd("Manhã")
    } else if (hour === 13) {
      hourHeaderAdd("Tarde")
    } else if (hour === 18) {
      hourHeaderAdd("Noite")
    }

    // Cria o item do horario
    const li = document.createElement("li")
    li.textContent = `${hour}:00`

    // Marca como indisponivel se o horario ja passou
    if (hour <= currentHour) {
      li.classList.add("unavailable")
    }

    hoursList.append(li)
  })
}
```

## CSS referenciado na aula

```css
/* Classe para horarios indisponiveis */
.unavailable {
  cursor: not-allowed;
  opacity: 0.5;
}

.unavailable:hover {
  /* Desabilita efeito de hover para nao dar impressao de clicavel */
  background: none;
  transform: none;
}

/* Classe para cabecalho de periodo */
.hour-period {
  font-weight: bold;
  font-size: 0.875rem;
  color: #666;
  padding: 8px 0 4px;
  list-style: none;
}
```

## Variacao: com constantes extraidas

```javascript
const PERIOD_THRESHOLDS = [
  { hour: 9, label: "Manhã" },
  { hour: 13, label: "Tarde" },
  { hour: 18, label: "Noite" },
]

function hourHeaderAdd(title, container) {
  const header = document.createElement("li")
  header.classList.add("hour-period")
  header.textContent = title
  container.append(header)
}

availableHours.forEach(({ hour }) => {
  const period = PERIOD_THRESHOLDS.find((p) => p.hour === hour)
  if (period) {
    hourHeaderAdd(period.label, hoursList)
  }

  // ... resto do codigo
})
```

## Variacao: verificacao se periodo tem horarios

```javascript
// So adiciona cabecalho se existem horarios naquele periodo
const morningHours = availableHours.filter((h) => h.hour >= 9 && h.hour < 13)
const afternoonHours = availableHours.filter((h) => h.hour >= 13 && h.hour < 18)
const nightHours = availableHours.filter((h) => h.hour >= 18)

if (morningHours.length > 0) {
  hourHeaderAdd("Manhã")
  morningHours.forEach((h) => renderHourItem(h))
}

if (afternoonHours.length > 0) {
  hourHeaderAdd("Tarde")
  afternoonHours.forEach((h) => renderHourItem(h))
}

if (nightHours.length > 0) {
  hourHeaderAdd("Noite")
  nightHours.forEach((h) => renderHourItem(h))
}
```

## Variacao: com data attributes para interatividade futura

```javascript
const li = document.createElement("li")
li.textContent = `${hour}:00`
li.dataset.hour = hour
li.dataset.period = hour < 13 ? "morning" : hour < 18 ? "afternoon" : "night"
li.dataset.available = hour > currentHour ? "true" : "false"

if (hour <= currentHour) {
  li.classList.add("unavailable")
}
```