---
name: rs-full-stack-obtendo-dados-formulario
description: "Applies form data extraction patterns when writing JavaScript form handling code. Use when user asks to 'handle form submit', 'get form data', 'capture form input', 'prevent page reload on submit', or 'select form elements'. Enforces getElementById for inputs, querySelector for form, onsubmit with preventDefault, and arrow function event handlers. Make sure to use this skill whenever implementing form submission handling in vanilla JavaScript. Not for React/Vue forms, FormData API, or fetch/AJAX submission."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-dom
  tags: [javascript, dom, form, submit, preventDefault]
---

# Obtendo Dados do Formulário

> Ao capturar dados de formulário, selecione cada elemento pelo id, adicione o evento submit no form, e previna o comportamento padrão antes de manipular os valores.

## Rules

1. **Selecione inputs por getElementById** — `document.getElementById("expense")` não `querySelector("#expense")`, porque getElementById é mais direto e performático para seleção por id
2. **Selecione o form por querySelector** — `document.querySelector("form")` porque formulário é selecionado pela tag, não por id
3. **Use onsubmit com arrow function** — `form.onsubmit = (event) => {}` porque arrow functions mantêm o contexto léxico e a sintaxe é mais limpa
4. **Sempre use preventDefault** — `event.preventDefault()` como primeira linha do handler, porque formulários recarregam a página por padrão ao submeter
5. **Declare seleções no topo do script** — agrupe todas as seleções de elementos antes da lógica, porque facilita visualizar quais elementos o script manipula

## How to write

### Seleção de elementos do formulário

```javascript
// Selecione o formulário pela tag
const form = document.querySelector("form")

// Selecione cada input pelo seu id
const expense = document.getElementById("expense")
const amount = document.getElementById("amount")
const category = document.getElementById("category")
```

### Evento de submit com preventDefault

```javascript
form.onsubmit = (event) => {
  event.preventDefault()

  // Agora manipule os valores sem recarregar a página
  console.log(expense.value, amount.value, category.value)
}
```

## Example

**Before (página recarrega, dados perdidos):**
```javascript
const form = document.querySelector("form")

form.onsubmit = () => {
  // Sem preventDefault — página recarrega e perde tudo
  console.log("nunca vai aparecer no console")
}
```

**After (com esta skill aplicada):**
```javascript
const form = document.querySelector("form")
const expense = document.getElementById("expense")
const amount = document.getElementById("amount")
const category = document.getElementById("category")

form.onsubmit = (event) => {
  event.preventDefault()

  console.log(expense.value, amount.value, category.value)
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Elemento tem id no HTML | Use `getElementById` |
| Elemento é tag única (form, table) | Use `querySelector("tag")` |
| Formulário faz submit | Sempre `preventDefault` primeiro |
| Múltiplos inputs para capturar | Declare todos no topo, agrupe as seleções |
| Precisa do evento no handler | Use `(event) => {}`, não `() => {}` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `form.onsubmit = function() {}` | `form.onsubmit = (event) => {}` |
| Handler sem `event.preventDefault()` | Sempre `event.preventDefault()` como primeira linha |
| `document.querySelector("#expense")` para id | `document.getElementById("expense")` |
| Seleções de elementos dentro do handler | Seleções no topo do script, fora do handler |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Pagina recarrega ao submeter | Faltou `event.preventDefault()` | Adicione como primeira linha do handler de submit |
| `getElementById` retorna `null` | Script carrega antes do HTML ou id incorreto | Mova script para final do body ou use `defer` |
| Handler nao recebe evento | Usou `() => {}` sem parametro | Use `(event) => {}` para acessar o evento |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre submit, preventDefault e selecao de elementos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes