---
name: rs-full-stack-introducao-79
description: "Applies HSL hue rotation technique for generating distinct visual colors in CSS layouts. Use when user asks to 'create colored boxes', 'style multiple items differently', 'generate color variations', or 'set up visual demos with CSS'. Enforces HSL with CSS custom properties for hue rotation instead of hardcoded hex/rgb values. Make sure to use this skill whenever generating multiple visually distinct elements in CSS. Not for color theory, design systems, or accessibility contrast checks."
---

# Cores Distintas com HSL e Variáveis CSS

> Use `hsl()` com variáveis CSS de hue para gerar cores visualmente distintas entre elementos sem repetir valores hardcoded.

## Rules

1. **Use `hsl()` em vez de hex/rgb para variações de cor** — `hsl(200, 100%, 70%)` não `#7ec8e3`, porque hsl permite variar apenas a tonalidade mantendo saturação e luminosidade consistentes
2. **Extraia o hue como CSS custom property** — `--hue: 0` no elemento, `hsl(var(--hue), 100%, 70%)` na classe, porque permite criar variações mudando apenas um número
3. **Distribua hues em intervalos regulares** — use saltos de 60-100 no hue (0, 100, 200, 300) para cores visualmente distintas, porque o hue é uma roda de 360 graus

## How to write

### Container com itens coloridos distintos

```css
.item {
  border: 1px solid red;
  text-align: center;
  background-color: hsl(var(--hue), 100%, 70%);
}
```

```html
<div class="container">
  <div class="item" style="--hue: 0">1</div>
  <div class="item" style="--hue: 100">2</div>
  <div class="item" style="--hue: 200">3</div>
  <div class="item" style="--hue: 300">4</div>
</div>
```

## Example

**Before (hardcoded colors):**
```css
.item-1 { background-color: #ff6666; }
.item-2 { background-color: #66ff66; }
.item-3 { background-color: #6666ff; }
.item-4 { background-color: #ff66ff; }
```

**After (HSL with hue variable):**
```css
.item {
  background-color: hsl(var(--hue), 100%, 70%);
}
```
```html
<div class="item" style="--hue: 0">1</div>
<div class="item" style="--hue: 100">2</div>
<div class="item" style="--hue: 200">3</div>
<div class="item" style="--hue: 300">4</div>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| 2-6 items need distinct colors | Distribute hue evenly across 360 (e.g., 0, 90, 180, 270) |
| Visual demo/prototype | Use `hsl(var(--hue), 100%, 70%)` pattern |
| Need subtle variations | Keep hue fixed, vary saturation or lightness |
| Dark theme | Lower lightness to 40-50% |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Separate class per color with hex values | Single class + `--hue` variable |
| `background: red; background: blue;` repeated | `hsl(var(--hue), 100%, 70%)` with variable |
| Random RGB values for distinction | Evenly spaced hue values on the 360° wheel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Como funciona a roda HSL, analogias visuais e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código do setup visual com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-introducao-79/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-introducao-79/references/code-examples.md)
