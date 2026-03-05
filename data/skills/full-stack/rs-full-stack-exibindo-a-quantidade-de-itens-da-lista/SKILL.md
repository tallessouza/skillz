---
name: rs-full-stack-exibindo-qtd-itens-lista
description: "Applies dynamic list count update patterns when writing JavaScript DOM manipulation code. Use when user asks to 'update a counter', 'show item count', 'display list total', 'sync UI with list changes', or 'pluralize text dynamically'. Enforces children property for counting, template literals for plural/singular text, and calling update functions after DOM mutations. Make sure to use this skill whenever building lists with visible counters or totals. Not for React/Vue state management, CSS styling, or backend pagination."
---

# Atualizacao Dinamica de Quantidade de Itens na Lista

> Sempre que modificar uma lista no DOM, atualize os totais imediatamente apos a mutacao, usando `children.length` para contar e template literals para pluralizar o texto.

## Rules

1. **Conte filhos com `.children`** — use `element.children` para obter os filhos diretos de uma lista, porque retorna apenas elementos HTML (ignora text nodes e comentarios)
2. **Atualize totais apos cada mutacao** — chame a funcao de update no final da funcao que adiciona/remove itens, porque o usuario deve ver o estado correto imediatamente
3. **Pluralize dinamicamente** — use ternario dentro de template literal para alternar singular/plural, porque "1 despesas" e um erro gramatical visivel
4. **Selecione elementos globalmente** — declare `querySelector` no topo do script para elementos reutilizados em multiplas funcoes, porque evita selecoes repetidas e centraliza referencias
5. **Envolva em try/catch com mensagem amigavel** — funcoes que atualizam a UI devem ter tratamento de erro com `alert()` amigavel e `console.log` tecnico, porque o usuario precisa feedback e o dev precisa debug

## How to write

### Contar itens da lista

```javascript
// Recupera todos os filhos da lista (elementos <li>)
const items = expenseList.children
const itemCount = items.length
```

### Atualizar texto com pluralizacao

```javascript
// Template literal com ternario para singular/plural
expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`
```

### Funcao completa de update

```javascript
function updateTotals() {
  try {
    const items = expenseList.children
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel atualizar os totais")
  }
}
```

### Chamar apos adicionar item

```javascript
function expenseAdd(newExpense) {
  try {
    // ... monta e adiciona o item na lista ...
    expenseList.append(li)

    // Apos adicionar, atualiza os totais
    updateTotals()
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel adicionar a despesa")
  }
}
```

## Example

**Before (contador estatico):**
```html
<span>0 despesas</span>
```
```javascript
function addItem(item) {
  list.append(item)
  // Esqueceu de atualizar o contador — UI desatualizada
}
```

**After (com this skill applied):**
```javascript
// Selecao global no topo
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")

function updateTotals() {
  try {
    const items = expenseList.children
    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel atualizar os totais")
  }
}

function expenseAdd(newExpense) {
  try {
    // ... monta elementos ...
    expenseList.append(li)
    updateTotals() // Sempre no final
  } catch (error) {
    console.log(error)
    alert("Nao foi possivel adicionar a despesa")
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Lista com contador visivel | Crie funcao `updateTotals()` separada |
| Texto depende de quantidade | Use ternario em template literal |
| Funcao adiciona/remove da lista | Chame `updateTotals()` como ultima linha do try |
| Elemento usado em 2+ funcoes | Declare no escopo global do script |
| Quantidade pode ser 0 | Trate "0 despesa" (singular) como caso valido |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `list.querySelectorAll("li").length` (requery toda vez) | `list.children.length` (direto nos filhos) |
| `span.innerHTML = count + " despesas"` (sempre plural) | `` `${count} ${count > 1 ? "despesas" : "despesa"}` `` |
| Atualizar contador dentro do event listener | Extrair para funcao `updateTotals()` reutilizavel |
| Selecionar elemento dentro da funcao de update | Selecionar no topo do script, reutilizar referencia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre children vs querySelectorAll, navegacao CSS selectors, e try/catch em funcoes de UI
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula expandidos com variacoes