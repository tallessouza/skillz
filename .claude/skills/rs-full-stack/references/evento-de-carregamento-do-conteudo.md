---
name: rs-full-stack-evento-carregamento-conteudo
description: "Applies DOMContentLoaded event pattern for dynamic HTML content loading in vanilla JavaScript projects. Use when user asks to 'load content dynamically', 'render elements on page load', 'replace static HTML with JavaScript', 'listen for DOM ready', or 'initialize page content'. Ensures proper event binding, module separation, and dynamic rendering instead of hardcoded HTML. Make sure to use this skill whenever generating vanilla JS that needs to run after DOM is ready. Not for framework-based apps (React, Vue, Angular) that handle lifecycle internally."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-dom
  tags: [javascript, dom, events, DOMContentLoaded, modules]
---

# Evento de Carregamento do Conteudo

> Conteudo dinamico deve ser carregado via JavaScript no evento DOMContentLoaded, nunca hardcoded no HTML.

## Rules

1. **Use `DOMContentLoaded` para inicializar conteudo** — `document.addEventListener("DOMContentLoaded", callback)`, porque garante que o DOM esta pronto antes de manipular elementos
2. **Escreva `DOMContentLoaded` corretamente** — e `loaded` no final (DOMContent**Loaded**), porque errar a grafia causa falha silenciosa sem erro no console
3. **Separe o listener de load em modulo proprio** — crie `modules/load.js` separado do `submit.js`, porque o evento de carregamento nao e responsabilidade do formulario
4. **Comente HTML estatico ao invés de deletar** — mantenha um exemplo por secao como referencia, porque facilita entender a estrutura original
5. **Carregue horarios considerando o momento atual** — filtre horarios passados antes de renderizar, porque nao faz sentido agendar para um horario que ja passou
6. **Importe modulos com extensao explicita** — `import "./modules/load.js"` com `.js`, porque sem extensao o bundler pode falhar

## How to write

### Modulo de carregamento (load.js)

```javascript
// modules/load.js — responsavel pelo evento de DOM pronto
document.addEventListener("DOMContentLoaded", () => {
  // Carregar conteudo dinamico aqui
  // Ex: renderizar horarios disponiveis filtrados
})
```

### Import no main.js

```javascript
import "./modules/submit.js"
import "./modules/load.js"
```

### Comentar HTML estatico mantendo referencia

```html
<ul>
  <!-- Horarios carregados dinamicamente via JavaScript -->
  <!-- Exemplo de estrutura:
  <li class="hour" data-period="morning">
    <button>09:00</button>
  </li>
  -->
</ul>
```

## Example

**Before (horarios fixos no HTML):**
```html
<header>Manha</header>
<ul>
  <li><button>07:00</button></li>
  <li><button>08:00</button></li>
  <li><button>09:00</button></li>
</ul>
<header>Tarde</header>
<ul>
  <li><button>13:00</button></li>
  <li><button>14:00</button></li>
</ul>
```

**After (carregamento dinamico):**
```javascript
// modules/load.js
document.addEventListener("DOMContentLoaded", () => {
  const now = new Date()
  const currentHour = now.getHours()

  openingHours.forEach((hour) => {
    if (isToday && hour <= currentHour) return // pula horarios passados

    const li = document.createElement("li")
    li.classList.add("hour")
    const button = document.createElement("button")
    button.textContent = `${String(hour).padStart(2, "0")}:00`
    li.appendChild(button)
    container.appendChild(li)
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Conteudo depende de logica (filtro, data, estado) | Renderize via JS no DOMContentLoaded |
| Conteudo e puramente estatico e nunca muda | Pode manter no HTML |
| Evento nao dispara | Verifique a grafia: `DOMContentLoaded` (com "ed") |
| Modulo nao executa | Verifique se importou no `main.js` com extensao `.js` |
| Removendo HTML estatico | Comente com 1 exemplo por secao em vez de deletar tudo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `DOMContentLoad` (sem "ed") | `DOMContentLoaded` |
| Logica de load dentro de `submit.js` | Modulo separado `modules/load.js` |
| Horarios fixos no HTML quando dependem de filtro | Renderizacao dinamica via JavaScript |
| `import "./modules/load"` (sem extensao) | `import "./modules/load.js"` |
| Deletar todo HTML estatico sem referencia | Comentar mantendo 1 exemplo por secao |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Evento nao dispara | Grafia errada: `DOMContentLoad` sem "ed" | Corrigir para `DOMContentLoaded` |
| Modulo nao executa | Import sem extensao `.js` | Usar `import "./modules/load.js"` com extensao |
| Elementos nao encontrados no DOM | Script executando antes do DOM carregar | Envolver logica dentro do callback de `DOMContentLoaded` |
| Conteudo duplicado na pagina | HTML estatico e dinamico coexistindo | Comentar HTML estatico antes de renderizar via JS |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de modulos e evento DOMContentLoaded
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes