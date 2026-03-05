---
name: rs-full-stack-criando-info-despesa
description: "Enforces cascading DOM element creation pattern when building UI components with JavaScript. Use when user asks to 'create elements', 'build a list item', 'add DOM elements', 'create expense item', or 'manipulate the DOM'. Applies nested createElement + append pattern with proper class assignment and textContent binding. Make sure to use this skill whenever generating vanilla JS DOM manipulation code. Not for React, Vue, or framework-based component creation."
---

# Criacao de Elementos DOM em Cascata

> Ao construir interfaces com JavaScript puro, crie elementos individuais, configure-os, agrupe-os com append, e adicione o grupo ao elemento pai — sempre em cascata, do mais interno para o mais externo.

## Rules

1. **Crie cada elemento separadamente com createElement** — `document.createElement("div")` para cada tag necessaria, porque isso permite configurar cada elemento antes de aninha-lo
2. **Adicione classes com classList.add** — `element.classList.add("expense-info")` nao `element.className = "..."`, porque classList eh seguro para adicionar sem sobrescrever classes existentes
3. **Use textContent para texto dinamico** — `element.textContent = value` nao `innerHTML`, porque textContent eh seguro contra XSS e mais performatico
4. **Agrupe elementos filhos com append** — `parent.append(child1, child2)` aceita multiplos argumentos, porque evita multiplas chamadas de appendChild
5. **Adicione ao item pai somente apos configurar tudo** — monte o grupo completo antes de inserir na arvore DOM, porque minimiza reflows e mantem o codigo organizado em cascata
6. **Use camelCase para nomes de variaveis de elementos** — `expenseName` nao `expense_name` ou `expense-name`, porque segue convencao JavaScript

## How to write

### Padrao cascata: criar → configurar → agrupar → inserir

```javascript
// 1. Cria o container
const expenseInfo = document.createElement("div")
expenseInfo.classList.add("expense-info")

// 2. Cria elementos filhos com conteudo
const expenseName = document.createElement("strong")
expenseName.textContent = newExpense.expense

const expenseCategory = document.createElement("span")
expenseCategory.textContent = newExpense.categoryName

// 3. Agrupa filhos dentro do container
expenseInfo.append(expenseName, expenseCategory)

// 4. Insere container no item pai
expenseItem.append(expenseIcon, expenseInfo)
```

## Example

**Before (comum em iniciantes):**
```javascript
// Tudo misturado, innerHTML inseguro, sem estrutura
const li = document.createElement("li")
li.innerHTML = `
  <div class="expense-info">
    <strong>${expense}</strong>
    <span>${category}</span>
  </div>
`
list.appendChild(li)
```

**After (com este skill aplicado):**
```javascript
// Cada elemento criado, configurado e agrupado em cascata
const expenseItem = document.createElement("li")
expenseItem.classList.add("expense")

const expenseInfo = document.createElement("div")
expenseInfo.classList.add("expense-info")

const expenseName = document.createElement("strong")
expenseName.textContent = newExpense.expense

const expenseCategory = document.createElement("span")
expenseCategory.textContent = newExpense.categoryName

expenseInfo.append(expenseName, expenseCategory)
expenseItem.append(expenseIcon, expenseInfo)
expenseList.append(expenseItem)
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elemento so tem texto | `createElement` + `textContent` |
| Elemento precisa de classe CSS | `classList.add()` apos criar |
| Multiplos filhos no mesmo pai | `parent.append(child1, child2, ...)` em uma chamada |
| Dados vem de objeto/formulario | Acesse propriedades: `obj.expense`, `obj.categoryName` |
| Estrutura tem 3+ niveis de profundidade | Monte de dentro pra fora (cascata) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `element.innerHTML = '<strong>' + name + '</strong>'` | `strong.textContent = name` |
| `element.className = "expense-info"` | `element.classList.add("expense-info")` |
| `parent.appendChild(a); parent.appendChild(b)` | `parent.append(a, b)` |
| `document.createElement("Strong")` | `document.createElement("strong")` (minusculo) |
| Inserir no DOM antes de configurar filhos | Configurar tudo, depois inserir no pai |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o padrao cascata e por que montar de dentro pra fora
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes