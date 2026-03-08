---
name: rs-full-stack-alterando-estilos-1
description: "Applies DOM style manipulation patterns when writing JavaScript that changes element appearance. Use when user asks to 'add a class', 'toggle class', 'change element style', 'show/hide element', 'manipulate CSS with JS', or 'style DOM elements'. Covers classList.add/remove/toggle and element.style properties. Make sure to use this skill whenever generating JS code that modifies visual appearance of HTML elements. Not for CSS-only styling, animations libraries, or CSS-in-JS frameworks like styled-components."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [javascript, dom, classList, style, manipulation]
---

# Manipulacao de Estilos via DOM

> Manipule estilos de elementos usando classList para classes CSS e element.style para propriedades individuais.

## Rules

1. **Prefira classList sobre style direto** — use `classList.add/remove/toggle` com classes CSS pre-definidas, porque mantem separacao de responsabilidades (CSS cuida do estilo, JS cuida da logica)
2. **Use toggle para estados binarios** — `classList.toggle` adiciona se nao existe e remove se existe, porque elimina logica condicional manual para show/hide, abrir/fechar, ativo/inativo
3. **Use style apenas para valores dinamicos** — `element.style.backgroundColor = valor` apenas quando o valor vem de calculo ou input do usuario, porque valores fixos pertencem ao CSS
4. **Propriedades CSS em camelCase no JS** — `background-color` vira `backgroundColor`, `font-size` vira `fontSize`, porque o JS nao aceita hifens como nomes de propriedade

## How to write

### Adicionar/remover classes

```javascript
const input = document.querySelector('#name')

// Adicionar classe de erro
input.classList.add('inputError')

// Remover classe de erro
input.classList.remove('inputError')
```

### Toggle para alternar estados

```javascript
const modal = document.querySelector('#modal')

// Se nao tem a classe, adiciona. Se tem, remove.
modal.classList.toggle('visible')
```

### Alterar propriedade CSS diretamente

```javascript
const button = document.querySelector('button')

// Propriedades CSS usam camelCase no JS
button.style.backgroundColor = 'red'
button.style.fontSize = '16px'
```

## Example

**Before (logica condicional manual):**
```javascript
if (modal.classList.contains('visible')) {
  modal.classList.remove('visible')
} else {
  modal.classList.add('visible')
}
```

**After (com toggle):**
```javascript
modal.classList.toggle('visible')
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estilo fixo e previsivel (erro, ativo, oculto) | `classList.add/remove/toggle` com classe CSS |
| Valor vem de variavel ou input | `element.style.propriedade = valor` |
| Alternar visibilidade (modal, menu) | `classList.toggle('visible')` |
| Multiplas propriedades de uma vez | Crie uma classe CSS e use `classList.add` |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| `element.style.border = '2px solid red'` (para erro fixo) | `element.classList.add('inputError')` |
| `if/else` para adicionar/remover mesma classe | `element.classList.toggle('classe')` |
| `element.setAttribute('style', '...')` | `element.style.propriedade = valor` |
| `element.style.background-color` (com hifen) | `element.style.backgroundColor` (camelCase) |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `element.style.background-color` dá erro | CSS usa hífens mas JS não aceita | Use camelCase: `element.style.backgroundColor` |
| `classList.toggle` não funciona | Classe CSS não existe no stylesheet | Crie a classe CSS antes de usar toggle |
| Estilo aplicado com JS não é removido | Usou `element.style` que tem prioridade alta (inline) | Prefira `classList.add/remove` com classes CSS pré-definidas |
| `querySelector` retorna null | Elemento não existe no DOM no momento da execução | Mova o script para o final do body ou use `DOMContentLoaded` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes