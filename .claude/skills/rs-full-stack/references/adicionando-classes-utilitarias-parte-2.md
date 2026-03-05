---
name: rs-full-stack-classes-utilitarias-pt2
description: "Enforces CSS utility class patterns for responsive layouts including dynamic padding, visibility toggles, and equal-column grids. Use when user asks to 'create utility classes', 'make responsive layout', 'hide elements on mobile', 'equal columns', 'even columns grid', or 'mobile first CSS'. Applies mobile-first strategy with CSS custom properties for padding-block/inline and display toggling. Make sure to use this skill whenever building responsive utility CSS or grid layouts. Not for JavaScript logic, component architecture, or CSS-in-JS solutions."
---

# Classes Utilitárias Responsivas — Padding, Visibilidade e Colunas

> Construa classes utilitárias com variáveis CSS que mudam por breakpoint, seguindo a estratégia mobile-first.

## Rules

1. **Mobile first sempre** — defina o valor mobile como padrão e sobrescreva no breakpoint desktop, porque o CSS carrega primeiro no menor dispositivo e progressivamente melhora
2. **Padding por eixo com nomes semânticos** — use `py-` para vertical (padding-block) e `px-` para horizontal (padding-inline), porque `block` = eixo Y e `inline` = eixo X no CSS lógico
3. **Variáveis CSS para cada escala** — defina `--py-base`, `--py-lg`, `--py-xl` com valores que mudam no breakpoint, porque permite ajuste global sem tocar nas classes
4. **`display: initial` para restaurar visibilidade** — use `initial` em vez de `block` ou `inline`, porque `initial` recupera o display padrão da tag (div=block, span=inline) sem hardcodar
5. **Even Columns com Grid, não Flex** — use `grid-auto-flow: column` + `grid-auto-columns: 1fr` para colunas iguais, porque `1fr` garante distribuição uniforme independente do conteúdo
6. **Planeje antes de implementar** — identifique todas as variações de espaçamento e visibilidade no design antes de escrever HTML, porque classes utilitárias pré-definidas aceleram a montagem

## How to write

### Variáveis de padding responsivas

```css
:root {
  --py-base: 1rem;      /* 16px mobile */
  --py-lg: 1.5rem;      /* 24px mobile */
  --py-xl: 3rem;        /* 48px mobile */
}

@media (min-width: 768px) {
  :root {
    --py-base: 1.5rem;  /* 24px desktop */
    --py-lg: 2.5rem;    /* 40px desktop */
    --py-xl: 5rem;      /* 80px desktop */
  }
}
```

### Classes de padding

```css
.py-base { padding-block: var(--py-base); }
.py-lg   { padding-block: var(--py-lg); }
.py-xl   { padding-block: var(--py-xl); }
.px-lg   { padding-inline: var(--px-lg); }
```

### Visibilidade mobile-first

```css
.desktop-only {
  display: none; /* mobile: escondido */
}

@media (min-width: 768px) {
  .desktop-only {
    display: initial; /* desktop: restaura display padrão da tag */
  }
}
```

### Even Columns

```css
.even-columns {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .even-columns {
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
  }
}
```

## Example

**Before (valores hardcoded, sem estratégia):**
```css
.section { padding: 48px 0; }
.hide-mobile { display: none; }
@media (min-width: 768px) {
  .section { padding: 80px 0; }
  .hide-mobile { display: block; } /* quebra se aplicar em span */
}
.cols { display: flex; gap: 16px; }
```

**After (com utility classes mobile-first):**
```css
:root { --py-xl: 3rem; }
@media (min-width: 768px) { :root { --py-xl: 5rem; } }

.py-xl { padding-block: var(--py-xl); }

.desktop-only { display: none; }
@media (min-width: 768px) {
  .desktop-only { display: initial; } /* funciona em qualquer tag */
}

.even-columns { display: grid; gap: 1rem; }
@media (min-width: 768px) {
  .even-columns { grid-auto-flow: column; grid-auto-columns: 1fr; }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Elemento precisa sumir no mobile | Aplique `.desktop-only` — mobile-first esconde por padrão |
| Elemento precisa sumir no desktop | Crie `.mobile-only` com lógica inversa (display initial no mobile, none no desktop) |
| Colunas com larguras iguais | Use `.even-columns` — funciona com 2, 3, 4+ filhos automaticamente |
| Padding muda entre breakpoints | Use variável CSS (`--py-xl`) em vez de valor fixo na classe |
| `padding-block` vs `padding-inline` | block = Y (cima/baixo), inline = X (esquerda/direita) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `display: block` para restaurar visibilidade | `display: initial` (respeita o display nativo da tag) |
| `padding: 80px 0` hardcoded | `padding-block: var(--py-xl)` com variável responsiva |
| `.cols { display: flex }` para colunas iguais | `.even-columns` com `grid-auto-columns: 1fr` |
| Media query desktop-first (`max-width`) | Media query mobile-first (`min-width`) |
| Valores mágicos repetidos no CSS | Variáveis CSS na `:root` que mudam por breakpoint |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre mobile-first, padding lógico e estratégia de planejamento prévio
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações e aplicação HTML

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-adicionando-classes-utilitarias-parte-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-adicionando-classes-utilitarias-parte-2/references/code-examples.md)
