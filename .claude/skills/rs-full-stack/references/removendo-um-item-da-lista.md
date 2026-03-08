---
name: rs-full-stack-removendo-item-da-lista
description: "Applies DOM item removal pattern using closest() and remove() when writing JavaScript list manipulation code. Use when user asks to 'remove item from list', 'delete list element', 'remove DOM element', or 'handle delete click'. Enforces parent traversal with closest() instead of parentElement chains, and total recalculation after removal. Make sure to use this skill whenever implementing delete/remove functionality in vanilla JS lists. Not for React/Vue component unmounting or array-only operations without DOM."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-dom
  tags: [javascript, dom, closest, remove, event-delegation]
---

# Removendo um Item da Lista

> Ao remover um elemento do DOM, use closest() para encontrar o container pai e sempre atualize os totais apos a remocao.

## Rules

1. **Use closest() para encontrar o pai** — `event.target.closest('.item-class')` nao `event.target.parentElement.parentElement`, porque closest() e resiliente a mudancas na estrutura do HTML
2. **Remova o container inteiro, nao apenas o elemento clicado** — remover so a imagem/botao deixa o item orfao na lista
3. **Atualize totais apos remocao** — toda remocao de item deve recalcular contadores e valores totais, porque o estado visual deve refletir o estado real
4. **Delegue o evento no container pai** — em vez de adicionar listener em cada botao de remover, use event delegation no container da lista

## How to write

### Remover item ao clicar

```javascript
// Obtem a li pai do elemento clicado
const item = event.target.closest(".expense")

// Remove o item da lista
item.remove()

// Atualiza os totais (quantidade e valor)
updateTotals()
```

### Padrao completo com event delegation

```javascript
list.addEventListener("click", (event) => {
  if (!event.target.closest(".remove-icon")) return

  const item = event.target.closest(".expense")
  if (!item) return

  item.remove()
  updateTotals()
})
```

## Example

**Before (fragil, depende da estrutura exata do HTML):**
```javascript
removeIcon.addEventListener("click", (event) => {
  event.target.parentElement.parentElement.remove()
  // Se o HTML mudar, quebra silenciosamente
})
```

**After (com esta skill aplicada):**
```javascript
removeIcon.addEventListener("click", (event) => {
  const item = event.target.closest(".expense")
  item.remove()
  updateTotals()
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Remover item de lista com totais | Chamar funcao de atualizacao apos remove() |
| Botao de remover dentro de estrutura aninhada | Usar closest() com a classe do container |
| Lista dinamica com itens adicionados em runtime | Usar event delegation no container pai |
| Remocao com confirmacao | Adicionar confirm() antes do remove() |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `event.target.parentElement.parentElement.remove()` | `event.target.closest(".expense").remove()` |
| Remover sem atualizar totais | `item.remove(); updateTotals()` |
| Listener individual em cada botao de remover | Event delegation no container da lista |
| `item.innerHTML = ""` para "remover" | `item.remove()` para remover do DOM |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| `closest()` retorna null | Seletor CSS nao corresponde a nenhum ancestral | Verifique se a classe no seletor bate com o HTML |
| Totais nao atualizam apos remocao | Falta chamada de `updateTotals()` apos `remove()` | Adicione `updateTotals()` logo apos `item.remove()` |
| Clique no icone nao funciona | Listener adicionado antes do elemento existir no DOM | Use event delegation no container pai |
| Remove apenas o icone, nao o item inteiro | Usando `event.target.remove()` em vez de `closest()` | Use `event.target.closest(".expense").remove()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre closest(), event delegation e atualizacao de estado
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-removendo-um-item-da-lista/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-removendo-um-item-da-lista/references/code-examples.md)
