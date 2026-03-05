---
name: rs-full-stack-manipulando-valor-do-input
description: "Applies input value manipulation patterns using regex, events, and validation in JavaScript. Use when user asks to 'validate form input', 'use regex in JS', 'manipulate input value', 'filter characters from input', or 'handle form submit'. Covers match, test, replace methods with regex, input/submit events, and conditional validation flows. Make sure to use this skill whenever working with form inputs, regex validation, or character filtering in vanilla JS. Not for React/Vue form handling, server-side validation, or complex regex pattern design."
---

# Manipulando Valor do Input com Regex

> Combine eventos de input/submit com expressoes regulares para capturar, validar e transformar valores digitados pelo usuario.

## Rules

1. **Use o evento `input` para reagir em tempo real** — `addEventListener('input', fn)` dispara a cada caractere digitado ou apagado, porque captura o valor completo do campo a cada mudanca
2. **Use o evento `submit` para processar no envio** — sempre chame `event.preventDefault()` antes de manipular, porque o comportamento padrao recarrega a pagina
3. **`match()` retorna ocorrencias encontradas** — `value.match(regex)` retorna array com os trechos que atendem o padrao ou `null` se nada encontrar
4. **`test()` retorna booleano** — `regex.test(value)` retorna `true`/`false`, ideal para validacao condicional
5. **`replace()` substitui pelo padrao** — `value.replace(regex, '')` remove trechos que atendem o padrao; string vazia remove, qualquer outro valor substitui
6. **Use flag `g` para pegar todas as ocorrencias** — sem `g` so captura a primeira, porque regex para na primeira match por padrao

## How to write

### Capturar valor do input em tempo real

```javascript
const input = document.querySelector("input")

input.addEventListener("input", () => {
  const value = input.value
  console.log(value)
})
```

### Validar com regex.test()

```javascript
const regex = /\D+/g // identifica nao-digitos (letras)

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const value = input.value

  if (!regex.test(value)) {
    alert("Valor invalido. Digite corretamente.")
    return
  }

  console.log(value) // valor valido, prosseguir
})
```

### Remover caracteres com replace()

```javascript
const regex = /\D+/g

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const value = input.value.replace(regex, "")
  console.log(value) // somente digitos
})
```

## Example

**Before (sem validacao, aceita tudo):**
```javascript
form.addEventListener("submit", () => {
  const value = input.value
  saveToDatabase(value) // salva qualquer coisa
})
```

**After (com validacao e limpeza via regex):**
```javascript
const regex = /\D+/g

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const value = input.value

  if (regex.test(value)) {
    // tem letras — validacao falhou
    alert("Valor invalido. Digite corretamente.")
    return
  }

  const cleanValue = value.replace(/\D+/g, "")
  saveToDatabase(cleanValue)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Feedback visual em tempo real | Use evento `input` |
| Processar dados no envio | Use evento `submit` com `preventDefault()` |
| Precisa saber O QUE foi encontrado | Use `value.match(regex)` |
| Precisa saber SE foi encontrado | Use `regex.test(value)` |
| Precisa LIMPAR o valor | Use `value.replace(regex, "")` |
| Substituir por outro caractere | Use `value.replace(regex, "X")` |
| Capturar todas as ocorrencias | Adicione flag `g` na regex |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `form.addEventListener("submit", () => {` sem preventDefault | `form.addEventListener("submit", (event) => { event.preventDefault()` |
| `value.replace("abc", "")` para remover padrao | `value.replace(/abc/g, "")` com regex e flag g |
| `if (value.match(regex))` para validacao simples | `if (regex.test(value))` — test retorna booleano direto |
| Manipular `input.value` sem guardar em variavel | `const value = input.value` antes de usar |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre eventos input vs submit, match vs test vs replace
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes