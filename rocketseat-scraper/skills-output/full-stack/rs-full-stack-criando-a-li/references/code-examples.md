# Code Examples: Criando Elementos de Lista Dinamicamente

## Exemplo 1: Criacao basica do item (da aula)

```javascript
// Cria o elemento de li para adicionar o item na lista (ul)
const expenseItem = document.createElement("li")
expenseItem.classList.add("expense-item")
```

Este e o primeiro passo: criar o container `li` e adicionar a classe de estilizacao.

## Exemplo 2: HTML estatico como referencia (da aula)

```html
<!-- Exemplo da estrutura HTML de um item de despesa -->
<!--
<li class="expense-item">
  <img src="img/food.svg" alt="Alimentação">
  <div class="expense-info">
    <strong>Almoço</strong>
    <span>Alimentação</span>
  </div>
  <span class="expense-amount">
    <small>R$</small>32,00
  </span>
</li>
-->
```

Este HTML comentado serve como blueprint para o codigo JavaScript.

## Exemplo 3: Estrutura completa reproduzida em JS

```javascript
function addExpenseItem({ name, category, categoryIcon, amount }) {
  try {
    // Cria o elemento de li para adicionar o item na lista
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense-item")

    // Cria o icone da categoria
    const iconElement = document.createElement("img")
    iconElement.src = `img/${categoryIcon}.svg`
    iconElement.alt = category

    // Cria o container de informacoes
    const infoContainer = document.createElement("div")
    infoContainer.classList.add("expense-info")

    // Cria o nome da despesa
    const nameElement = document.createElement("strong")
    nameElement.textContent = name

    // Cria a categoria
    const categoryElement = document.createElement("span")
    categoryElement.textContent = category

    // Monta o container de info
    infoContainer.append(nameElement, categoryElement)

    // Cria o valor
    const amountContainer = document.createElement("span")
    amountContainer.classList.add("expense-amount")

    const currencySymbol = document.createElement("small")
    currencySymbol.textContent = "R$"

    amountContainer.append(currencySymbol)
    amountContainer.append(amount)

    // Monta o item completo
    expenseItem.append(iconElement, infoContainer, amountContainer)

    // Adiciona na lista (ul)
    const expenseList = document.querySelector("ul")
    expenseList.append(expenseItem)
  } catch (error) {
    console.error("Erro ao criar item:", error)
  }
}
```

## Exemplo 4: Variacao — Lista de tarefas (todo list)

O mesmo padrao aplicado a um contexto diferente:

```javascript
function addTodoItem(text) {
  try {
    const todoItem = document.createElement("li")
    todoItem.classList.add("todo-item")

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.classList.add("todo-checkbox")

    const label = document.createElement("span")
    label.classList.add("todo-text")
    label.textContent = text

    const deleteButton = document.createElement("button")
    deleteButton.classList.add("todo-delete")
    deleteButton.textContent = "×"

    todoItem.append(checkbox, label, deleteButton)

    document.querySelector(".todo-list").append(todoItem)
  } catch (error) {
    console.error("Erro ao criar todo:", error)
  }
}
```

## Exemplo 5: Variacao — Usando template com cloneNode

Alternativa quando a estrutura e muito complexa:

```javascript
// Cria um template uma vez
const template = document.createElement("template")
template.innerHTML = `
  <li class="expense-item">
    <img src="" alt="">
    <div class="expense-info">
      <strong></strong>
      <span></span>
    </div>
    <span class="expense-amount">
      <small>R$</small>
    </span>
  </li>
`

function addExpenseFromTemplate({ name, category, icon, amount }) {
  const clone = template.content.cloneNode(true)

  clone.querySelector("img").src = `img/${icon}.svg`
  clone.querySelector("img").alt = category
  clone.querySelector("strong").textContent = name
  clone.querySelector(".expense-info span").textContent = category
  clone.querySelector(".expense-amount").append(amount)

  document.querySelector("ul").append(clone)
}
```

## Exemplo 6: append vs appendChild

```javascript
// appendChild: aceita apenas UM node
expenseItem.appendChild(iconElement)
expenseItem.appendChild(infoContainer)
expenseItem.appendChild(amountContainer)

// append: aceita MULTIPLOS nodes e strings
expenseItem.append(iconElement, infoContainer, amountContainer)

// Prefira append — mais conciso e flexivel
```