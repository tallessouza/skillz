# Code Examples: Selecao de Horario com Click

## Exemplo completo do arquivo hours.click.js

```javascript
// modules/form/hours.click.js
export function hoursClick() {
  const hours = document.querySelectorAll(".hour-available")

  hours.forEach((available) => {
    available.addEventListener("click", (selected) => {
      // Remove a classe hour-selected de todas as lis
      hours.forEach((hour) => {
        hour.classList.remove("hour-selected")
      })

      // Adiciona a classe na li clicada
      selected.target.classList.add("hour-selected")
    })
  })
}
```

## Integracao no hours.load.js

```javascript
// modules/form/hours.load.js
import { hoursClick } from "./hours.click.js"

export function hoursLoad() {
  // ... codigo que busca e renderiza horarios ...
  // ... forEach que cria os elementos <li> ...

  // Adiciona o evento de click nos horarios disponiveis
  hoursClick()
}
```

## CSS ja existente no projeto (form.css)

```css
.hour-selected {
  /* Estilo que destaca visualmente o horario selecionado */
  /* O instrutor mostra que essa classe ja existia no projeto */
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
```

## Variacao: Recuperando o horario selecionado para envio

```javascript
// Quando o usuario clica no botao de agendar
function getSelectedHour() {
  const selected = document.querySelector(".hour-selected")
  if (!selected) return null
  return selected.textContent // ex: "19:00"
}
```

## Variacao: Mesmo padrao para selecao de profissional

```javascript
// O padrao remove-all-add-one funciona para qualquer lista de selecao unica
export function professionalClick() {
  const professionals = document.querySelectorAll(".professional-available")

  professionals.forEach((prof) => {
    prof.addEventListener("click", (event) => {
      professionals.forEach((p) => {
        p.classList.remove("professional-selected")
      })
      event.target.classList.add("professional-selected")
    })
  })
}
```

## Testando no DevTools (workflow do instrutor)

```
1. Botao direito no elemento > Inspecionar
2. No painel Elements, clique duplo na area de classes do elemento
3. Digite "hour-selected" e pressione Enter
4. Observe o estilo aplicado
5. Recarregue a pagina para voltar ao estado original
```

## Variacao: Com delegacao de eventos (escala melhor)

```javascript
// Para listas muito grandes, delegacao de eventos e mais performatica
export function hoursClickDelegated() {
  const hoursList = document.querySelector("#hours-list")

  hoursList.addEventListener("click", (event) => {
    const clicked = event.target.closest(".hour-available")
    if (!clicked) return

    hoursList.querySelectorAll(".hour-available").forEach((hour) => {
      hour.classList.remove("hour-selected")
    })
    clicked.classList.add("hour-selected")
  })
}
```