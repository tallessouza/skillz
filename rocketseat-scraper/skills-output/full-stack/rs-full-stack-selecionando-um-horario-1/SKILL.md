---
name: rs-full-stack-selecionando-um-horario-1
description: "Applies click-to-select UI pattern when building time/slot selection interfaces with vanilla JavaScript. Use when user asks to 'select an item from a list', 'highlight clicked element', 'toggle active class on click', or 'build a time picker'. Enforces the remove-all-then-add-one pattern for single-selection UIs. Make sure to use this skill whenever implementing click-based selection in lists with CSS class toggling. Not for React/Vue state management, multi-select patterns, or form validation."
---

# Selecao de Horario com Click — Padrao Remove-All-Add-One

> Para selecao unica em listas, remova a classe de todos os itens primeiro, depois adicione apenas ao item clicado.

## Rules

1. **Separe o evento de click em arquivo proprio** — `hours.click.js` nao inline no load, porque mantem responsabilidade unica e facilita manutencao
2. **Adicione evento apenas nos itens disponiveis** — use `querySelectorAll` com a classe de disponivel, porque itens indisponiveis nao devem responder a interacao
3. **Remova a classe de todos antes de adicionar** — mesmo sabendo que so um tera a classe, remova de todos para garantir consistencia, porque evita bugs de estado duplicado
4. **Use classList.remove e classList.add** — nunca manipule className diretamente, porque classList e seguro para multiplas classes no mesmo elemento
5. **Acesse o elemento clicado via event.target** — use o parametro do addEventListener, porque e o elemento real que recebeu o click

## How to write

### Estrutura do modulo de click

```javascript
// hours.click.js — arquivo separado para o evento
export function hoursClick() {
  const availableHours = document.querySelectorAll(".hour-available")

  availableHours.forEach((available) => {
    available.addEventListener("click", (selected) => {
      // Remove a classe hour-selected de todos os itens
      availableHours.forEach((hour) => {
        hour.classList.remove("hour-selected")
      })

      // Adiciona a classe apenas no item clicado
      selected.target.classList.add("hour-selected")
    })
  })
}
```

### Integracao no modulo de load

```javascript
// No hours.load.js, apos renderizar a lista
import { hoursClick } from "./hours.click.js"

// ... codigo que renderiza os horarios ...

// Adiciona o evento de click nos horarios disponiveis
hoursClick()
```

## Example

**Before (sem selecao visual):**
```javascript
// Usuario clica mas nada acontece visualmente
hours.forEach((hour) => {
  hour.addEventListener("click", () => {
    console.log("clicou") // sem feedback visual
  })
})
```

**After (com padrao remove-all-add-one):**
```javascript
const availableHours = document.querySelectorAll(".hour-available")

availableHours.forEach((available) => {
  available.addEventListener("click", (selected) => {
    availableHours.forEach((hour) => {
      hour.classList.remove("hour-selected")
    })
    selected.target.classList.add("hour-selected")
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Selecao unica em lista | Remove-all-add-one com classList |
| Itens indisponiveis na lista | Nao adicione addEventListener neles |
| Precisa do valor selecionado depois | Leia do elemento com a classe `hour-selected` |
| Testando estilo antes de codificar | Adicione a classe manualmente no DevTools para validar o CSS |
| Evento de click em lista dinamica | Chame a funcao de click APOS renderizar os itens |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `element.className = "hour-selected"` | `element.classList.add("hour-selected")` |
| Click em todos os itens (incluindo indisponiveis) | `querySelectorAll(".hour-available")` apenas |
| Logica de click dentro do arquivo de load | Arquivo separado `hours.click.js` |
| Toggle sem remover dos outros | Remove de todos primeiro, depois add no clicado |
| Selecao sem feedback visual | CSS class `hour-selected` com estilo diferenciado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o padrao remove-all-add-one e por que funciona
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes