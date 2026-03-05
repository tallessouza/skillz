---
name: rs-full-stack-escopo-de-funcao
description: "Applies JavaScript function scoping and hoisting rules when writing or reviewing JS/TS code. Use when user asks to 'write a function', 'debug scope error', 'fix ReferenceError', 'nested functions', or 'function hoisting'. Ensures correct function declaration placement, nested function scoping, and hoisting awareness. Make sure to use this skill whenever generating JavaScript functions or debugging scope-related errors. Not for variable hoisting (var/let/const), module scope, or class methods."
---

# Escopo de Função e Hoisting

> Funções declaradas com `function` são içadas (hoisted) por completo — declaração E corpo — permitindo uso antes da declaração, mas somente dentro do escopo onde foram definidas.

## Rules

1. **Function declarations são totalmente hoisted** — podem ser chamadas antes da linha de declaração, porque o engine move a função inteira para o topo do escopo, não apenas o nome
2. **Funções internas só existem no escopo pai** — uma função declarada dentro de outra só é acessível dentro daquela função, porque o escopo delimita a visibilidade
3. **Hoisting funciona para function declarations, não expressions** — `function foo(){}` é hoisted, `const foo = function(){}` não é, porque expressions seguem regras de variável
4. **Nested functions também são hoisted dentro do seu escopo** — dentro de uma função pai, uma função filha pode ser chamada antes de sua declaração
5. **Chamar função fora do escopo gera ReferenceError** — se a função foi declarada dentro de outra, ela não existe fora daquele bloco

## How to write

### Função com hoisting (declaration)
```javascript
// Chamada ANTES da declaração — funciona por causa do hoisting
showMessage("Olá, Rodrigo")

function showMessage(message) {
  console.log(message)
}
```

### Funções aninhadas (nested)
```javascript
function showMessage(message) {
  endLine() // Funciona — hoisting dentro do escopo pai
  console.log(message)
  endLine()

  function endLine() {
    console.log("----------")
  }
}
```

### Escopo limita acesso
```javascript
function showMessage(message) {
  console.log(message)

  function endLine() {
    console.log("----------")
  }
}

endLine() // ReferenceError — endLine não existe neste escopo
```

## Example

**Before (bug de escopo):**
```javascript
function processOrder(order) {
  console.log(order.total)

  function formatPrice(value) {
    return `R$ ${value.toFixed(2)}`
  }
}

// Tentando usar função interna fora do escopo
formatPrice(99.9) // ReferenceError: formatPrice is not defined
```

**After (escopo corrigido):**
```javascript
function formatPrice(value) {
  return `R$ ${value.toFixed(2)}`
}

function processOrder(order) {
  console.log(formatPrice(order.total))
}

formatPrice(99.9) // "R$ 99.90" — agora acessível
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Função utilitária usada em vários lugares | Declarar no escopo mais externo (módulo) |
| Função auxiliar usada só dentro de uma função | Declarar como nested function |
| Precisa garantir ordem de execução | Function declarations são seguras (hoisted) |
| Precisa evitar hoisting | Usar function expression (`const fn = function(){}`) |
| ReferenceError em função | Verificar se está chamando fora do escopo de declaração |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Chamar nested function fora do escopo pai | Mover a função para o escopo onde será usada |
| Assumir que arrow/expression é hoisted | Usar function declaration se precisa de hoisting |
| Declarar função auxiliar no escopo global sem necessidade | Manter como nested function se só é usada internamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre hoisting, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações