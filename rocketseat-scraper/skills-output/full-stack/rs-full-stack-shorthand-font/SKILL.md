---
name: rs-full-stack-shorthand-font
description: "Applies CSS font shorthand rules when writing stylesheet code. Use when user asks to 'style text', 'set font properties', 'write CSS', or 'create a component with typography'. Enforces awareness that font shorthand requires font-size AND font-family, recommends individual properties for partial changes. Make sure to use this skill whenever generating CSS font declarations. Not for JavaScript, HTML structure, or non-typography CSS properties."
---

# Shorthand Font no CSS

> Prefira propriedades individuais de font ao inves do shorthand, porque o shorthand exige font-size E font-family obrigatoriamente.

## Rules

1. **font-size e font-family sao obrigatorios no shorthand** — `font: 16px sans-serif` funciona, `font: sans-serif` sozinho nao aplica, porque o browser exige ambos
2. **Prefira propriedades individuais** — use `font-weight: bold` separado quando so precisa mudar uma coisa, porque o shorthand forca declarar propriedades que voce nao quer alterar
3. **line-height usa barra apos font-size** — `font: 16px/1.5 sans-serif`, porque e a sintaxe especifica do shorthand
4. **Ordem das opcionais e flexivel** — style, variant, weight e stretch podem vir em qualquer ordem antes de size/family, porque o browser resolve pela semantica
5. **stretch depende da fonte** — `condensed` so funciona se a fonte suporta, porque nao e um modificador universal

## How to write

### Propriedades individuais (recomendado)

```css
/* Quando precisa mudar apenas uma ou duas propriedades */
.title {
  font-family: sans-serif;
  font-size: 1.25rem;
  font-weight: bold;
}
```

### Shorthand completo (quando faz sentido)

```css
/* Somente quando precisa definir TODAS as propriedades de uma vez */
.hero-text {
  font: italic small-caps bold 2rem/1.4 sans-serif;
}
```

## Example

**Before (shorthand desnecessario):**
```css
.card-title {
  font: bold 1rem Arial, sans-serif;
  /* Forcou font-size e font-family so pra colocar bold */
}
```

**After (propriedade individual):**
```css
.card-title {
  font-weight: bold;
  /* font-size e font-family herdados ou definidos em outro lugar */
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa mudar so font-weight | Use `font-weight` individual |
| Precisa mudar so font-family | Use `font-family` individual |
| Reset completo de tipografia num elemento | Shorthand `font:` e aceitavel |
| line-height junto com font-size | `font: 16px/1.5 family` ou propriedades separadas |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `font: sans-serif` (sem size) | `font-family: sans-serif` |
| `font: bold 1rem sans-serif` so pra bold | `font-weight: bold` |
| `font: condensed 1rem Arial` sem checar a fonte | Teste se a fonte suporta stretch primeiro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes