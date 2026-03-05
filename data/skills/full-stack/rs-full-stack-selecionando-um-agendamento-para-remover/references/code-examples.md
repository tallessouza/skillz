# Code Examples: Selecionando Elemento para Remover

## Exemplo Completo do cancel.js (como mostrado na aula)

```javascript
// schedules/cancel.js

const periods = document.querySelectorAll(".schedule-period")

periods.forEach((period) => {
  period.addEventListener("click", (event) => {
    // Verifica se clicou especificamente no icone de cancelar
    if (event.target.classList.contains("cancel-icon")) {
      // Obtem o pai do elemento clicado (o <li>)
      const item = event.target.closest("li")
      const { id } = item.dataset

      if (id) {
        const isConfirmed = confirm(
          "Tem certeza que deseja cancelar o agendamento?"
        )

        if (isConfirmed) {
          console.log("Remover", id)
          // Na proxima aula: requisicao DELETE para a API
        }
      }
    }
  })
})
```

## Import no main.js

```javascript
// main.js
import "./schedules/cancel.js"
```

## Variacao: Com funcao de callback para remocao

```javascript
export function setupCancelListeners(onCancel) {
  const periods = document.querySelectorAll(".schedule-period")

  periods.forEach((period) => {
    period.addEventListener("click", (event) => {
      if (!event.target.classList.contains("cancel-icon")) return

      const item = event.target.closest("li")
      const { id } = item.dataset

      if (!id) return

      const isConfirmed = confirm(
        "Tem certeza que deseja cancelar o agendamento?"
      )

      if (isConfirmed) {
        onCancel(id)
      }
    })
  })
}
```

## Variacao: Com async/await para API

```javascript
periods.forEach((period) => {
  period.addEventListener("click", async (event) => {
    if (!event.target.classList.contains("cancel-icon")) return

    const item = event.target.closest("li")
    const { id } = item.dataset

    if (!id) return

    const isConfirmed = confirm("Tem certeza que deseja cancelar o agendamento?")

    if (isConfirmed) {
      try {
        await fetch(`/api/schedules/${id}`, { method: "DELETE" })
        item.remove() // Remove do DOM apos sucesso
      } catch (error) {
        alert("Erro ao cancelar agendamento.")
      }
    }
  })
})
```

## Estrutura HTML de referencia

```html
<section class="schedules">
  <!-- Periodo: Manha -->
  <ul class="schedule-period">
    <li data-id="1">
      <div class="schedule-info">
        <span class="time">09:00</span>
        <span class="name">João Silva</span>
      </div>
      <img class="cancel-icon" src="./assets/cancel.svg" alt="Cancelar" />
    </li>
    <li data-id="2">
      <div class="schedule-info">
        <span class="time">10:30</span>
        <span class="name">Maria Santos</span>
      </div>
      <img class="cancel-icon" src="./assets/cancel.svg" alt="Cancelar" />
    </li>
  </ul>

  <!-- Periodo: Tarde -->
  <ul class="schedule-period">
    <li data-id="3">
      <div class="schedule-info">
        <span class="time">14:00</span>
        <span class="name">Pedro Costa</span>
      </div>
      <img class="cancel-icon" src="./assets/cancel.svg" alt="Cancelar" />
    </li>
  </ul>

  <!-- Periodo: Noite -->
  <ul class="schedule-period">
    <li data-id="4">
      <div class="schedule-info">
        <span class="time">19:00</span>
        <span class="name">Ana Lima</span>
      </div>
      <img class="cancel-icon" src="./assets/cancel.svg" alt="Cancelar" />
    </li>
  </ul>
</section>
```

## Debug progressivo (como o instrutor fez)

O instrutor usa uma abordagem incremental de debug, adicionando `console.log` em cada etapa:

```javascript
// Etapa 1: Verificar se os periodos foram selecionados
console.log(periods) // NodeList(3) [ul, ul, ul]

// Etapa 2: Verificar se o clique e detectado
period.addEventListener("click", () => {
  console.log("clicou") // Qualquer clique dentro da lista
})

// Etapa 3: Verificar o alvo do clique
console.log(event.target.classList.contains("cancel-icon")) // true/false

// Etapa 4: Verificar o item pai
console.log(event.target.closest("li")) // <li data-id="1">...</li>

// Etapa 5: Verificar o ID extraido
console.log(id) // "1"
```

Essa abordagem incremental e excelente para ensino e debug — confirma cada passo antes de avancar.