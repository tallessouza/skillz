---
name: rs-full-stack-resetando-variaveis-css
description: "Applies CSS reset patterns, CSS custom properties architecture, and responsive font scaling when writing CSS for landing pages or product pages. Use when user asks to 'create a landing page', 'setup CSS variables', 'reset styles', 'make responsive fonts', or 'configure global styles'. Enforces mobile-first variable strategy with @media overrides, proper box-sizing reset including pseudo-elements, font smoothing, and accessible list resets with role attribute. Make sure to use this skill whenever setting up a new front-end project's global CSS. Not for CSS animations, layouts, grid systems, or component-specific styling."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-fundamentals
  tags: [css, reset, custom-properties, variables, responsive, mobile-first]
---

# Reset CSS e Variáveis CSS com Responsividade

> Defina variáveis CSS no :root com valores mobile-first e sobrescreva via @media para desktop — nunca o contrário.

## Rules

1. **Reset inclui pseudo-elementos** — aplique `box-sizing: border-box` em `*, *::before, *::after` separadamente, porque pseudo-classes herdam box-sizing apenas se declarado explicitamente
2. **Reset de fonte com `font: inherit`** — remove estilos nativos de h1, strong, etc., porque o controle total da tipografia vem das variáveis CSS, não dos defaults do navegador
3. **Use font smoothing** — `-webkit-font-smoothing: antialiased` e `-moz-osx-font-smoothing: grayscale` tornam a fonte mais suave e fina, especialmente perceptível em macOS
4. **Variáveis mobile-first** — defina valores mobile no `:root` e sobrescreva apenas o necessário dentro de `@media (min-width: 80em)`, porque mobile é o baseline
5. **Use REM para font-size** — divida o valor em pixels por 16 para obter REM (`14px / 16 = 0.875rem`), porque REM respeita a configuração de font-size do navegador do usuário
6. **Use EM no @media query** — `@media (min-width: 80em)` em vez de pixels, porque o em no media query sempre referencia o root (16px), independente de customizações do usuário
7. **Lista sem bolinha requer `role="list"`** — ao remover `list-style` via CSS, adicione `role="list"` no HTML, porque alguns navegadores e leitores de tela perdem a semântica de lista quando o estilo visual é removido

## How to write

### Reset global

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
  font: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Variáveis no :root (mobile-first)

```css
:root {
  /* Colors */
  --bg-color: #09090b;
  --surface-color: #121214;
  --stroke-color: #18181b;
  --text-color-primary: #f4f4f5;
  --text-color-secondary: #a1a1a1;
  --brand-color-primary: #f7b733;
  --brand-color-secondary: #fc4a1a;

  /* Font Family */
  --ff-sans: "Inter", system-ui, sans-serif;

  /* Font Weight */
  --fw-base: 400;
  --fw-md: 500;
  --fw-bold: 800;

  /* Font Size (mobile) */
  --fs-sm: 0.875rem;   /* 14px */
  --fs-base: 1rem;     /* 16px */
  --fs-lg: 1.25rem;    /* 20px */
  --fs-xl: 1.5rem;     /* 24px */
  --fs-2xl: 2.5rem;    /* 40px */
}
```

### Override responsivo via @media

```css
@media (min-width: 80em) { /* 1280px */
  :root {
    --fs-lg: 2rem;    /* 32px */
    --fs-xl: 3rem;    /* 48px */
    --fs-2xl: 4rem;   /* 64px */
  }
}
```

### Estilos base do documento

```css
html {
  font-family: var(--ff-sans);
  font-weight: var(--fw-base);
  font-size: var(--fs-base);
  line-height: 1.6;
  color: var(--text-color-primary);
}

body {
  background-color: var(--bg-color);
}

h1, h2, h3 {
  line-height: 1.2;
  color: var(--text-color-primary);
  font-weight: var(--fw-bold);
  letter-spacing: -0.04em;
}

h1 { font-size: var(--fs-2xl); }
h2 { font-size: var(--fs-xl); }
h3 { font-size: var(--fs-lg); }
```

### Reset de links e listas acessíveis

```css
a {
  text-decoration: none;
  color: inherit;
}

ul[role="list"] {
  list-style: none;
}
```

```html
<!-- No HTML: sempre adicione role="list" ao remover bolinhas -->
<ul role="list">
  <li>Item sem bolinha, acessível</li>
</ul>
```

## Example

**Before (sem sistema de variáveis):**
```css
h1 { font-size: 40px; color: white; }
h2 { font-size: 24px; color: white; }

@media (min-width: 1280px) {
  h1 { font-size: 64px; }
  h2 { font-size: 48px; }
}
```

**After (com variáveis e mobile-first):**
```css
:root {
  --fs-xl: 1.5rem;
  --fs-2xl: 2.5rem;
}

@media (min-width: 80em) {
  :root {
    --fs-xl: 3rem;
    --fs-2xl: 4rem;
  }
}

h1 { font-size: var(--fs-2xl); }
h2 { font-size: var(--fs-xl); }
```

## Heuristics

| Situação | Faça |
|----------|------|
| Converter px para rem | Divida por 16: `14px / 16 = 0.875rem` |
| Breakpoint no @media | Use em: `80em = 1280px` (80 × 16) |
| Fonte muda entre mobile/desktop | Sobrescreva a variável no @media, não o seletor |
| Precisa de lista sem bolinha | `ul[role="list"] { list-style: none; }` + `role="list"` no HTML |
| Valor do Figma em % (ex: -4%) | Use ferramenta de conversão ou calcule: `-4% → -0.04em` |
| Font fallback | Ordem: fonte desejada → system-ui → genérica (`sans-serif`) |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `* { box-sizing: border-box; }` sem pseudo-elementos | `*, *::before, *::after { box-sizing: border-box; }` |
| `@media (min-width: 1280px)` | `@media (min-width: 80em)` |
| `h1 { font-size: 64px; }` | `h1 { font-size: var(--fs-2xl); }` |
| `ul { list-style: none; }` globalmente | `ul[role="list"] { list-style: none; }` |
| Desktop-first com `max-width` | Mobile-first com `min-width` |
| Repetir valor de cor em cada seletor | Variável CSS no `:root` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Variaveis CSS nao aplicam no mobile | Valores desktop definidos no `:root` sem media query | Defina valores mobile no `:root` e sobrescreva no `@media` |
| `box-sizing` nao funciona em pseudo-elementos | Reset so aplicado em `*`, sem `*::before, *::after` | Adicione `*::before, *::after` no seletor do box-sizing |
| Lista sem bolinhas perde semantica no leitor de tela | `list-style: none` remove semantica em alguns browsers | Adicione `role="list"` no HTML |
| Fonte aparece diferente no macOS vs Windows | Falta font-smoothing | Adicione `-webkit-font-smoothing: antialiased` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre font smoothing, vendor prefixes, role="list" e acessibilidade, e estratégia mobile-first
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e cálculos de conversão px→rem

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-resetando-e-definindo-variaveis-css/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-resetando-e-definindo-variaveis-css/references/code-examples.md)
