# Code Examples: Usabilidade em Formulários

## Exemplo completo da aula

### Função formClear

```javascript
function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

  // Coloca foco no primeiro input para fluxo contínuo
  expense.focus()
}
```

### Integração com expenseAdd

```javascript
function expenseAdd() {
  // ... validação e criação do item
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    amount: amount.value,
  }

  expenses.push(newExpense)
  expenseCreate(newExpense)

  // Limpa formulário para próxima entrada
  formClear()

  // Atualiza contadores e totais
  updateTotals()
}
```

## Variações

### Com form.reset() nativo

```javascript
function formClear() {
  document.getElementById("form").reset()
  expense.focus()
}
```

> `form.reset()` restaura todos os campos ao valor inicial do HTML. Funciona bem se os defaults estão corretos, mas não dá controle granular.

### Com verificação de existência dos campos

```javascript
function formClear() {
  if (expense) expense.value = ""
  if (category) category.value = ""
  if (amount) amount.value = ""

  if (expense) expense.focus()
}
```

### Versão genérica para qualquer formulário

```javascript
function clearFormInputs(formElement, focusFirst = true) {
  const inputs = formElement.querySelectorAll("input, select, textarea")

  inputs.forEach((input) => {
    if (input.type === "checkbox" || input.type === "radio") {
      input.checked = false
    } else {
      input.value = ""
    }
  })

  if (focusFirst && inputs.length > 0) {
    inputs[0].focus()
  }
}
```

### Fluxo completo demonstrado pelo instrutor

```
1. Usuário digita "almoço" no campo nome
2. Tab → seleciona "alimentação" no select
3. Tab → digita "45.90" no campo valor
4. Enter (ou clique em Adicionar)
5. Item aparece na lista
6. Campos limpam automaticamente
7. Foco volta ao campo nome
8. Usuário digita "translado" imediatamente
9. Tab → seta para "transporte"
10. Tab → digita "30"
11. Enter → repete o ciclo
```

### Chamada via evento de submit

```javascript
form.addEventListener("submit", (event) => {
  event.preventDefault()
  expenseAdd()
  // formClear() já é chamada dentro de expenseAdd()
})
```

### Limpeza com animação sutil (melhoria)

```javascript
function formClear() {
  const fields = [expense, category, amount]

  fields.forEach((field) => {
    field.value = ""
    field.classList.add("cleared")
    setTimeout(() => field.classList.remove("cleared"), 300)
  })

  expense.focus()
}
```

```css
.cleared {
  background-color: #e8f5e9;
  transition: background-color 0.3s ease;
}
```