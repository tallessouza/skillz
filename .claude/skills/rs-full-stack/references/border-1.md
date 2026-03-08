---
name: rs-full-stack-border-1
description: "Applies CSS border property conventions when writing stylesheets. Use when user asks to 'add a border', 'style an element', 'write CSS', or 'create a component with borders'. Enforces shorthand usage, clockwise value ordering (top/right/bottom/left), and individual border targeting with border-top/bottom/left/right. Make sure to use this skill whenever generating CSS that involves borders or element outlines. Not for JavaScript logic, layout systems like flexbox/grid, or box-shadow."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css
  tags: [css, border, shorthand, styling, box-model]
---

# CSS Border

> Use a propriedade shorthand `border` para aplicar estilo, largura e cor de uma vez — e aplique bordas individuais quando precisar estilizar apenas um lado.

## Rules

1. **Sempre declare `border-style`** — sem estilo declarado, nenhuma borda aparece, porque `border-style` e obrigatorio para que `border-width` e `border-color` tenham efeito
2. **Prefira o shorthand `border`** — `border: 1px solid red` em vez de declarar `border-width`, `border-style` e `border-color` separadamente, porque reduz linhas e e o padrao da industria
3. **Ordem no shorthand nao importa** — `border: solid 1px red` e `border: red solid 1px` sao equivalentes, mas por convencao use `width style color`
4. **Use sentido horario para multiplos valores** — top, right, bottom, left (como um relogio), porque e o mesmo padrao de margin e padding
5. **Use `border-{side}` para bordas individuais** — `border-bottom: 1px solid red` em vez de zerar bordas nos outros lados, porque e mais legivel e performatico
6. **`border-{side}` tambem e shorthand** — `border-bottom` agrupa `border-bottom-width`, `border-bottom-style` e `border-bottom-color`

## How to write

### Shorthand completo (uso mais comum)

```css
.element {
  border: 1px solid #333;
}
```

### Borda em apenas um lado

```css
.element {
  border-bottom: 2px solid red;
}
```

### Multiplos valores (sentido horario)

```css
.element {
  /* top | right | bottom | left */
  border-style: dotted solid double dashed;
  border-width: 4px 2px 6px 15px;
  border-color: red green blue black;
}
```

### Atalhos com 2 ou 3 valores

```css
.element {
  /* 2 valores: vertical | horizontal */
  border-style: dotted solid;
  border-width: 4px 2px;

  /* 3 valores: top | horizontal | bottom */
  border-style: dotted solid double;
}
```

## Example

**Before (verboso e redundante):**
```css
.card {
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #ccc;
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: #ccc;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
  border-left-style: solid;
  border-left-width: 1px;
  border-left-color: #ccc;
}
```

**After (com shorthand):**
```css
.card {
  border: 1px solid #ccc;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Borda igual em todos os lados | `border: 1px solid #333` |
| Borda so embaixo (underline visual) | `border-bottom: 2px solid blue` |
| Estilos diferentes por lado | Use `border-style` com 4 valores |
| Larguras diferentes por lado | Use `border-width` com 4 valores |
| Elemento inline (span, a) | Borda funciona igual, mas respeita o fluxo inline |
| Elemento block (div, section) | Borda ocupa largura total do container |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `border-style: solid; border-width: 1px; border-color: red;` | `border: 1px solid red;` |
| `border: none; border-bottom-style: solid; border-bottom-width: 1px;` | `border-bottom: 1px solid;` |
| `border-width: 1px;` sem border-style | `border: 1px solid;` (style obrigatorio) |


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Border not showing** | Ensure `border-style` is declared — without it, `border-width` and `border-color` have no effect. |
| **Border on wrong side only** | Check for specificity conflicts — a later `border: none` may reset all sides. Use `border-bottom` for single-side borders. |
| **Border adding unexpected width** | Switch to `box-sizing: border-box` so border width is included in the element's declared width. |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre shorthands, hierarquia de propriedades e sentido horario
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes