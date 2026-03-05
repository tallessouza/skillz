---
name: rs-full-stack-css-media-queries
description: "Applies CSS Media Queries patterns when building responsive layouts. Use when user asks to 'make responsive', 'adapt for mobile', 'add breakpoints', 'media query', 'responsive design', or 'mobile first'. Enforces viewport meta tag, correct @media syntax, and breakpoint conventions. Make sure to use this skill whenever generating CSS that needs to work across screen sizes. Not for CSS Grid, Flexbox layout, or JavaScript-based responsive logic."
---

# CSS Media Queries

> Ao escrever CSS responsivo, use Media Queries como condicionais que observam a tela do usuario e adaptam o layout conforme o dispositivo.

## Rules

1. **Sempre inclua a meta viewport** — `<meta name="viewport" content="width=device-width, initial-scale=1.0">` porque sem ela dispositivos moveis assumem largura de 980px e o usuario precisa dar zoom manualmente
2. **Prefira @media inline no CSS** — use `@media screen and (min-width: 576px) {}` direto no arquivo CSS, porque e mais pratico e mantém regras proximas do codigo que modificam
3. **Use `screen` como media type** — cobre desktop, celular e tablet, que sao os dispositivos relevantes para web
4. **Agrupe regras responsivas por breakpoint** — abra o bloco `@media` e coloque dentro todas as regras que mudam naquele breakpoint, porque facilita manutencao
5. **Use min-width para mobile-first** — comece com estilos mobile e adicione complexidade para telas maiores, porque e mais eficiente e progressivo

## How to write

### Meta Viewport (obrigatorio no HTML)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### @media inline (metodo principal)

```css
/* Estilos base (mobile) */
.container {
  padding: 1rem;
}

/* Tablet e acima */
@media screen and (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop e acima */
@media screen and (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Orientacao (portrait/landscape)

```css
@media screen and (orientation: portrait) {
  .sidebar {
    display: none;
  }
}

@media screen and (orientation: landscape) {
  .sidebar {
    display: block;
  }
}
```

## Example

**Before (sem responsividade):**

```css
.title {
  font-size: 48px;
  padding: 40px;
}
```

**After (com Media Queries):**

```css
.title {
  font-size: 24px;
  padding: 16px;
}

@media screen and (min-width: 768px) {
  .title {
    font-size: 36px;
    padding: 24px;
  }
}

@media screen and (min-width: 1024px) {
  .title {
    font-size: 48px;
    padding: 40px;
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Layout simples, poucos elementos | Um breakpoint (mobile/desktop) basta |
| Layout complexo com sidebar | Tres breakpoints: mobile, tablet, desktop |
| Precisa detectar orientacao | Use `orientation: portrait` ou `landscape` |
| CSS separado por dispositivo | Use `@media` inline, evite arquivos separados |
| `initial-scale` diferente de 1 | So altere se houver motivo especifico (raro) |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| CSS sem meta viewport | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| `@media (width: 768px)` (exato) | `@media (min-width: 768px)` (range) |
| Media queries espalhadas pelo CSS | Media queries agrupadas por breakpoint |
| `@import url("screen.css") screen` | `@media screen and (min-width: ...) {}` inline |
| Estilos desktop-first com max-width | Mobile-first com min-width |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre viewport, at-rules e tres formas de aplicar media queries
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes