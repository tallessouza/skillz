---
name: rs-full-stack-query-selector-1
description: "Applies correct DOM querySelector patterns when writing JavaScript/TypeScript code. Use when user asks to 'select an element', 'access the DOM', 'get element by class', 'query selector', or any DOM manipulation task. Enforces CSS-style selectors with # for ID and . for class, querySelector vs querySelectorAll distinction. Make sure to use this skill whenever generating DOM access code. Not for React refs, virtual DOM, or framework-specific selectors."
---

# Query Selector

> Ao acessar elementos no DOM, use querySelector com seletores CSS — `#` para ID, `.` para classe — e escolha entre querySelector (primeiro) e querySelectorAll (todos).

## Rules

1. **Use seletores CSS dentro do querySelector** — `#meuId` para ID, `.minhaClasse` para classe, porque a sintaxe e identica ao CSS e elimina ambiguidade
2. **querySelector retorna apenas o primeiro elemento** — sempre o primeiro match, porque e o comportamento padrao do metodo
3. **querySelectorAll retorna todos os elementos** — use quando precisar de multiplos elementos, porque retorna um NodeList completo
4. **Prefira querySelector sobre getElementById/getElementsByClassName** — porque unifica a sintaxe de selecao usando padrao CSS, tornando o codigo consistente
5. **Nunca esqueca o prefixo do seletor** — `#` para ID, `.` para classe, porque sem o prefixo o querySelector interpreta como tag name

## How to write

### Selecionar por ID

```javascript
const element = document.querySelector('#guest1')
```

### Selecionar por classe (primeiro elemento)

```javascript
const firstGuest = document.querySelector('.guest')
```

### Selecionar por classe (todos os elementos)

```javascript
const allGuests = document.querySelectorAll('.guest')
```

## Example

**Before (misturando APIs):**

```javascript
const el1 = document.getElementById('guest1')
const el2 = document.getElementsByClassName('guest')
const el3 = document.getElementsByTagName('li')
```

**After (com querySelector unificado):**

```javascript
const guest1 = document.querySelector('#guest1')
const firstGuest = document.querySelector('.guest')
const allGuests = document.querySelectorAll('.guest')
const allItems = document.querySelectorAll('li')
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa de UM elemento por ID | `querySelector('#id')` |
| Precisa de UM elemento por classe | `querySelector('.classe')` — retorna o primeiro |
| Precisa de TODOS por classe | `querySelectorAll('.classe')` — retorna NodeList |
| Precisa por tag | `querySelectorAll('tag')` |
| Seletor composto (CSS) | `querySelector('.container > .item:first-child')` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `document.getElementById('x')` | `document.querySelector('#x')` |
| `document.getElementsByClassName('x')` | `document.querySelectorAll('.x')` |
| `document.querySelector('guest1')` (sem #) | `document.querySelector('#guest1')` |
| `document.querySelector('guest')` (sem .) | `document.querySelector('.guest')` |
| `querySelector('.x')` quando precisa de todos | `querySelectorAll('.x')` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes