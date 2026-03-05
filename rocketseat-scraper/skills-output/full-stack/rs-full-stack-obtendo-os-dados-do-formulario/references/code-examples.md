# Code Examples: Obtendo Dados do Formulário

## Exemplo completo da aula

### HTML do formulário (contexto)

```html
<form>
  <input id="expense" type="text" placeholder="Nome da despesa" />
  <input id="amount" type="number" placeholder="Valor" />
  <select id="category">
    <option value="">Selecione</option>
    <option value="alimentacao">Alimentação</option>
    <option value="transporte">Transporte</option>
  </select>
  <button type="submit">Adicionar</button>
</form>
```

### JavaScript (evolução passo a passo)

**Passo 1 — Selecionar o formulário:**
```javascript
const form = document.querySelector("form")
```

**Passo 2 — Selecionar os inputs pelos ids:**
```javascript
const expense = document.getElementById("expense")
const amount = document.getElementById("amount")
const category = document.getElementById("category")
```

**Passo 3 — Adicionar evento de submit com preventDefault:**
```javascript
form.onsubmit = (event) => {
  event.preventDefault()
}
```

**Passo 4 — Manipular os valores (próximas aulas):**
```javascript
form.onsubmit = (event) => {
  event.preventDefault()

  // Acessar os valores digitados/selecionados
  console.log(expense.value)
  console.log(amount.value)
  console.log(category.value)
}
```

## Variações e cenários alternativos

### Usando addEventListener ao invés de onsubmit

```javascript
// Alternativa com addEventListener (permite múltiplos handlers)
form.addEventListener("submit", (event) => {
  event.preventDefault()
  console.log(expense.value, amount.value, category.value)
})
```

### Acessando valores via event.target

```javascript
// Sem precisar selecionar cada input individualmente
form.onsubmit = (event) => {
  event.preventDefault()

  // event.target é o próprio form
  const formData = {
    expense: event.target.querySelector("#expense").value,
    amount: event.target.querySelector("#amount").value,
    category: event.target.querySelector("#category").value,
  }

  console.log(formData)
}
```

### Usando FormData API (alternativa moderna)

```javascript
form.onsubmit = (event) => {
  event.preventDefault()

  // Requer atributo name nos inputs
  const data = new FormData(event.target)
  const expense = data.get("expense")
  const amount = data.get("amount")
  const category = data.get("category")
}
```

## O que acontece SEM preventDefault (demonstrado na aula)

O instrutor demonstrou ao vivo: ao clicar "Adicionar" sem `preventDefault`, a página recarrega instantaneamente. Qualquer `console.log` após o submit nunca é executado porque o browser descarta o contexto JavaScript atual e carrega a página do zero.

```javascript
// PROBLEMA: página recarrega, console.log nunca executa
form.onsubmit = () => {
  console.log("isso nunca aparece")
}

// SOLUÇÃO: preventDefault impede o recarregamento
form.onsubmit = (event) => {
  event.preventDefault()
  console.log("agora funciona")
}
```