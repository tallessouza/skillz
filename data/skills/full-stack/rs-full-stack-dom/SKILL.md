---
name: rs-full-stack-dom
description: "Applies DOM tree structure knowledge when writing JavaScript that interacts with HTML documents. Use when user asks to 'manipulate the DOM', 'access HTML elements', 'modify page content', 'traverse nodes', or 'understand DOM structure'. Ensures correct mental model of document-node-element hierarchy. Make sure to use this skill whenever generating code that reads or writes to the DOM. Not for CSS styling, server-side rendering, or virtual DOM frameworks like React."
---

# DOM — Document Object Model

> O DOM e uma representacao em arvore dos objetos que compoem a estrutura e o conteudo de um documento HTML, acessivel e manipulavel via JavaScript.

## Key concept

O browser le o HTML e constroi uma arvore de nos (nodes) e objetos. Essa arvore e o DOM. Cada tag HTML vira um no, cada texto dentro de uma tag vira um no filho do tipo texto. JavaScript nao manipula o HTML diretamente — manipula o DOM, que e a representacao viva do documento na memoria.

Analogia: HTML e a planta da casa. O DOM e a casa construida. JavaScript reforma a casa, nao a planta.

## Decision framework

| Quando voce encontrar | Aplique |
|----------------------|---------|
| Precisa ler conteudo da pagina | Acesse o no correspondente na arvore DOM |
| Precisa alterar conteudo visivel | Modifique o no do DOM (nao o arquivo HTML) |
| Precisa entender hierarquia | Pense em parent → children (arvore) |
| Precisa encontrar um elemento | Use metodos de busca no document (raiz da arvore) |

## How to think about it

### Estrutura da arvore

```
document
  └── html (root element)
        ├── head
        │     └── title
        │           └── "Meu Site" (text node)
        └── body
              ├── h1
              │     └── "Ola" (text node)
              └── p
                    └── "E bom ter voce por aqui" (text node)
```

Cada nivel e um no. Nos tem relacoes: **parent** (pai), **children** (filhos), **siblings** (irmaos). `head` e `body` sao siblings, ambos children de `html`.

### Tipos de nos

| Tipo | Exemplo | nodeType |
|------|---------|----------|
| Element node | `<div>`, `<p>`, `<h1>` | 1 |
| Text node | texto dentro de uma tag | 3 |
| Document node | o proprio `document` | 9 |

### Tamanho da arvore nao importa

Uma pagina complexa tera centenas de nos. A forma de manipular via JavaScript e a mesma independente do tamanho da arvore — os metodos de acesso e modificacao nao mudam.

## Common misconceptions

| Pensam que | Realidade |
|-----------|-----------|
| JavaScript edita o HTML | JavaScript edita o DOM (representacao em memoria). O arquivo HTML original nao muda |
| DOM e o HTML | HTML e o documento fonte. DOM e a arvore construida pelo browser a partir dele |
| Muitos nos = problema | Quantidade de nos nao muda a API. A manipulacao funciona igual com 5 ou 500 nos |
| `document` e o `<html>` | `document` e o no raiz acima de tudo. `<html>` e o root element, filho de `document` |

## When to apply

- Sempre que escrever JavaScript que interage com elementos da pagina
- Ao debugar por que um elemento nao aparece ou nao responde a eventos
- Ao decidir como estruturar HTML pensando em como sera acessado via JS
- Ao usar `document.querySelector`, `getElementById`, ou qualquer metodo de travessia

## Limitations

- O DOM e especifico do browser — nao existe em Node.js (sem bibliotecas como jsdom)
- Frameworks como React abstraem o DOM com virtual DOM — a manipulacao direta e rara nesses contextos
- Performance pode degradar com manipulacoes excessivas do DOM real (reflows/repaints)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes