---
name: rs-full-stack-atributos-globais-1
description: "Applies HTML global attributes knowledge when writing HTML markup. Use when user asks to 'create HTML elements', 'add attributes', 'improve accessibility', or 'write semantic HTML'. Ensures correct usage of class, id, data-*, hidden, title, tabindex, lang, and aria-* attributes on any HTML element. Make sure to use this skill whenever generating HTML that needs global attributes. Not for CSS styling, JavaScript logic, or framework-specific component props."
---

# Atributos Globais HTML

> Atributos globais podem ser aplicados a qualquer elemento HTML, independente da tag — use-os para acessibilidade, identificacao, e manipulacao de elementos.

## Key concept

Atributos globais sao atributos que funcionam em QUALQUER elemento HTML. Diferente de atributos especificos (como `src` em `<img>` ou `href` em `<a>`), atributos globais nao alteram a estrutura ou comportamento visual do elemento — eles adicionam metadados, acessibilidade, identificacao e hooks para CSS/JS.

## Decision framework

| Quando voce precisa | Use este atributo global |
|---------------------|------------------------|
| Identificar elemento unico | `id` |
| Agrupar elementos para estilo/JS | `class` |
| Armazenar dados customizados | `data-*` |
| Esconder elemento sem remover do DOM | `hidden` |
| Tooltip nativo ao passar o mouse | `title` |
| Controlar ordem de navegacao por teclado | `tabindex` |
| Indicar idioma do conteudo | `lang` |
| Melhorar acessibilidade para leitores de tela | `aria-*` |
| Tornar qualquer elemento editavel | `contenteditable` |
| Aplicar estilo inline (ultimo recurso) | `style` |

## How to think about it

### Atributos globais vs atributos especificos

Atributos especificos definem o COMPORTAMENTO da tag — `src` diz de onde a imagem vem, `href` diz para onde o link vai. Atributos globais sao transversais: qualquer tag aceita, porque nao mudam o que a tag FAZ, mas adicionam capacidades extras.

### Aprendizado sob demanda

Nao memorize todos os atributos globais de uma vez. Aprenda os fundamentais (`id`, `class`, `data-*`, `hidden`, `title`, `tabindex`, `lang`, `aria-*`) e consulte a referencia MDN quando precisar dos demais. O uso pratico ensina melhor que memorizacao.

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Todo atributo funciona em toda tag | Atributos globais sim, mas atributos especificos so funcionam nas tags que os definem |
| `hidden` remove o elemento da pagina | `hidden` esconde visualmente mas o elemento continua no DOM |
| `title` substitui acessibilidade | `title` e tooltip visual; para acessibilidade real, use `aria-*` |
| Preciso aprender todos antes de comecar | Aprenda os fundamentais, o resto vem com a pratica |

## When to apply

- Ao criar qualquer elemento HTML que precisa de identificacao (`id`, `class`)
- Ao armazenar metadados no elemento (`data-*`)
- Ao melhorar acessibilidade (`aria-*`, `lang`, `tabindex`)
- Ao controlar visibilidade sem JS (`hidden`)

## Anti-patterns

| Nunca faca | Faca em vez disso |
|-----------|-------------------|
| `<div onclick="...">` sem `tabindex` e `role` | Adicione `tabindex="0"` e `role="button"` para acessibilidade |
| `id` duplicado na mesma pagina | Use `class` para multiplos elementos, `id` para unico |
| `data-` para dados que ja tem atributo semantico | Use o atributo semantico proprio (`lang`, `title`, etc.) |
| `style="display:none"` para esconder | Use `hidden` — semantico e acessivel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-atributos-globais-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-atributos-globais-1/references/code-examples.md)
