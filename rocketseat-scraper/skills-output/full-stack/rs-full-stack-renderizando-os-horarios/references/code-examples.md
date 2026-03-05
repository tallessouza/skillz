# Code Examples: Renderizando Listas com Estado Condicional

## Exemplo original da aula

```javascript
// Remover console.log de debug anterior

// Selecionar a lista de horários pelo id
const hours = document.getElementById("hours")

// Renderizar cada horário na lista
opening.forEach(({ hour, available }) => {
  // Criar o elemento li
  const li = document.createElement("li")

  // Adicionar classe base
  li.classList.add("hour")

  // Adicionar classe condicional baseada na disponibilidade
  li.classList.add(available ? "hour-available" : "hour-unavailable")

  // Definir o texto do horário
  li.textContent = hour

  // Adicionar à lista
  hours.append(li)
})
```

### HTML de referência (estrutura esperada)

```html
<ul id="hours">
  <!-- Gerado pelo JavaScript -->
  <li class="hour hour-unavailable">08:00</li>
  <li class="hour hour-unavailable">09:00</li>
  <li class="hour hour-available">10:00</li>
  <li class="hour hour-available">11:00</li>
  <!-- ... -->
</ul>
```

## Variação: com DocumentFragment para listas grandes

```javascript
const hours = document.getElementById("hours")
const fragment = document.createDocumentFragment()

opening.forEach(({ hour, available }) => {
  const li = document.createElement("li")
  li.classList.add("hour")
  li.classList.add(available ? "hour-available" : "hour-unavailable")
  li.textContent = hour
  fragment.append(li)
})

// Um único reflow/repaint
hours.append(fragment)
```

## Variação: com três estados (disponível, indisponível, selecionado)

```javascript
const statusClassMap = {
  available: "hour-available",
  unavailable: "hour-unavailable",
  selected: "hour-selected",
}

opening.forEach(({ hour, status }) => {
  const li = document.createElement("li")
  li.classList.add("hour")
  li.classList.add(statusClassMap[status])
  li.textContent = hour
  hours.append(li)
})
```

## Variação: adicionando evento de clique nos disponíveis

```javascript
opening.forEach(({ hour, available }) => {
  const li = document.createElement("li")
  li.classList.add("hour")
  li.classList.add(available ? "hour-available" : "hour-unavailable")
  li.textContent = hour

  if (available) {
    li.addEventListener("click", () => {
      selectHour(hour)
    })
  }

  hours.append(li)
})
```

## Variação: separando manhã e tarde

```javascript
const morningList = document.getElementById("morning-hours")
const afternoonList = document.getElementById("afternoon-hours")

opening.forEach(({ hour, available }) => {
  const li = document.createElement("li")
  li.classList.add("hour")
  li.classList.add(available ? "hour-available" : "hour-unavailable")
  li.textContent = hour

  const hourNumber = parseInt(hour.split(":")[0])
  const targetList = hourNumber < 12 ? morningList : afternoonList
  targetList.append(li)
})
```

## Anti-pattern: innerHTML com template string

```javascript
// ERRADO — vulnerável a XSS se hour vier de input do usuário
opening.forEach(({ hour, available }) => {
  hours.innerHTML += `
    <li class="hour ${available ? "hour-available" : "hour-unavailable"}">
      ${hour}
    </li>
  `
})
```

Problemas:
1. `innerHTML +=` re-parseia TODO o HTML existente a cada iteração
2. Vulnerável a XSS se `hour` contiver HTML malicioso
3. Destrói event listeners dos elementos já existentes
4. Performance O(n²) — cada iteração processa todo o conteúdo anterior