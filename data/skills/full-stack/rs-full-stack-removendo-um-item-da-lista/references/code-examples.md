# Code Examples: Removendo um Item da Lista

## Exemplo 1: Codigo da aula (base)

```javascript
// Dentro do listener do icone de remover
function handleRemoveClick(event) {
  // Obtem a li pai do elemento clicado
  const item = event.target.closest(".expense")

  // Remove o item da lista
  item.remove()

  // Atualiza os totais (quantidade e valor total)
  updateTotals()
}
```

## Exemplo 2: Com event delegation no container

```javascript
const expenseList = document.querySelector(".expense-list")

expenseList.addEventListener("click", (event) => {
  // Verifica se o clique foi no icone de remover
  const removeIcon = event.target.closest(".remove-icon")
  if (!removeIcon) return

  // Encontra o item pai
  const item = event.target.closest(".expense")
  if (!item) return

  // Remove e atualiza
  item.remove()
  updateTotals()
})
```

## Exemplo 3: Com confirmacao antes de remover

```javascript
expenseList.addEventListener("click", (event) => {
  if (!event.target.closest(".remove-icon")) return

  const item = event.target.closest(".expense")
  if (!item) return

  const expenseName = item.querySelector(".expense-name").textContent

  if (confirm(`Deseja remover "${expenseName}"?`)) {
    item.remove()
    updateTotals()
  }
})
```

## Exemplo 4: Funcao updateTotals completa

```javascript
function updateTotals() {
  const items = document.querySelectorAll(".expense")

  // Atualiza quantidade de despesas
  const countElement = document.querySelector(".expense-count")
  countElement.textContent = `${items.length} despesas`

  // Atualiza valor total
  let total = 0
  items.forEach((item) => {
    const value = item.querySelector(".expense-value").textContent
    total += parseFloat(value.replace("R$", "").replace(",", ".").trim())
  })

  const totalElement = document.querySelector(".expense-total")
  totalElement.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`
}
```

## Exemplo 5: Com animacao de saida

```javascript
expenseList.addEventListener("click", (event) => {
  if (!event.target.closest(".remove-icon")) return

  const item = event.target.closest(".expense")
  if (!item) return

  // Adiciona classe de animacao
  item.classList.add("removing")

  // Espera a animacao terminar antes de remover
  item.addEventListener("animationend", () => {
    item.remove()
    updateTotals()
  })
})
```

```css
.removing {
  animation: fadeOut 0.3s ease-out forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateX(20px);
    height: 0;
    padding: 0;
    margin: 0;
  }
}
```

## Exemplo 6: Comparacao closest() vs parentElement

```javascript
// FRAGIL — depende da estrutura exata
event.target.parentElement.remove()
// Se o HTML mudar de:
//   <div class="expense"><img class="remove-icon"></div>
// Para:
//   <div class="expense"><button><img class="remove-icon"></button></div>
// O parentElement agora e <button>, nao .expense

// RESILIENTE — funciona independente do aninhamento
event.target.closest(".expense").remove()
// Sempre encontra o .expense, nao importa quantos niveis existam
```