---
name: rs-full-stack-capturando-clique-remover
description: "Applies event delegation pattern to capture clicks on specific elements within a list. Use when user asks to 'remove item from list', 'delete list item on click', 'handle click on icon inside list', 'event delegation', or 'capture click on child element'. Ensures correct use of addEventListener on parent container with target class verification instead of attaching listeners to each item. Make sure to use this skill whenever implementing click-to-remove in dynamic lists. Not for form submission, keyboard events, or drag-and-drop interactions."
---

# Capturando Clique para Remover Item de Lista

> Delegue o evento de clique ao container pai e verifique a classe do target para identificar qual elemento especifico foi clicado.

## Rules

1. **Adicione o listener no container pai, nao em cada item** — `list.addEventListener("click", ...)` nao `item.addEventListener(...)`, porque itens sao dinamicos e novos itens nao teriam o listener
2. **Use `event.target.classList.contains()` para filtrar o clique** — porque qualquer area dentro da lista dispara o evento, e voce precisa saber se foi especificamente no icone de remover
3. **Identifique elementos clicaveis por classe CSS semantica** — use classes como `remove-icon` para marcar o elemento que dispara a acao, porque isso desacopla comportamento de estrutura visual
4. **Coloque a logica de acao dentro do if de verificacao** — so execute a remocao quando `classList.contains` confirmar o target correto, porque cliques em nome, categoria ou espacos vazios da lista nao devem disparar nada

## How to write

### Event delegation com verificacao de classe

```javascript
// Listener no container pai (expense list)
expenseList.addEventListener("click", (event) => {
  // Verifica se o elemento clicado tem a classe do icone de remover
  if (event.target.classList.contains("remove-icon")) {
    // Aqui executa a logica de remocao
    console.log("Clicou no icone de remover")
  }
})
```

### Selecionando o container pai

```javascript
// Selecione a lista uma vez, no topo do script
const expenseList = document.querySelector("ul.expense-list")
```

## Example

**Before (listener em cada item — fragil com itens dinamicos):**
```javascript
// Quebra quando novos itens sao adicionados depois
document.querySelectorAll(".remove-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    // remover item
  })
})
```

**After (event delegation no pai — funciona com itens dinamicos):**
```javascript
expenseList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-icon")) {
    // remover item — funciona para qualquer item, mesmo adicionado depois
  }
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Lista com itens adicionados dinamicamente | Event delegation no container pai |
| Precisa saber qual item foi clicado | `event.target` + verificacao de classe |
| Multiplas areas clicaveis no mesmo item | Um `if` / `else if` por classe no mesmo listener |
| Clique pode cair no filho do elemento alvo | Use `event.target.closest(".remove-icon")` como fallback |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `icon.onclick = function()` em cada item | `list.addEventListener("click", ...)` no pai |
| `if (event.target.tagName === "IMG")` | `if (event.target.classList.contains("remove-icon"))` — classe e semantica, tag e estrutura |
| Listener sem verificacao de target | Sempre filtre com `classList.contains` antes de agir |
| `document.addEventListener("click", ...)` | Listener no container mais proximo — evita capturar cliques fora da lista |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre event delegation, bubbling e por que o clique propaga
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-capturando-o-clique-para-remover-uma-despesa/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-capturando-o-clique-para-remover-uma-despesa/references/code-examples.md)
