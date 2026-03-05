---
name: rs-full-stack-renderizando-horarios
description: "Applies dynamic list rendering with conditional CSS classes when building time slots, schedules, or availability UIs. Use when user asks to 'render a list', 'show available times', 'create a schedule view', 'add conditional classes', or 'build a booking interface'. Enforces forEach for side-effect rendering, destructuring in callbacks, conditional classList logic, and DOM append patterns. Make sure to use this skill whenever generating UI code that displays items with available/unavailable states. Not for React/Vue component rendering, backend logic, or API design."
---

# Renderizando Listas com Estado Condicional

> Ao renderizar listas no DOM, use forEach para side-effects, desestruture no callback, e aplique classes CSS condicionalmente baseado no estado de cada item.

## Rules

1. **Use forEach para renderizar, não map** — quando o objetivo é inserir elementos no DOM (side-effect), forEach é semanticamente correto porque não precisa devolver um novo array
2. **Desestruture no callback** — `({ hour, available })` direto no parâmetro, porque evita repetição de `item.hour`, `item.available` e torna o código legível
3. **Crie elementos com createElement** — `document.createElement('li')` em vez de innerHTML, porque é mais seguro contra XSS e mais performático para listas
4. **Separe classe base de classe de estado** — adicione a classe estrutural (`hour`) separada da classe condicional (`hour-available` / `hour-unavailable`), porque são responsabilidades diferentes
5. **Use ternário para classes condicionais** — `available ? 'hour-available' : 'hour-unavailable'` direto no classList.add, porque é conciso e legível para dois estados
6. **Use append, não appendChild** — `parent.append(child)` é a API moderna e aceita múltiplos nós

## How to write

### Renderização de lista com estado condicional

```javascript
const list = document.getElementById("hours")

opening.forEach(({ hour, available }) => {
  const li = document.createElement("li")
  li.classList.add("hour")
  li.classList.add(available ? "hour-available" : "hour-unavailable")
  li.textContent = hour
  list.append(li)
})
```

### Seleção do container antes do loop

```javascript
// Selecione o container UMA vez fora do loop
const container = document.getElementById("hours")

// Depois itere e adicione
items.forEach(({ hour, available }) => {
  const li = document.createElement("li")
  // ...
  container.append(li)
})
```

## Example

**Before (common mistake):**
```javascript
for (let i = 0; i < opening.length; i++) {
  const item = opening[i]
  const li = document.createElement("li")
  li.className = "hour " + (item.available == true ? "hour-available" : "hour-unavailable")
  li.innerHTML = item.hour
  document.getElementById("hours").appendChild(li)
}
```

**After (with this skill applied):**
```javascript
const hours = document.getElementById("hours")

opening.forEach(({ hour, available }) => {
  const li = document.createElement("li")
  li.classList.add("hour")
  li.classList.add(available ? "hour-available" : "hour-unavailable")
  li.textContent = hour
  hours.append(li)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Renderizar lista no DOM | forEach com createElement + append |
| Dois estados visuais (sim/não) | Ternário no classList.add |
| Três ou mais estados visuais | Map de estado → classe CSS |
| Lista grande (100+ itens) | DocumentFragment antes do append |
| Objeto com 2-3 props usadas | Desestruturar no callback |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `li.innerHTML = hour` | `li.textContent = hour` |
| `document.getElementById("hours")` dentro do loop | Selecionar uma vez fora do loop |
| `li.className = "hour hour-available"` | `li.classList.add("hour")` separado |
| `opening.map(...)` sem usar retorno | `opening.forEach(...)` para side-effects |
| `if (available) { li.classList.add(...) } else { li.classList.add(...) }` | Ternário inline no classList.add |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre forEach vs map, classList vs className, e textContent vs innerHTML
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e cenários adicionais