---
name: rs-full-stack-conhecendo-o-set-timeout
description: "Applies correct setTimeout usage patterns when writing JavaScript timing code. Use when user asks to 'delay execution', 'run after timeout', 'schedule a function', 'wait before executing', or 'use setTimeout'. Enforces proper callback structure, millisecond units in variable names, and arrow function syntax. Make sure to use this skill whenever code involves delayed execution or timed callbacks. Not for setInterval, recurring timers, debounce, or throttle patterns."
---

# setTimeout — Execucao Agendada

> Use setTimeout para executar uma funcao UMA vez apos um intervalo especificado em milissegundos.

## Rules

1. **Primeiro parametro e a funcao callback** — `setTimeout(() => { ... }, tempo)`, porque o callback define O QUE executar
2. **Segundo parametro e o tempo em milissegundos** — `1000` = 1 segundo, `3000` = 3 segundos, porque a API usa ms como unidade
3. **Inclua unidade no nome da variavel de tempo** — `delayInMs`, `timeoutInMs`, nunca `delay` ou `timeout` sozinhos, porque evita confusao entre segundos e milissegundos
4. **Use arrow functions como callback** — `() => {}` em vez de `function() {}`, porque e mais conciso e mantém o escopo lexico do `this`
5. **Guarde o retorno para poder cancelar** — `const timerId = setTimeout(...)`, porque `clearTimeout(timerId)` precisa da referencia para cancelar

## How to write

### Basico

```javascript
setTimeout(() => {
  console.log("Executado apos 1 segundo")
}, 1000)
```

### Com variavel nomeada

```javascript
const notificationDelayInMs = 3000

const timerId = setTimeout(() => {
  showNotification("Operacao concluida")
}, notificationDelayInMs)
```

### Cancelamento

```javascript
const timerId = setTimeout(() => {
  redirectToHome()
}, 5000)

// Cancelar se usuario interagir antes
cancelButton.addEventListener("click", () => {
  clearTimeout(timerId)
})
```

## Example

**Before:**
```javascript
setTimeout(function() {
  console.log("ola")
}, 3000)
```

**After (with this skill applied):**
```javascript
const greetingDelayInMs = 3000

setTimeout(() => {
  console.log("Ola, tudo bem?")
}, greetingDelayInMs)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Delay fixo e simples | Inline o valor: `setTimeout(() => {}, 1000)` |
| Delay configuravel ou reutilizado | Extraia para constante com sufixo `InMs` |
| Precisa cancelar depois | Guarde o retorno em variavel `timerId` |
| Executar repetidamente | Use `setInterval`, nao `setTimeout` em loop |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `setTimeout(minhaFuncao(), 1000)` (invoca imediatamente) | `setTimeout(minhaFuncao, 1000)` ou `setTimeout(() => minhaFuncao(), 1000)` |
| `setTimeout("console.log('x')", 1000)` (string) | `setTimeout(() => console.log('x'), 1000)` |
| `const delay = 3000` (sem unidade) | `const delayInMs = 3000` |
| `setTimeout(() => {}, 3)` pensando em segundos | `setTimeout(() => {}, 3000)` — lembre: milissegundos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes