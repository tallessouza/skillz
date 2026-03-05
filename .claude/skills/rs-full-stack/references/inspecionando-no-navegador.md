---
name: rs-full-stack-inspecionando-no-navegador
description: "Applies DOM inspection and browser DevTools knowledge when working with HTML, CSS, and JavaScript. Use when user asks to 'inspect element', 'debug DOM', 'find element in page', 'manipulate DOM', or 'understand DOM structure'. Guides correct mental model of DOM as a tree hierarchy for element selection and manipulation. Make sure to use this skill whenever explaining DOM concepts or writing DOM manipulation code. Not for CSS styling, network debugging, or performance profiling."
---

# Inspecionando no Navegador — DOM como Árvore

> O DOM é uma estrutura de árvore hierárquica onde cada elemento HTML é um nó acessível e manipulável via JavaScript.

## Key concept

O navegador transforma o HTML em uma estrutura de árvore chamada DOM (Document Object Model). Cada tag HTML vira um **nó** nessa árvore, e nós existem **dentro** de outros nós, criando uma hierarquia pai-filho. Entender essa hierarquia é pré-requisito para qualquer manipulação com JavaScript.

```
html
├── head
└── body
    └── main
        ├── h1
        ├── form
        │   ├── input
        │   └── button
        └── ul
            ├── li
            └── li
```

## Decision framework

| Quando você encontra | Aplique |
|---------------------|---------|
| Precisa encontrar um elemento | Pense na hierarquia: pai → filho → neto |
| Elemento não aparece no JS | Verifique se está no DOM via aba Elements do DevTools |
| Precisa entender a estrutura | Inspecione com botão direito → Inspecionar |
| Hover no DevTools destaca elemento | Use isso para confirmar que selecionou o nó correto |

## How to inspect

### Abrindo o DevTools
1. Botão direito em qualquer lugar da página → **Inspecionar**
2. Aba **Elements** mostra a árvore DOM completa
3. Expandir/recolher nós para navegar na hierarquia
4. Passar o mouse sobre um nó no DevTools destaca o elemento na página

### Relação com JavaScript

```javascript
// Cada nó do DOM é acessível via JavaScript
const main = document.querySelector('main')
const heading = main.querySelector('h1')
const form = document.querySelector('form')
const input = form.querySelector('input')
const list = document.querySelector('ul')
const items = list.querySelectorAll('li')
```

## Heuristics

| Situação | Faça |
|----------|------|
| Não sabe qual seletor usar | Inspecione o elemento no DevTools, observe a hierarquia |
| JavaScript não encontra elemento | Confirme que o elemento existe no DOM via Elements |
| Precisa entender nesting | Recolha os nós no DevTools e expanda um por um |
| Quer ver qual elemento está selecionando | Passe o mouse sobre o nó — o navegador destaca visualmente |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| DOM é o mesmo que HTML | DOM é a representação em árvore que o navegador cria A PARTIR do HTML |
| Só dá pra inspecionar no Chrome | Principais navegadores têm DevTools (Firefox, Edge, Safari) |
| Console é a única ferramenta útil | Aba Elements é essencial para entender estrutura e hierarquia |
| Elementos existem soltos na página | Todo elemento é um nó dentro de outro nó (hierarquia pai-filho) |

## When to apply

- Antes de escrever qualquer código de manipulação DOM
- Quando um `querySelector` retorna `null` inesperadamente
- Para entender a estrutura de uma página antes de adicionar JavaScript
- Para debugar por que um evento ou estilo não está funcionando

## Limitations

- DevTools mostra o DOM atual (pode diferir do HTML original se JS já modificou)
- Elementos criados dinamicamente só aparecem após execução do JS
- Esta skill cobre inspeção e conceito — manipulação avançada é outro tópico

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre DOM como árvore, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-inspecionando-no-navegador/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-inspecionando-no-navegador/references/code-examples.md)
