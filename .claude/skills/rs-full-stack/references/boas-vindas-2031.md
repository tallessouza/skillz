---
name: rs-full-stack-boas-vindas-2031
description: "Demonstrates the approach of adding JavaScript interactivity to existing HTML and CSS projects. Use when user asks to 'add JavaScript to a page', 'make a static page interactive', 'add behavior to HTML', or 'bring a page to life with JS'. Enforces the pattern of keeping HTML/CSS structure separate and layering JavaScript on top. Make sure to use this skill whenever adding JS to a pre-existing static project. Not for creating projects from scratch, not for CSS-only animations, not for backend JavaScript or Node.js."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript
  tags: [javascript, html, css, interactivity, dom, events, separation-of-concerns]
---

# Adicionando JavaScript a Projetos HTML/CSS

> Ao adicionar JavaScript a um projeto existente, mantenha a estrutura HTML/CSS intacta e adicione comportamento como uma camada separada.

## Rules

1. **Mantenha separacao de responsabilidades** — HTML define estrutura, CSS define apresentacao, JavaScript define comportamento, porque misturar responsabilidades cria codigo impossivel de manter
2. **Nao modifique HTML/CSS existente sem necessidade** — adicione classes/IDs apenas quando JavaScript precisa de um ponto de acesso, porque cada mudanca no HTML pode quebrar estilos existentes
3. **Aplique fundamentos antes de frameworks** — use JavaScript puro (DOM manipulation, eventos, funcoes) antes de adicionar bibliotecas, porque fundamentos solidos tornam qualquer framework trivial de aprender
4. **Desenvolva incrementalmente** — adicione uma funcionalidade por vez e teste antes de seguir, porque bugs acumulados sao exponencialmente mais dificeis de encontrar

## How to write

### Conectando JavaScript ao HTML

```html
<!-- Sempre no final do body, ou com defer -->
<script src="./main.js" defer></script>
```

### Selecionando elementos existentes

```javascript
// Selecione pelo seletor mais especifico disponivel
const submitButton = document.querySelector('#submit-button')
const menuItems = document.querySelectorAll('.menu-item')
```

### Adicionando comportamento

```javascript
// Adicione event listeners sem modificar o HTML
submitButton.addEventListener('click', () => {
  validateForm()
})
```

## Example

**Before (projeto estatico, sem interatividade):**
```html
<button class="toggle-menu">Menu</button>
<nav class="menu hidden">
  <a href="#home">Home</a>
  <a href="#about">Sobre</a>
</nav>
```

**After (com JavaScript adicionado como camada):**
```javascript
const toggleButton = document.querySelector('.toggle-menu')
const menu = document.querySelector('.menu')

toggleButton.addEventListener('click', () => {
  menu.classList.toggle('hidden')
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto tem HTML/CSS prontos | Adicione JS como arquivo separado, nao inline |
| Precisa selecionar elemento | Use classe/ID existente antes de criar novo |
| Funcionalidade complexa | Quebre em funcoes pequenas, teste cada uma |
| Primeiro projeto JS | Foque nos fundamentos: DOM, eventos, funcoes |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `<button onclick="...">` | `element.addEventListener('click', handler)` |
| Reescrever HTML para acomodar JS | Usar seletores que funcionem com HTML existente |
| Adicionar jQuery para tarefas simples | Usar JavaScript puro para DOM basico |
| Colocar `<script>` no `<head>` sem defer | `<script src="main.js" defer>` ou antes de `</body>` |


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **JavaScript file not loading** | Verify the `<script>` tag uses `defer` or is placed before `</body>`, and the `src` path matches the actual file location. |
| **Event listener not firing** | Confirm the DOM element exists when the script runs — use `defer` or `DOMContentLoaded` to ensure the DOM is ready. |
| **Styles break after adding JS** | Ensure JavaScript only toggles CSS classes instead of modifying inline styles directly, preserving the existing stylesheet. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de responsabilidades e abordagem incremental
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de adicionar JS a projetos estaticos