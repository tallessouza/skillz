---
name: rs-full-stack-percorrendo-itens-lista
description: "Applies for-loop list traversal patterns when iterating over DOM elements to calculate totals or aggregate values. Use when user asks to 'loop through elements', 'calculate total from list', 'sum values from DOM', 'iterate over items', or 'traverse list items'. Enforces accumulator pattern, scoped querySelector on individual elements, and proper index-based access. Make sure to use this skill whenever generating code that iterates DOM collections to extract and aggregate data. Not for array method patterns like map/reduce/forEach or non-DOM iteration."
---

# Percorrendo Itens da Lista com For Loop

> Ao percorrer elementos do DOM para agregar valores, use um acumulador inicializado em zero e querySelector escopado no elemento individual, nunca no documento inteiro.

## Rules

1. **Inicialize o acumulador antes do loop** — `let total = 0` antes do `for`, porque o valor precisa persistir entre iteracoes e acumular a soma
2. **Use o tamanho da colecao como limite** — `item < itens.length`, porque garante que percorre exatamente todos os elementos sem hardcodar o numero
3. **Faca querySelector no elemento, nao no document** — `itens[i].querySelector('.class')` nao `document.querySelector('.class')`, porque escopa a busca ao item atual da iteracao
4. **Crie variaveis auxiliares com nomes descritivos** — `itemAmount` nao `val` ou `x`, porque facilita debug com console.log
5. **Extraia o valor textual antes de converter** — acesse `.innerText` ou `.textContent` do elemento selecionado, porque querySelector retorna o elemento DOM, nao o valor

## How to write

### Acumulador com for loop

```javascript
// Inicializa acumulador
let total = 0

// Percorre cada item da colecao DOM
for (let item = 0; item < itens.length; item++) {
  // querySelector ESCOPADO no elemento individual
  const itemAmount = itens[item].querySelector(".expense-amount")

  // Converte texto para numero e acumula
  total += parseFloat(itemAmount.innerText)
}
```

### querySelector escopado vs global

```javascript
// CORRETO: busca dentro do item especifico
const amount = itens[i].querySelector(".expense-amount")

// ERRADO: busca no documento inteiro (sempre retorna o primeiro)
const amount = document.querySelector(".expense-amount")
```

## Example

**Before (erro comum — querySelector global):**
```javascript
const itens = document.querySelectorAll("li")
let total = 0

for (let i = 0; i < itens.length; i++) {
  // BUG: sempre pega o primeiro .expense-amount do documento
  const val = document.querySelector(".expense-amount")
  total += parseFloat(val.innerText)
}
```

**After (com esta skill aplicada):**
```javascript
const itens = document.querySelectorAll("li")
let total = 0

for (let i = 0; i < itens.length; i++) {
  const itemAmount = itens[i].querySelector(".expense-amount")
  total += parseFloat(itemAmount.innerText)
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa somar valores de elementos repetidos | Acumulador + for loop com querySelector escopado |
| Precisa debugar o valor de cada iteracao | `console.log(itemAmount)` dentro do loop para ver o elemento |
| Colecao pode estar vazia | Verifique `itens.length` antes do loop |
| Valor pode conter formatacao (R$, virgula) | Limpe a string antes de `parseFloat` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `document.querySelector` dentro do loop | `itens[i].querySelector` |
| `for (let i = 0; i < 5; i++)` (hardcoded) | `for (let i = 0; i < itens.length; i++)` |
| `total = itemAmount` (substitui) | `total += parseFloat(itemAmount.innerText)` (acumula) |
| Variavel de controle sem inicializar | `let total = 0` antes do loop |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre escopo de querySelector e padrao acumulador
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes