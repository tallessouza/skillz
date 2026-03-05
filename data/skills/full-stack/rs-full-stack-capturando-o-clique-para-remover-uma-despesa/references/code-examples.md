# Code Examples: Capturando Clique para Remover Item de Lista

## Exemplo base do projeto Refund

### Selecao do elemento no topo do script

```javascript
const expenseList = document.querySelector("ul")
```

### Listener com delegation

```javascript
// Evento que captura clique nos itens da lista
expenseList.addEventListener("click", (event) => {
  // Verifica se o elemento clicado e o icone de remover
  if (event.target.classList.contains("remove-icon")) {
    console.log("Clicou no icone de remover")
    // Proxima aula: implementar a remocao efetiva
  }
})
```

## Variacoes

### Com closest (robusto para icones com filhos)

```javascript
expenseList.addEventListener("click", (event) => {
  const removeIcon = event.target.closest(".remove-icon")
  if (removeIcon) {
    const listItem = removeIcon.closest("li")
    console.log("Remover item:", listItem)
  }
})
```

### Multiplas acoes no mesmo listener

```javascript
expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-icon")) {
    // Logica de remocao
  } else if (event.target.classList.contains("edit-icon")) {
    // Logica de edicao
  }
})
```

### Versao sem delegation (anti-pattern para comparacao)

```javascript
// ANTI-PATTERN: nao funciona para itens adicionados depois
document.querySelectorAll(".remove-icon").forEach((icon) => {
  icon.addEventListener("click", (event) => {
    const listItem = event.target.closest("li")
    listItem.remove()
  })
})

// Se depois voce faz:
expenseList.innerHTML += newItemHTML
// Os listeners dos itens antigos DESAPARECEM
// E o novo item nunca teve listener
```

### Verificando o console.log sem filtro (debug)

```javascript
// Util para debug — mostra TODOS os cliques na lista
expenseList.addEventListener("click", (event) => {
  console.log(event)         // objeto completo do evento
  console.log(event.target)  // elemento exato que foi clicado
})
```

### Fluxo completo tipico (preview da proxima aula)

```javascript
expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest("li")
    const expenseId = item.dataset.id

    // Remove do array de dados
    expenses = expenses.filter((expense) => expense.id !== expenseId)

    // Remove do DOM
    item.remove()

    // Atualiza totais
    updateTotals()
  }
})
```