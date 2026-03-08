---
name: rs-full-stack-seletores-1
description: "Enforces correct CSS selector usage when writing stylesheets. Use when user asks to 'style an element', 'select elements in CSS', 'write CSS rules', 'add a class selector', or 'target HTML elements'. Covers type, id, class, attribute, and universal selectors with correct syntax. Make sure to use this skill whenever generating CSS selectors or reviewing selector usage. Not for CSS properties, layout, animations, or JavaScript DOM queries."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-fundamentals
  tags:
    - css
    - selectors
    - specificity
    - class
    - id
---

# Seletores CSS

> Ao escrever CSS, escolha o seletor correto pelo nivel de especificidade necessario — do mais amplo (universal) ao mais especifico (id).

## Rules

1. **Seletor de tipo usa o nome da tag diretamente** — `p`, `h1`, `div`, porque seleciona TODOS os elementos daquele tipo na pagina
2. **Seletor de id usa `#`** — `#text`, porque o id e um identificador unico no documento
3. **Seletor de classe usa `.`** — `.pink`, porque classes podem ser reutilizadas em multiplos elementos
4. **Seletor de atributo usa `[]`** — `[title]` ou `[title="valor"]`, porque permite selecionar pela presenca ou valor exato de qualquer atributo
5. **Seletor universal e `*`** — aplica para TODOS os elementos da pagina, porque nao filtra nada
6. **Seletores de tipo e classe aplicam a todos que correspondem** — se ha 3 `<p>`, todos recebem o estilo; se 2 elementos tem `.pink`, ambos recebem

## How to write

### Seletor de tipo (element/tag selector)
```css
p {
  color: red;
}
```

### Seletor de id
```css
#text {
  color: red;
}
```

### Seletor de classe
```css
.pink {
  color: pink;
}
```

### Seletor de atributo
```css
/* Todos que tiverem o atributo title */
[title] {
  color: orange;
}

/* Apenas com valor especifico */
[title="texto especifico"] {
  color: orange;
}
```

### Seletor universal
```css
* {
  color: violet;
}
```

## Example

**Before (confusao de sintaxe):**
```css
text { color: red; }       /* Errado: text nao e tag HTML */
.#header { color: blue; }  /* Errado: mistura de seletores */
title { color: green; }    /* Errado: seleciona a tag <title>, nao o atributo */
```

**After (seletores corretos):**
```css
#text { color: red; }       /* Seleciona elemento com id="text" */
.header { color: blue; }    /* Seleciona elementos com class="header" */
[title] { color: green; }   /* Seleciona elementos com atributo title */
```

## Heuristics

| Situacao | Seletor |
|----------|---------|
| Estilizar todos os paragrafos | `p` (tipo) |
| Estilizar um elemento unico | `#id` (id) |
| Estilizar grupo reutilizavel | `.classe` (classe) |
| Estilizar por presenca de atributo | `[attr]` (atributo) |
| Estilizar por valor exato de atributo | `[attr="valor"]` (atributo especifico) |
| Reset ou estilo base global | `*` (universal) |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `.#nome` | `#nome` ou `.nome` separadamente |
| `title { }` para atributo | `[title] { }` |
| `class="pink"` no CSS | `.pink` no CSS |
| `id="text"` no CSS | `#text` no CSS |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Estilo nao aplica no elemento | Seletor escrito incorretamente (ex: `.#nome`) | Use `#nome` ou `.nome` separadamente, nunca misture |
| Todos os elementos recebem o estilo | Seletor universal `*` ou seletor de tipo muito amplo | Use seletor mais especifico como classe ou id |
| Seletor de atributo nao funciona | Usando `title { }` em vez de `[title] { }` | Envolva o atributo em colchetes: `[title]` |
| CSS sobrescrito por outra regra | Especificidade inferior ao seletor concorrente | Aumente especificidade ou reorganize a cascata |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar cada seletor e como a especificidade funciona
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo com variacoes de atributos e combinacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-seletores-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-seletores-1/references/code-examples.md)
