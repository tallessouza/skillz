---
name: rs-full-stack-selecionando-agendamento-remover
description: "Applies event delegation pattern to identify clicked elements inside lists for deletion. Use when user asks to 'add delete button', 'remove item from list', 'cancel appointment', 'handle click on icon inside list', or 'implement item selection for removal'. Covers querySelectorAll, event.target.classList.contains, closest(), and dataset extraction. Make sure to use this skill whenever implementing click-to-delete in lists with multiple periods/groups. Not for HTTP DELETE requests, modal components, or drag-to-delete interactions."
---

# Selecionando Elemento para Remover via Event Delegation

> Capture cliques em listas agrupadas usando event delegation, identifique o alvo exato com classList.contains, e extraia o ID do item pai com closest() e dataset.

## Rules

1. **Selecione os containers, nao os itens individuais** — use `querySelectorAll` nos agrupadores (periodos, secoes), porque um unico listener por grupo cobre todos os itens dentro dele
2. **Verifique o alvo exato do clique** — use `event.target.classList.contains('classe-do-icone')`, porque o usuario pode clicar em qualquer lugar da lista e so o icone deve disparar a acao
3. **Navegue ao pai com closest()** — use `event.target.closest('li')` para obter o elemento pai, porque o icone clicado e filho do item que queremos identificar
4. **Extraia dados via dataset** — use `item.dataset.id` para obter o identificador, porque data attributes sao a forma semantica de associar dados a elementos DOM
5. **Valide antes de agir** — verifique `if (id)` antes de prosseguir, porque elementos podem nao ter o atributo esperado
6. **Confirme acoes destrutivas** — use `confirm()` antes de deletar, porque cliques acidentais acontecem

## How to write

### Selecionar containers e adicionar listeners

```javascript
const periods = document.querySelectorAll(".schedule-period")

periods.forEach((period) => {
  period.addEventListener("click", (event) => {
    if (event.target.classList.contains("cancel-icon")) {
      const item = event.target.closest("li")
      const { id } = item.dataset

      if (id) {
        const isConfirmed = confirm("Tem certeza que deseja cancelar?")
        if (isConfirmed) {
          // proceder com remocao
        }
      }
    }
  })
})
```

### Estrutura HTML esperada

```html
<ul class="schedule-period">
  <li data-id="123">
    <span>09:00 - João</span>
    <img class="cancel-icon" src="cancel.svg" />
  </li>
</ul>
```

## Example

**Before (listener em cada item individualmente):**
```javascript
document.querySelectorAll(".cancel-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    const id = icon.parentElement.getAttribute("data-id")
    deleteItem(id)
  })
})
```

**After (event delegation no container):**
```javascript
const periods = document.querySelectorAll(".schedule-period")

periods.forEach((period) => {
  period.addEventListener("click", (event) => {
    if (!event.target.classList.contains("cancel-icon")) return

    const item = event.target.closest("li")
    const { id } = item.dataset

    if (!id) return

    const isConfirmed = confirm("Tem certeza que deseja cancelar o agendamento?")
    if (isConfirmed) {
      removeSchedule(id)
    }
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Lista com itens dinamicos (adicionados/removidos) | Event delegation no container pai |
| Multiplos grupos de listas (manha, tarde, noite) | `querySelectorAll` nos grupos, `forEach` com listener |
| Precisa saber ONDE clicou dentro do item | `event.target.classList.contains()` |
| Precisa do item pai a partir do icone clicado | `event.target.closest('li')` ou `closest('[data-id]')` |
| Acao destrutiva (deletar, cancelar) | Sempre `confirm()` antes |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `icon.parentElement.parentElement` (chain fragil) | `event.target.closest('li')` |
| `event.target.id === 'cancel'` (depende de id unico) | `event.target.classList.contains('cancel-icon')` |
| Listener em cada `<li>` individualmente | Delegation no `<ul>` container |
| `deleteItem()` sem confirmacao | `if (confirm(...)) deleteItem()` |
| `item.getAttribute('data-id')` | `item.dataset.id` (API moderna) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre event delegation, closest() e dataset
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes