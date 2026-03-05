---
name: rs-full-stack-estilizando-navegacao-02
description: "Enforces CSS container pattern with padding-inline, max-width, and margin-inline auto for consistent layout spacing. Use when user asks to 'create a layout', 'center content', 'add container class', 'style navigation', or 'set max-width with padding'. Applies rules: padding-inline for horizontal spacing, max-width includes padding in calculation, margin-inline auto for centering, full-width background wrapper pattern. Make sure to use this skill whenever building page layouts or container components in CSS. Not for component-level styling, animations, or responsive breakpoints."
---

# Container Pattern e Background Full-Width

> Crie uma classe `.container` global reutilizavel que aplica espacamento lateral, largura maxima e centralizacao — e use wrappers para backgrounds que extrapolam o container.

## Rules

1. **Use `padding-inline` para espacamento lateral** — `padding-inline: 32px` aplica padding apenas no eixo X (esquerda e direita), sem afetar top/bottom, porque mantem separacao clara entre espacamento horizontal e vertical
2. **Inclua o padding no calculo do max-width** — se o conteudo tem 1216px e o padding lateral e 32px de cada lado, o `max-width` deve ser 1280px (1216 + 32 + 32), porque o padding esta contido dentro do max-width
3. **Use `margin-inline: auto` para centralizar** — centraliza o container horizontalmente sem afetar margens verticais, porque inline se refere apenas ao eixo horizontal
4. **Backgrounds full-width usam wrapper externo** — nunca coloque background-color no elemento com `.container`, crie uma div wrapper ao redor sem limitacao de largura, porque o container limita a largura e cortaria o background
5. **Classes utilitarias ficam no Global CSS** — `.container` e `.bg-surface-color` sao globais e reutilizaveis em qualquer elemento do projeto, porque garantem consistencia visual

## How to write

### Container global

```css
/* global.css */
.container {
  padding-inline: 32px;
  max-width: 1280px; /* 1216 content + 64 padding */
  margin-inline: auto;
}
```

### Background full-width com conteudo contido

```html
<!-- wrapper sem limitacao = background ocupa 100% -->
<div class="bg-surface-color">
  <!-- container limita o conteudo -->
  <nav class="container">
    <!-- conteudo aqui -->
  </nav>
</div>
```

```css
.bg-surface-color {
  background-color: var(--surface-color);
}
```

## Example

**Before (background cortado):**
```html
<nav class="container">...</nav>
```
```css
.container {
  padding-inline: 32px;
  max-width: 1280px;
  margin-inline: auto;
  background-color: var(--surface-color); /* CORTADO nas laterais */
}
```

**After (background full-width):**
```html
<div class="bg-surface-color">
  <nav class="container">...</nav>
</div>
```
```css
.container {
  padding-inline: 32px;
  max-width: 1280px;
  margin-inline: auto;
}
.bg-surface-color {
  background-color: var(--surface-color);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Conteudo precisa de espacamento lateral consistente | Aplique `.container` |
| Background deve ocupar 100% da tela | Use wrapper div externo sem container |
| Precisa de padding so horizontal | Use `padding-inline`, nunca `padding-left` + `padding-right` separados |
| Calcular max-width | Some largura do conteudo + (padding lateral × 2) |
| Centralizar horizontalmente | `margin-inline: auto`, nunca `margin: 0 auto` (afeta vertical) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `padding: 0 32px` | `padding-inline: 32px` |
| `margin: 0 auto` (quando so quer horizontal) | `margin-inline: auto` |
| `background-color` no mesmo elemento com max-width | Wrapper externo para background |
| `max-width: 1216px` com padding de 32px | `max-width: 1280px` (inclui padding) |
| `width: 100%` no container | Omita — block elements ja sao 100% por padrao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre inline properties, calculo de max-width e pattern de wrapper
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes