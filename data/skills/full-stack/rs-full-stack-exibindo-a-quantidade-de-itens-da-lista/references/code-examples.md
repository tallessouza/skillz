# Code Examples: Atualizacao Dinamica de Quantidade de Itens

## Exemplo completo da aula

### Selecoes globais no topo do script

```javascript
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
```

### Funcao updateTotals

```javascript
// Atualiza os totais (quantidade de despesas e valor total)
function updateTotals() {
  try {
    // Recupera todos os itens (elementos filhos) da lista
    const items = expenseList.children

    // Atualiza a quantidade de itens da lista
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel atualizar os totais")
  }
}
```

### Chamada dentro de expenseAdd

```javascript
// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // ... criacao de elementos (li, img, div, spans, etc.) ...

    // Adiciona o item na lista
    expenseList.append(li)

    // Atualiza os totais
    updateTotals()
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel adicionar a despesa")
  }
}
```

## Variacoes do padrao

### Com remocao de itens

```javascript
function expenseRemove(li) {
  try {
    li.remove()
    updateTotals() // Mesma funcao, funciona para adicao e remocao
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel remover a despesa")
  }
}
```

### Com texto customizado para zero itens

```javascript
function updateTotals() {
  try {
    const items = expenseList.children
    
    if (items.length === 0) {
      expensesQuantity.textContent = "Nenhuma despesa"
    } else {
      expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`
    }
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel atualizar os totais")
  }
}
```

### Com valor total (extensao natural)

```javascript
function updateTotals() {
  try {
    const items = expenseList.children

    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Futura extensao: calcular soma dos valores
    // let total = 0
    // for (const item of items) {
    //   const amount = item.querySelector(".expense-amount")
    //   total += parseFloat(amount.textContent.replace("R$ ", "").replace(",", "."))
    // }
    // expensesTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel atualizar os totais")
  }
}
```

### Estrutura HTML referenciada

```html
<aside>
  <header>
    <h2>Minhas solicitacoes</h2>
    <p><span>0 despesa</span></p>  <!-- Este span e atualizado dinamicamente -->
  </header>
  <ul>
    <!-- Itens da lista adicionados via JS -->
  </ul>
</aside>
```

### Console.log para debug (mostrado na aula)

```javascript
// O instrutor usou console.log para visualizar o que children retorna
function updateTotals() {
  try {
    const items = expenseList.children
    console.log(items)  // HTMLCollection com os <li> filhos
    // items.length = 1 apos primeiro item adicionado
    // items.length = 2 apos segundo item adicionado
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel atualizar os totais")
  }
}
```