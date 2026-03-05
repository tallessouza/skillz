# Code Examples: Criando Icone de Remover

## Exemplo original da aula

Contexto: dentro de uma funcao que cria itens de lista de despesas.

```javascript
// Cria o icone de remover
const removeIcon = document.createElement("img")
removeIcon.classList.add("remove-icon")
removeIcon.setAttribute("src", "img/remove.svg")
removeIcon.setAttribute("alt", "Remover")

// Adiciona as informacoes no item
item.append(amount, description, removeIcon)
```

## Contexto completo — criacao de item com icone

```javascript
function addItem(category, description, amount) {
  const item = document.createElement("li")
  item.classList.add("expense-item")

  // Cria o valor
  const amountElement = document.createElement("span")
  amountElement.classList.add("expense-amount")
  amountElement.textContent = `R$ ${amount}`

  // Cria a descricao
  const descriptionElement = document.createElement("span")
  descriptionElement.classList.add("expense-description")
  descriptionElement.textContent = description

  // Cria o icone de remover
  const removeIcon = document.createElement("img")
  removeIcon.classList.add("remove-icon")
  removeIcon.setAttribute("src", "img/remove.svg")
  removeIcon.setAttribute("alt", "Remover")

  // Adiciona tudo ao item
  item.append(amountElement, descriptionElement, removeIcon)

  // Adiciona item a lista
  document.querySelector(".expense-list").append(item)
}
```

## Variacao: icone com evento de click (proximo passo)

```javascript
const removeIcon = document.createElement("img")
removeIcon.classList.add("remove-icon")
removeIcon.setAttribute("src", "img/remove.svg")
removeIcon.setAttribute("alt", "Remover")

// Evento sera adicionado em aula futura
removeIcon.addEventListener("click", () => {
  item.remove()
})
```

## Variacao: icone usando button ao inves de img

Se o design pedir um botao clicavel ao inves de imagem pura:

```javascript
const removeButton = document.createElement("button")
removeButton.classList.add("remove-button")
removeButton.setAttribute("type", "button")
removeButton.setAttribute("aria-label", "Remover item")

const removeIcon = document.createElement("img")
removeIcon.setAttribute("src", "img/remove.svg")
removeIcon.setAttribute("alt", "")  // alt vazio porque button ja tem aria-label

removeButton.append(removeIcon)
item.append(removeButton)
```

## Variacao: multiplos icones de acao

```javascript
// Cria icone de editar
const editIcon = document.createElement("img")
editIcon.classList.add("action-icon", "edit-icon")
editIcon.setAttribute("src", "img/edit.svg")
editIcon.setAttribute("alt", "Editar")

// Cria icone de remover
const removeIcon = document.createElement("img")
removeIcon.classList.add("action-icon", "remove-icon")
removeIcon.setAttribute("src", "img/remove.svg")
removeIcon.setAttribute("alt", "Remover")

// Container de acoes
const actions = document.createElement("div")
actions.classList.add("item-actions")
actions.append(editIcon, removeIcon)

item.append(amount, description, actions)
```

## HTML equivalente (referencia)

O codigo JavaScript acima produz este HTML:

```html
<li class="expense-item">
  <span class="expense-amount">R$ 56.78</span>
  <span class="expense-description">Jantar</span>
  <img class="remove-icon" src="img/remove.svg" alt="Remover">
</li>
```