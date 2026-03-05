---
name: rs-full-stack-grid-column
description: "Applies CSS Grid column and row placement using virtual grid lines when writing layout code. Use when user asks to 'create a layout', 'position grid items', 'span columns', 'use grid-column', or 'build a CSS grid layout'. Enforces virtual line numbering system for grid-column-start/end and grid-row-start/end shorthand. Make sure to use this skill whenever generating CSS Grid item placement code. Not for Flexbox layouts, grid container properties, or grid-template definitions."
---

# Grid Column e Grid Row — Posicionamento de Items

> Posicione elementos filhos no grid usando linhas virtuais com grid-column e grid-row.

## Rules

1. **Use linhas virtuais, nao celulas** — `grid-column: 1 / 3` significa "da linha virtual 1 ate a linha virtual 3", nao "coluna 1 ate coluna 3", porque um grid de 3 colunas tem 4 linhas virtuais
2. **Prefira o shorthand** — `grid-column: 1 / 4` em vez de `grid-column-start: 1; grid-column-end: 4`, porque reduz duplicacao e e mais legivel
3. **Conte linhas virtuais = colunas + 1** — 3 colunas = 4 linhas virtuais (1, 2, 3, 4), porque cada coluna e delimitada por duas linhas
4. **Omita grid-row quando o fluxo automatico resolve** — se o elemento ja esta na row correta pelo fluxo natural, nao declare grid-row, porque e redundante
5. **Use elementos semanticos** — `header`, `main`, `aside`, `footer` em vez de `div` genericas, porque melhora acessibilidade e clareza do layout

## How to write

### Posicionamento com shorthand

```css
/* Elemento ocupa 2 colunas: da linha virtual 1 ate a 3 */
.item {
  grid-column: 1 / 3;
}

/* Elemento ocupa todas as 3 colunas: linha 1 ate 4 */
.full-width {
  grid-column: 1 / 4;
}
```

### Layout semantico completo

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

header {
  grid-column: 1 / 4; /* todas as colunas */
}

main {
  grid-column: 1 / 3; /* 2 primeiras colunas */
}

/* aside: fluxo automatico resolve, nao precisa de grid-column */

footer {
  grid-column: 1 / 4; /* todas as colunas */
}
```

## Example

**Before (versao longa e redundante):**

```css
div:nth-child(1) {
  grid-column-start: 1;
  grid-column-end: 4;
}
div:nth-child(2) {
  grid-column-start: 1;
  grid-column-end: 3;
}
div:nth-child(4) {
  grid-column-start: 1;
  grid-column-end: 4;
}
```

**After (shorthand + semantico):**

```css
header  { grid-column: 1 / 4; }
main    { grid-column: 1 / 3; }
/* aside ocupa 1 coluna pelo fluxo automatico */
footer  { grid-column: 1 / 4; }
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Elemento ocupa todas as colunas | `grid-column: 1 / -1` (ou `1 / N+1`) |
| Elemento ocupa 1 coluna no fluxo natural | Nao declare grid-column |
| Precisa span sem saber posicao exata | `grid-column: span 2` |
| Layout com areas nomeadas | Prefira `grid-template-areas` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `grid-column-start` + `grid-column-end` separados | `grid-column: start / end` |
| `grid-column: 1 / 2` para 2 colunas | `grid-column: 1 / 3` (linha virtual 3, nao coluna 2) |
| `grid-row` quando o fluxo ja resolve | Omita a propriedade |
| `div:nth-child(n)` para layout semantico | Use `header`, `main`, `aside`, `footer` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Conceito de linhas virtuais, raciocinio completo e analogias
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-grid-column/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-grid-column/references/code-examples.md)
