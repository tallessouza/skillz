---
name: rs-full-stack-display-block
description: "Enforces correct usage of CSS display block properties when writing HTML/CSS code. Use when user asks to 'style a div', 'layout elements', 'set width and height', 'add margin or padding', or any CSS layout task. Applies rules: block occupies full horizontal line, width/height apply normally, padding/margin/border work completely. Make sure to use this skill whenever generating CSS for block-level elements. Not for flexbox, grid, inline, or inline-block layout questions."
---

# Display Block

> Elementos com display block ocupam toda a largura disponivel horizontalmente e aceitam width, height, padding, margin e border normalmente.

## Rules

1. **Ocupa toda a linha horizontal** — um elemento block se estende de ponta a ponta do container pai, porque ele se comporta como um bloco que empurra qualquer elemento seguinte para a proxima linha
2. **Width e height se aplicam normalmente** — diferente de elementos inline, `width` e `height` funcionam sem restricao, porque o modelo de bloco reserva o espaco completo
3. **Padding, margin e border funcionam por completo** — todas as direcoes (top, right, bottom, left) sao respeitadas, porque o bloco participa integralmente do box model

## Elementos padrao com display block

`div`, `main`, `header`, `section`, `p` — todos ja vem com `display: block` por padrao no navegador.

## How to write

### Estilizando um elemento block

```css
div {
  width: 200px;
  height: 200px;
  margin: 20px;
  padding: 20px;
  border: 1px solid #000;
}
```

### Quando nao especificar width

```css
/* Sem width, o block ocupa 100% do container pai */
section {
  padding: 16px;
  border: 1px solid #ccc;
}
```

## Example

**Before (expectativa incorreta — tratando block como inline):**
```html
<div style="border: 1px solid black;">Primeiro</div>
<div style="border: 1px solid black;">Segundo</div>
<!-- Expectativa: ficarem lado a lado -->
<!-- Realidade: cada div ocupa uma linha inteira -->
```

**After (entendendo o comportamento block):**
```html
<!-- Cada div ocupa toda a linha — empilham verticalmente -->
<div style="width: 200px; height: 200px; margin: 20px; padding: 20px; border: 1px solid black;">
  Primeiro
</div>
<div style="width: 200px; height: 200px; margin: 20px; padding: 20px; border: 1px solid black;">
  Segundo
</div>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa que elemento ocupe linha inteira | Use display block (ou elemento que ja e block) |
| Precisa controlar width/height livremente | Use display block |
| Precisa de margin/padding em todas as direcoes | Use display block |
| Precisa de elementos lado a lado | Nao use block puro — considere flex ou inline-block |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Esperar que duas divs fiquem lado a lado sem flex/grid | Use flexbox ou grid para layout horizontal |
| Colocar `display: block` em elemento que ja e block | Omita a declaracao — div, section, p ja sao block |
| Esquecer que block ocupa 100% da largura sem width definido | Defina width explicitamente se precisar de largura menor |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes