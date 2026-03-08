---
name: rs-full-stack-eventos-elemento-especifico
description: "Applies DOM event listener patterns on specific elements when writing JavaScript/TypeScript front-end code. Use when user asks to 'add event listener', 'handle scroll', 'detect end of list', 'scroll to top', 'click on button', 'listen for events on element', or 'prevent default behavior'. Covers addEventListener on queried elements, scroll tracking, scrollTo with smooth behavior, and preventDefault. Make sure to use this skill whenever attaching DOM events to specific elements. Not for global/window events, framework-specific event systems (React onClick, Vue @click), or backend code."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-dom
  tags: [javascript, dom, events, scroll, querySelector]
---

# Eventos em Elemento Específico

> Adicione event listeners em elementos selecionados via querySelector, nunca no document inteiro, quando a interação pertence a um elemento específico.

## Rules

1. **Selecione o elemento antes de escutar** — use `document.querySelector()` para obter a referência, depois chame `.addEventListener()` nela, porque eventos no document capturam cliques em qualquer lugar
2. **Use `scrollTop` do elemento, não do event** — acesse `element.scrollTop` para saber a distância do topo, porque o objeto event não expõe essa propriedade diretamente
3. **Use `scrollTo({ top, behavior })` para navegação suave** — passe `behavior: 'smooth'` para animação, porque sem isso o salto é instantâneo e brusco
4. **Sempre chame `event.preventDefault()`** — em botões dentro de forms ou links, desabilite o comportamento padrão para evitar reload da página
5. **Omita o parâmetro `event` quando não usar** — se a função callback não precisa das informações do evento, não declare o parâmetro, porque mantém o código limpo

## How to write

### Observar scroll em elemento específico

```javascript
const list = document.querySelector("ul")

list.addEventListener("scroll", () => {
  console.log(list.scrollTop)
})
```

### Detectar fim da lista e voltar ao topo

```javascript
const list = document.querySelector("ul")

list.addEventListener("scroll", () => {
  if (list.scrollTop > 300) {
    list.scrollTo({ top: 0, behavior: "smooth" })
  }
})
```

### Clique em botão específico com preventDefault

```javascript
const button = document.querySelector("button")

button.addEventListener("click", (event) => {
  event.preventDefault()
  console.log("clicou")
})
```

## Example

**Before (evento no document inteiro):**
```javascript
document.addEventListener("click", (event) => {
  console.log("clicou em algum lugar")
})
```

**After (evento no elemento específico):**
```javascript
const button = document.querySelector("button")

button.addEventListener("click", (event) => {
  event.preventDefault()
  console.log("clicou no botão")
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa saber posição de scroll de uma lista | Leia `element.scrollTop` no callback de `"scroll"` |
| Precisa levar usuário ao topo | Use `element.scrollTo({ top: 0, behavior: "smooth" })` |
| Botão dentro de form/link | Sempre `event.preventDefault()` antes da lógica |
| Callback não usa dados do event | Omita o parâmetro `event` da arrow function |
| Múltiplos console.log iguais no DevTools | O browser agrupa com contador ao lado — comportamento normal |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `document.addEventListener("scroll", ...)` quando quer scroll de uma lista | `list.addEventListener("scroll", ...)` |
| `event.scrollTop` | `element.scrollTop` (acesse do elemento, não do event) |
| `list.scrollTo(0, 0)` | `list.scrollTo({ top: 0, behavior: "smooth" })` |
| Botão sem `preventDefault()` dentro de form | `event.preventDefault()` no início do callback |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `Cannot read properties of null` ao adicionar listener | Elemento nao encontrado pelo querySelector | Verificar seletor CSS e garantir que DOM carregou |
| `scrollTop` retorna 0 sempre | Lendo do `event` em vez do elemento | Usar `element.scrollTop`, nao `event.scrollTop` |
| `scrollTo` faz salto brusco | Falta `behavior: 'smooth'` | Usar `element.scrollTo({ top: 0, behavior: 'smooth' })` |
| Clique recarrega a pagina | Botao dentro de form sem `preventDefault` | Adicionar `event.preventDefault()` no handler |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre quando usar eventos específicos vs globais, analogia do scroll e mecânica do event object
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código da aula com variações e cenários reais