---
name: rs-full-stack-obtendo-moeda-selecionada
description: "Applies DOM form handling patterns when capturing select input values in JavaScript. Use when user asks to 'get selected value', 'handle form submit', 'capture select input', 'prevent page reload on submit', or 'get form data'. Covers getElementById, querySelector, onSubmit, preventDefault, and .value extraction from select elements. Make sure to use this skill whenever working with HTML forms and select elements in vanilla JS. Not for React/framework state management or fetch/API calls."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-dom
  tags: [javascript, dom, form, select, preventDefault]
---

# Obtendo Valores de Select via Submit do Formulário

> Capture valores de elementos select no momento do submit do formulário, desativando o reload padrão com preventDefault.

## Rules

1. **Selecione elementos no topo do script** — agrupe todas as referências DOM juntas, porque facilita visualizar quais elementos o script manipula
2. **Use preventDefault no evento de submit** — sem ele o navegador recarrega a página (comportamento padrão de formulários), perdendo o estado da aplicação
3. **Acesse .value no momento do evento** — leia `element.value` dentro do handler de submit, não na declaração, porque o valor muda conforme o usuário interage
4. **Botão dentro de form dispara submit** — não precisa de click handler no botão, porque o formulário já emite o evento submit ao clicar ou pressionar Enter

## How to write

### Seleção de elementos do formulário

```javascript
// Obtendo os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const currency = document.getElementById("currency")
```

### Captura do submit com preventDefault

```javascript
// Capturando o evento de submit do formulário
form.onSubmit = function(event) {
  event.preventDefault()

  const selectedCurrency = currency.value // ex: "USD", "GBP", "EUR"
  const enteredAmount = amount.value
}
```

### Alternativa com arrow function

```javascript
form.onSubmit = (event) => {
  event.preventDefault()
  console.log(currency.value)
}
```

## Example

**Before (sem preventDefault, sem captura no submit):**
```javascript
const currency = document.getElementById("currency")
// Página recarrega ao clicar no botão, valor se perde
console.log(currency.value) // executa uma vez no load, não no submit
```

**After (com this skill applied):**
```javascript
const form = document.querySelector("form")
const currency = document.getElementById("currency")

form.onSubmit = (event) => {
  event.preventDefault()
  console.log(currency.value) // "USD", "GBP", "EUR" — no momento do clique
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Botão dentro de `<form>` | Use evento submit no form, não click no botão |
| Precisa do valor no momento da ação | Leia `.value` dentro do handler |
| Múltiplos inputs no form | Selecione cada um por id, leia todos no submit |
| Select com `<option value="USD">` | `.value` retorna o atributo value da option selecionada |
| Usuário pode submeter com Enter | `onSubmit` já cobre Enter e clique — não duplique handlers |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `button.addEventListener("click", ...)` dentro de form | `form.onSubmit = (e) => { e.preventDefault(); ... }` |
| `currency.value` fora de qualquer handler | `currency.value` dentro do handler de submit |
| Submit sem `preventDefault()` | Sempre chame `event.preventDefault()` primeiro |
| Ler valor no momento da declaração da variável | Ler valor no momento do evento |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Pagina recarrega ao submeter formulario | Faltou `event.preventDefault()` | Adicione como primeira linha do handler |
| `.value` retorna string vazia | Lendo valor fora do handler de submit | Mova leitura de `.value` para dentro do handler |
| Handler nao dispara | Usou `onclick` no botao dentro de form | Use `form.onSubmit` em vez de click no botao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre submit vs click, preventDefault, e identificadores de moeda
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes