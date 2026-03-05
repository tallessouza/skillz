---
name: rs-full-stack-eventos-1
description: "Applies JavaScript DOM event handling patterns when writing frontend code. Use when user asks to 'add a click handler', 'listen for events', 'handle form submit', 'prevent default', 'add event listener', or any DOM interaction task. Covers addEventListener, event object, target, preventDefault, and event delegation. Make sure to use this skill whenever writing browser-side JavaScript that responds to user actions. Not for Node.js server events, WebSocket events, or framework-specific event systems like React synthetic events."
---

# Eventos no JavaScript

> Capture interacoes do usuario via addEventListener, extraia informacoes do objeto event, e previna comportamentos padrao quando necessario.

## Rules

1. **Use addEventListener, nunca atributos inline** — `element.addEventListener('click', handler)` nao `onclick="handler()"`, porque addEventListener permite multiplos listeners e separacao de concerns
2. **Nomeie o parametro de evento como `event`** — nao `e` ou `evt`, porque `event` e auto-documentado e facilita busca no codebase
3. **Chame preventDefault() antes da logica** — coloque no inicio do handler, porque evita que o comportamento padrao execute antes do seu codigo
4. **Use event.target para identificar o elemento clicado** — nao assuma qual elemento disparou, porque com delegacao de eventos o target pode variar
5. **Registre listeners apos o DOM carregar** — use `window.addEventListener('load', ...)` ou DOMContentLoaded, porque elementos podem nao existir ainda

## How to write

### Event listener basico

```javascript
// Observar evento na janela (carregamento da pagina)
window.addEventListener('load', () => {
  console.log('Pagina carregada')
})
```

### Listener de clique com preventDefault

```javascript
addEventListener('click', (event) => {
  event.preventDefault()

  // event.target retorna o elemento clicado
  const clickedElement = event.target
  const clickedText = event.target.textContent
})
```

### Listener em elemento especifico

```javascript
const submitButton = document.querySelector('#submit-btn')

submitButton.addEventListener('click', (event) => {
  event.preventDefault()
  // logica de envio do formulario
})
```

## Example

**Before (comportamento padrao nao tratado):**

```javascript
document.querySelector('button').onclick = function(e) {
  // botao type="submit" dentro de form recarrega a pagina
  console.log(e)
}
```

**After (com esta skill aplicada):**

```javascript
const submitButton = document.querySelector('button')

submitButton.addEventListener('click', (event) => {
  event.preventDefault()
  console.log(event.target)
  console.log(event.target.textContent)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Botao type="submit" dentro de form | Sempre chamar `event.preventDefault()` |
| Precisa saber ONDE o usuario clicou | Usar `event.target` |
| Precisa do texto do elemento clicado | Usar `event.target.textContent` |
| Precisa de coordenadas do clique | Usar `event.clientX` e `event.clientY` |
| Listener global (qualquer clique na pagina) | Usar `addEventListener('click', handler)` direto, sem elemento |
| Listener em elemento especifico | Selecionar elemento primeiro, depois `element.addEventListener(...)` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<button onclick="handleClick()">` | `button.addEventListener('click', handleClick)` |
| `element.onclick = function() {}` | `element.addEventListener('click', () => {})` |
| `function handler(e) { ... }` | `function handler(event) { ... }` |
| Logica antes de `preventDefault()` | `preventDefault()` como primeira linha |
| `addEventListener` antes do DOM existir | Wrapping em `load` ou `DOMContentLoaded` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre eventos, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes