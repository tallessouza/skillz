---
name: rs-full-stack-manipulando-conteudo
description: "Enforces correct DOM content manipulation patterns when writing JavaScript that modifies element text or HTML. Use when user asks to 'change element text', 'update DOM content', 'modify innerHTML', 'manipulate DOM', or 'select and change elements'. Applies rules: textContent for full replacement, innerText for visible-only, innerHTML for HTML strings, querySelector chaining for nested targets. Make sure to use this skill whenever generating DOM manipulation code. Not for React/Vue virtual DOM, server-side rendering, or CSS styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-dom
  tags: [javascript, dom, textContent, innerHTML, innerText]
---

# Manipulando Conteudo no DOM

> Ao manipular conteudo de elementos, escolha a propriedade correta (textContent, innerText, innerHTML) com base no que precisa ler ou substituir.

## Rules

1. **Use `textContent` para ler/escrever texto bruto** — inclui conteudo visivel E oculto (display:none), porque acessa o texto no nivel do DOM, ignorando CSS
2. **Use `innerText` para ler apenas conteudo visivel** — respeita `display:none` e outras regras CSS, porque faz layout-aware reading
3. **Use `innerHTML` para ler/escrever HTML como string** — retorna tags filhas como texto HTML, porque opera na estrutura HTML interna
4. **Cuidado: `textContent` substitui TODOS os filhos** — atribuir via `textContent` remove elementos filhos (spans, links, etc), porque troca toda a subarvore por um unico text node
5. **Encadeie seletores para alvos precisos** — `querySelector('#id span')` seleciona o filho, preservando a estrutura pai, porque evita substituicao acidental de elementos irmaos

## How to write

### Ler conteudo de um elemento

```javascript
const guest = document.querySelector('#guest')

// Texto bruto (visivel + oculto)
console.log(guest.textContent)

// Apenas texto visivel (respeita CSS)
console.log(guest.innerText)

// HTML interno como string
console.log(guest.innerHTML)
```

### Atribuir conteudo preservando estrutura

```javascript
// ERRADO: substitui tudo dentro da li, incluindo spans filhas
document.querySelector('#guest').textContent = 'João'

// CORRETO: seleciona a span interna, preserva estrutura
document.querySelector('#guest span').textContent = 'João'
```

## Example

**Before (substituicao destrutiva):**
```html
<li id="guest" class="guest-name">
  <span>Rodrigo</span>
  <span class="hide">0 novas mensagens</span>
</li>
```
```javascript
// Remove AMBAS as spans, substitui por texto puro
document.querySelector('#guest').textContent = 'João'
// Resultado: <li id="guest" class="guest-name">João</li>
```

**After (com seletor encadeado):**
```javascript
// Preserva estrutura, altera apenas o conteudo da primeira span
document.querySelector('#guest span').textContent = 'João'
// Resultado: <li id="guest"><span>João</span><span class="hide">...</span></li>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Ler texto para logica/comparacao | `textContent` (mais rapido, inclui tudo) |
| Exibir ao usuario o que ele ve | `innerText` (respeita display:none) |
| Inserir HTML dinamico | `innerHTML` (cuidado com XSS) |
| Alterar texto de elemento com filhos | Encadeie seletor ate o filho correto |
| Limpar conteudo de container | `element.textContent = ''` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `parent.textContent = 'novo'` quando ha filhos importantes | `parent.querySelector('span').textContent = 'novo'` |
| `innerText` para leitura em batch (lento) | `textContent` para leitura em batch (rapido) |
| `innerHTML = userInput` sem sanitizacao | `textContent = userInput` (seguro contra XSS) |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| textContent removeu elementos filhos | textContent substitui toda a subarvore | Use seletor encadeado para alvo preciso: `querySelector('#id span')` |
| innerText retorna texto diferente do textContent | innerText respeita CSS (display:none) | Use textContent para texto bruto incluindo oculto |
| innerHTML com input do usuario causa XSS | HTML injetado executa scripts | Use textContent para input do usuario (seguro contra XSS) |
| Conteudo atualizado nao aparece na tela | Elemento selecionado errado | Verifique o seletor e inspecione com DevTools |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre visivel vs oculto, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes