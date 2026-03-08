---
name: rs-full-stack-entendendo-a-sintaxe
description: "Enforces correct CSS media query syntax when writing responsive styles. Use when user asks to 'make responsive', 'add breakpoints', 'write media queries', 'handle dark mode CSS', or 'adapt layout for mobile'. Applies rules: range syntax over min/max, orientation queries, prefers-color-scheme, AND combos for limits, NOT for inversion. Make sure to use this skill whenever writing CSS that adapts to screen size, device orientation, or user preferences. Not for JavaScript-based responsive logic, CSS Grid/Flexbox layout, or responsive images with srcset."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-media-queries
  tags: [css, media-queries, responsive, breakpoints, dark-mode, orientation]
---

# Media Queries — Sintaxe Completa

> Ao escrever media queries, use range syntax moderna, defina breakpoints com intencao, e combine regras com AND/NOT para controle preciso.

## Rules

1. **Omita `screen` quando desnecessario** — `@media (min-width: 576px)` nao `@media screen and (min-width: 576px)`, porque `screen` e opcional e a maioria dos casos nao envolve print
2. **Prefira range syntax sobre min/max** — `@media (width >= 400px)` nao `@media (min-width: 400px)`, porque sinais matematicos sao mais visuais e menos confusos
3. **Use AND para definir limites** — `@media (width >= 400px) and (width <= 500px)` para aplicar estilos apenas dentro de um intervalo especifico
4. **Use NOT para inverter logica** — `@media not (width >= 400px)` inverte a condicao inteira, aplicando quando a condicao e falsa
5. **Use `prefers-color-scheme` para reagir ao sistema** — detecte dark/light do usuario via CSS puro, sem JavaScript
6. **Use orientation para retrato/paisagem** — `orientation: portrait` quando altura > largura, `orientation: landscape` quando largura > altura

## How to write

### Breakpoint basico (range syntax)

```css
/* Aplica a partir de 576px */
@media (width >= 576px) {
  :root {
    --bg-color: orangered;
  }
}
```

### Intervalo com limites

```css
/* Aplica APENAS entre 400px e 500px */
@media (width >= 400px) and (width <= 500px) {
  :root {
    --bg-color: orangered;
  }
}
```

### Preferencia de cor do sistema

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: orangered;
  }
}
```

### Orientacao do dispositivo

```css
@media (orientation: portrait) {
  /* Estilos para modo retrato */
}
```

### Inversao com NOT

```css
/* Aplica quando NAO esta entre 400-500px */
@media not ((width >= 400px) and (width <= 500px)) {
  :root {
    --bg-color: rebeccapurple;
  }
}
```

## Example

**Before (sintaxe antiga e verbosa):**

```css
@media screen and (min-width: 400px) and (max-width: 500px) {
  :root {
    --bg-color: orangered;
  }
}
```

**After (range syntax moderna):**

```css
@media (400px <= width <= 500px) {
  :root {
    --bg-color: orangered;
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Estilos a partir de X pixels | `@media (width >= Xpx)` |
| Estilos ate X pixels | `@media (width <= Xpx)` |
| Estilos entre X e Y pixels | `@media (Xpx <= width <= Ypx)` |
| Reagir a dark/light mode | `@media (prefers-color-scheme: dark)` |
| Detectar celular em pe | `@media (orientation: portrait)` |
| Estilos para impressao | `@media print { }` |
| Unidades flexiveis em breakpoints | Use `em` ou `rem` ao inves de `px` |
| Testar breakpoints | DevTools → Toggle Device Emulation |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `@media screen and (min-width: 576px)` | `@media (width >= 576px)` |
| `@media (min-width: 400px) and (max-width: 500px)` | `@media (400px <= width <= 500px)` |
| JavaScript para detectar dark mode | `@media (prefers-color-scheme: dark)` |
| `screen` sem necessidade de diferenciar print | Omita `screen` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Range syntax nao funciona no navegador | Navegador antigo sem suporte a range syntax | Usar fallback `min-width`/`max-width` ou verificar caniuse.com |
| `prefers-color-scheme` nao detecta dark mode | Sistema operacional configurado como light | Testar alternando tema do SO ou usando DevTools para emular |
| Media query nao aplica estilos | Especificidade do seletor fora da media query e maior | Aumentar especificidade dentro da media query ou reorganizar cascata |
| NOT inverte resultado inesperado | Parenteses incorretos na condicao composta | Envolver a condicao completa em parenteses antes do NOT |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre evolucao da sintaxe, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes