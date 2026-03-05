# Code Examples: Criando Icones Dinamicos por Categoria

## Codigo Completo da Aula

### Selecao de elementos (topo do script)

```javascript
// Seleciona os elementos do formulario
const form = document.querySelector("form")
const expenseAmount = document.getElementById("amount")
const expenseCategory = document.getElementById("category")

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
```

### Funcao de adicionar despesa (trecho relevante)

```javascript
function expenseAdd(newExpense) {
  try {
    // Cria o item da lista
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o icone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Adiciona as informacoes no item
    expenseItem.append(expenseIcon)

    // Adiciona o item na lista
    expenseList.append(expenseItem)
  } catch (error) {
    console.error("Erro ao adicionar despesa:", error)
    alert("Nao foi possivel adicionar a despesa.")
  }
}
```

### Objeto newExpense (contexto — criado na aula anterior)

```javascript
const newExpense = {
  id: new Date().getTime(),
  expense: expenseName.value,
  category_id: expenseCategory.value,     // ex: "food"
  category_name: expenseCategory.options[expenseCategory.selectedIndex].text, // ex: "Alimentação"
  amount: expenseAmount.value,
}
```

## Variacoes

### Com imagens PNG ao inves de SVG

```javascript
expenseIcon.setAttribute("src", `img/${newExpense.category_id}.png`)
```

### Com subpasta por tipo de asset

```javascript
expenseIcon.setAttribute("src", `img/icons/categories/${newExpense.category_id}.svg`)
```

### Adicionando classe CSS ao icone

```javascript
const expenseIcon = document.createElement("img")
expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
expenseIcon.setAttribute("alt", newExpense.category_name)
expenseIcon.classList.add("expense-icon")
```

### Com fallback para icone padrao (caso o arquivo nao exista)

```javascript
const expenseIcon = document.createElement("img")
expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
expenseIcon.setAttribute("alt", newExpense.category_name)
expenseIcon.addEventListener("error", () => {
  expenseIcon.setAttribute("src", "img/others.svg")
})
```

### Multiplos elementos no mesmo item (preview de aulas futuras)

```javascript
// Cria o item
const expenseItem = document.createElement("li")

// Cria icone
const expenseIcon = document.createElement("img")
expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
expenseIcon.setAttribute("alt", newExpense.category_name)

// Cria nome (futuro)
const expenseName = document.createElement("span")
expenseName.textContent = newExpense.expense

// Adiciona tudo no item, depois item na lista
expenseItem.append(expenseIcon, expenseName)
expenseList.append(expenseItem)
```