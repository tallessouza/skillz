---
name: rs-full-stack-criando-a-li
description: "Generates dynamic HTML list items using document.createElement and classList.add when building expense lists, todo lists, or any dynamic UI list. Use when user asks to 'create list items', 'add items dynamically', 'build a dynamic list', 'generate li elements', or 'render a list from data'. Make sure to use this skill whenever generating JavaScript that creates DOM elements for lists. Not for static HTML markup, CSS styling, or framework-based rendering (React, Vue)."
---

# Criando Elementos de Lista Dinamicamente com JavaScript

> Ao construir listas dinamicas, crie cada elemento via `document.createElement`, adicione classes de estilizacao com `classList.add`, e monte a estrutura completa antes de inserir no DOM.

## Rules

1. **Use `document.createElement` para cada elemento** — nunca `innerHTML` com template strings, porque createElement e mais seguro contra XSS e permite manipulacao programatica
2. **Adicione classes com `classList.add`** — nunca atribua `className` diretamente, porque classList preserva classes existentes e e mais expressivo
3. **Comente cada etapa da construcao** — descreva o que cada bloco cria ("cria o elemento li para adicionar o item na lista"), porque facilita manutencao futura
4. **Monte a estrutura dentro do `try`** — toda criacao de elementos dinamicos deve estar protegida por tratamento de erro
5. **Comece com a lista vazia no HTML** — deixe a estrutura estatica comentada como referencia e popule via JavaScript, porque garante que o estado inicial e limpo
6. **Siga a referencia visual** — primeiro construa o HTML/CSS estatico, depois reproduza a mesma estrutura dinamicamente no JavaScript

## How to write

### Criar item de lista com classe

```javascript
// Cria o elemento de li para adicionar o item na lista (ul)
const expenseItem = document.createElement("li")
expenseItem.classList.add("expense-item")
```

### Estrutura completa de um item dinamico

```javascript
try {
  // Cria o elemento de li para adicionar o item na lista
  const expenseItem = document.createElement("li")
  expenseItem.classList.add("expense-item")

  // Cria o conteudo interno (icone, nome, categoria, valor)
  const expenseIcon = document.createElement("img")
  expenseIcon.src = categoryIcon
  expenseIcon.alt = category

  const expenseName = document.createElement("span")
  expenseName.classList.add("expense-name")
  expenseName.textContent = name

  const expenseCategory = document.createElement("span")
  expenseCategory.classList.add("expense-category")
  expenseCategory.textContent = category

  const expenseAmount = document.createElement("span")
  expenseAmount.classList.add("expense-amount")
  expenseAmount.textContent = amount

  // Monta a estrutura antes de inserir no DOM
  expenseItem.append(expenseIcon, expenseName, expenseCategory, expenseAmount)

  // Adiciona o item na lista (ul)
  expenseList.append(expenseItem)
} catch (error) {
  console.error("Erro ao criar item da lista:", error)
}
```

## Example

**Before (innerHTML inseguro):**
```javascript
list.innerHTML += `<li class="expense-item">
  <img src="${icon}" alt="${category}">
  <span>${name}</span>
  <span>${amount}</span>
</li>`
```

**After (createElement seguro e estruturado):**
```javascript
const expenseItem = document.createElement("li")
expenseItem.classList.add("expense-item")

const expenseIcon = document.createElement("img")
expenseIcon.src = icon
expenseIcon.alt = category

const expenseName = document.createElement("span")
expenseName.textContent = name

const expenseAmount = document.createElement("span")
expenseAmount.textContent = amount

expenseItem.append(expenseIcon, expenseName, expenseAmount)
list.append(expenseItem)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Lista começa vazia | Comente o HTML estatico como referencia, popule via JS |
| Multiplos elementos filhos no item | Crie cada um com createElement, depois use `append` com multiplos argumentos |
| Precisa de classe CSS no elemento | Use `classList.add("classe")` logo apos criar |
| Estrutura complexa (icone + texto + valor) | Monte todos os filhos antes de inserir o pai no DOM |
| Referencia visual existe no HTML | Use como guia para reproduzir a mesma estrutura no JS |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `element.innerHTML += '<li>...'` | `document.createElement("li")` |
| `element.className = "classe"` | `element.classList.add("classe")` |
| Criar elementos sem try/catch | Envolver criacao em try/catch |
| Lista com itens estaticos no HTML | Lista vazia + HTML comentado como referencia |
| Inserir cada filho individualmente no DOM | Montar a arvore completa, depois inserir o pai |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre createElement vs innerHTML, workflow estatico-para-dinamico
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-criando-a-li/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-criando-a-li/references/code-examples.md)
