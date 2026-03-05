# Code Examples: Criando Valor de Despesa

## Exemplo completo da aula

```javascript
// Cria o valor da despesa
const expenseAmount = document.createElement("span")
expenseAmount.classList.add("expense-amount")

// innerHTML com template literal
// small para R$ (estilização diferente) + valor sem o símbolo
expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
  .toUpperCase()
  .replace("R$", "")}`

// Adiciona ao item junto com outros elementos
item.append(expenseIcon, expenseInfo, expenseAmount)
```

## Estrutura HTML resultante

```html
<li class="expense-item">
  <img src="img/food.svg" alt="Ícone de alimentação" />
  <div class="expense-info">
    <strong>Jantar</strong>
    <span>Alimentação</span>
  </div>
  <span class="expense-amount">
    <small>R$</small> 67,40
  </span>
</li>
```

## CSS correspondente (referência)

```css
.expense-amount {
  font-size: 1.25rem;
  font-weight: 700;
}

.expense-amount small {
  font-size: 0.75rem;
  font-weight: 400;
}
```

## Variação: com regex case-insensitive

```javascript
// Alternativa sem precisar do toUpperCase
expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
  .replace(/r\$\s?/i, "")}`
```

## Variação: para outras moedas

```javascript
// Dólar
expenseAmount.innerHTML = `<small>$</small>${formattedValue
  .replace("$", "")}`

// Euro
expenseAmount.innerHTML = `<small>€</small>${formattedValue
  .replace("€", "")}`
```

## Variação: usando Intl.NumberFormat

```javascript
// Se o valor vier como número (não string formatada)
const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const formatted = formatter.format(amount) // "R$ 67,40"
const valueOnly = formatted.replace(/r\$\s?/i, "") // " 67,40"

expenseAmount.innerHTML = `<small>R$</small>${valueOnly}`
```

## O bug: span vs small

```javascript
// ERRADO — CSS não aplica estilização
expenseAmount.innerHTML = `<span>R$</span>${value}`
// Resultado: R$ aparece com mesmo tamanho do valor

// CORRETO — corresponde ao seletor CSS .expense-amount small
expenseAmount.innerHTML = `<small>R$</small>${value}`
// Resultado: R$ aparece menor que o valor
```

## Padrão completo de criação de item

```javascript
function createExpenseItem(newExpense) {
  const item = document.createElement("li")
  item.classList.add("expense-item")

  // Ícone (aula anterior)
  const expenseIcon = document.createElement("img")
  expenseIcon.src = `img/${newExpense.category_id}.svg`
  expenseIcon.alt = newExpense.category_name

  // Info (aula anterior)
  const expenseInfo = document.createElement("div")
  expenseInfo.classList.add("expense-info")
  expenseInfo.innerHTML = `
    <strong>${newExpense.name}</strong>
    <span>${newExpense.category_name}</span>
  `

  // Valor (esta aula)
  const expenseAmount = document.createElement("span")
  expenseAmount.classList.add("expense-amount")
  expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
    .toUpperCase()
    .replace("R$", "")}`

  // Monta o item
  item.append(expenseIcon, expenseInfo, expenseAmount)
  return item
}
```