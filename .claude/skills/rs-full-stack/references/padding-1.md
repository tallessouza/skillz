---
name: rs-full-stack-padding-1
description: "Applies CSS padding shorthand conventions when writing styles or layouts. Use when user asks to 'add padding', 'style a component', 'add spacing', 'create a layout', or 'write CSS'. Enforces shorthand syntax with correct value ordering (top, right, bottom, left), warns against padding on inline elements. Make sure to use this skill whenever generating CSS that involves internal spacing. Not for margin, gap, or external spacing properties."
---

# CSS Padding (Preenchimento Interno)

> Ao aplicar espacamento interno, use o shorthand `padding` com a ordem correta de valores e evite aplicar padding em elementos inline.

## Rules

1. **Use o shorthand `padding`** — agrupa todas as direcoes em uma propriedade, porque reduz codigo e e mais legivel
2. **Memorize a ordem: relogio** — `top right bottom left` (sentido horario a partir do topo), porque errar a ordem causa bugs visuais silenciosos
3. **Nunca aplique padding em elementos inline** — elementos inline nao respeitam padding vertical no fluxo, porque o padding vertical "encavala" sobre outros elementos sem mover o fluxo
4. **Conheca as abreviacoes por quantidade de valores** — 1 valor = todos, 2 = vertical/horizontal, 3 = top/horizontal/bottom, 4 = top/right/bottom/left

## How to write

### 1 valor (todos os lados iguais)
```css
.box {
  padding: 20px; /* aplica 20px em todas as direcoes */
}
```

### 2 valores (vertical | horizontal)
```css
.box {
  padding: 20px 40px; /* 20px top/bottom, 40px left/right */
}
```

### 3 valores (top | horizontal | bottom)
```css
.box {
  padding: 20px 40px 0; /* 20px top, 40px left/right, 0 bottom */
}
```

### 4 valores (relogio: top | right | bottom | left)
```css
.box {
  padding: 20px 40px 10px 0; /* top:20 right:40 bottom:10 left:0 */
}
```

## Example

**Before (verbose, repetitivo):**
```css
.card {
  padding-top: 20px;
  padding-right: 40px;
  padding-bottom: 20px;
  padding-left: 40px;
}
```

**After (shorthand):**
```css
.card {
  padding: 20px 40px; /* vertical 20px, horizontal 40px */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Todos os lados iguais | `padding: 20px` (1 valor) |
| Vertical e horizontal diferentes | `padding: 20px 40px` (2 valores) |
| Bottom diferente do top | `padding: 20px 40px 0` (3 valores) |
| Cada lado diferente | `padding: 20px 40px 10px 0` (4 valores, sentido relogio) |
| Elemento inline (`span`, `a`) | Nao aplique padding vertical — use `display: inline-block` ou `block` primeiro |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `padding` em `<span>` sem mudar display | `display: inline-block` + `padding` |
| 4 propriedades separadas (`padding-top`, `-right`, `-bottom`, `-left`) quando valores sao simetricos | Shorthand com 1 ou 2 valores |
| `padding: 20px 20px 20px 20px` | `padding: 20px` |
| `padding: 20px 40px 20px 40px` | `padding: 20px 40px` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre padding vs inline, eixos block/inline, e analogia do relogio
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-padding-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-padding-1/references/code-examples.md)
