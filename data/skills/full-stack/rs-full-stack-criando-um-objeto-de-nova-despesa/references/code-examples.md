# Code Examples: Criando Objetos a Partir de Formularios

## Exemplo completo da aula

```javascript
// Elementos do formulario (recuperados anteriormente)
const form = document.querySelector("form")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const amount = document.getElementById("amount")

// Captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
  // Previne o comportamento padrao de recarregar a pagina
  event.preventDefault()

  // Cria um objeto com os detalhes da nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  console.log(newExpense)
}
```

## Saida demonstrada pelo instrutor

### Teste 1: Jantar / Alimentação / 55.90
```javascript
{
  id: 1709312345678,
  expense: "Jantar",
  category_id: "food",
  category_name: "Alimentação",
  amount: "55.90",
  created_at: "2024-03-01T18:30:00.000Z"
}
```

### Teste 2: Translado aeroporto hotel / Transporte / 70.90
```javascript
{
  id: 1709312400123,
  expense: "translado a aeroporto para o hotel",
  category_id: "transport",
  category_name: "Transporte",
  amount: "70.90",
  created_at: "2024-03-01T18:35:00.000Z"
}
```

## Variacoes do padrao

### Com conversao de tipo para amount
```javascript
const newExpense = {
  id: new Date().getTime(),
  expense: expense.value,
  category_id: category.value,
  category_name: category.options[category.selectedIndex].text,
  amount: parseFloat(amount.value),  // converte string para numero
  created_at: new Date(),
}
```

### Com destructuring do select
```javascript
const { value: categoryId, options, selectedIndex } = category
const categoryName = options[selectedIndex].text

const newExpense = {
  id: new Date().getTime(),
  expense: expense.value,
  category_id: categoryId,
  category_name: categoryName,
  amount: amount.value,
  created_at: new Date(),
}
```

### Com funcao helper para extrair option text
```javascript
function getSelectedText(selectElement) {
  return selectElement.options[selectElement.selectedIndex].text
}

const newExpense = {
  id: new Date().getTime(),
  expense: expense.value,
  category_id: category.value,
  category_name: getSelectedText(category),
  amount: amount.value,
  created_at: new Date(),
}
```

### Multiplos selects no mesmo formulario
```javascript
// Se houvesse mais selects (ex: metodo de pagamento)
const newExpense = {
  id: new Date().getTime(),
  expense: expense.value,
  category_id: category.value,
  category_name: category.options[category.selectedIndex].text,
  payment_method_id: paymentMethod.value,
  payment_method_name: paymentMethod.options[paymentMethod.selectedIndex].text,
  amount: amount.value,
  created_at: new Date(),
}
```

### Usando addEventListener ao inves de onsubmit
```javascript
form.addEventListener("submit", (event) => {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }
})
```

### Estrutura HTML do select referenciado
```html
<select id="category">
  <option value="food">Alimentação</option>
  <option value="transport">Transporte</option>
  <option value="health">Saúde</option>
  <option value="accommodation">Hospedagem</option>
  <option value="education">Educação</option>
  <option value="other">Outros</option>
</select>
```