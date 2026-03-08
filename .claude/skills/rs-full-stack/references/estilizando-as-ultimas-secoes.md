---
name: rs-full-stack-estilizando-as-ultimas-secoes
description: "Applies CSS Grid Template Areas layout patterns and image sizing techniques when building multi-section page layouts. Use when user asks to 'create a grid layout', 'organize sections with CSS Grid', 'make images square', 'use aspect-ratio', or 'style page sections'. Enforces grid-template-areas naming, fr units for flexible columns, aspect-ratio with object-fit for images, and margin-block shorthand. Make sure to use this skill whenever structuring page layouts with named grid areas. Not for Flexbox layouts, animations, or responsive breakpoints."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-grid-areas
  tags: [css, grid, grid-template-areas, aspect-ratio, object-fit, fr-units, layout]
---

# Estilizando Seções com CSS Grid Areas

> Use grid-template-areas para criar layouts semânticos onde cada seção ocupa áreas nomeadas, combinando com aspect-ratio e object-fit para imagens proporcionais.

## Rules

1. **Use grid-template-areas com nomes semânticos** — `"featured featured" "weekly weekly" "ai aside"`, porque nomes descritivos tornam o layout legível sem inspecionar o CSS
2. **Separe row-gap de column-gap** — `row-gap: 80px; column-gap: 32px` em vez de `gap: 80px`, porque linhas e colunas geralmente precisam de espaçamentos diferentes
3. **Use fr para colunas flexíveis** — `grid-template-columns: 2fr 1.4fr` em vez de porcentagens fixas, porque fr adapta automaticamente ao espaço disponível
4. **Imagens quadradas com aspect-ratio + object-fit** — `aspect-ratio: 1/1; object-fit: cover; width: 176px`, porque aspect-ratio garante proporção sem height fixa e object-fit evita distorção
5. **Use margin-block como shorthand** — `margin-block: 8px 4px` em vez de margin-top + margin-bottom separados, porque é mais conciso e usa logical properties
6. **Não busque Pixel Perfect** — a web é flexível, use referências visuais mas não fixe cada pixel exato, porque responsividade exige flexibilidade

## How to write

### Grid Template Areas para layout de página

```css
main {
  display: grid;
  grid-template-areas:
    "featured featured"
    "weekly weekly"
    "ai aside";
  grid-template-columns: 2fr 1.4fr;
  row-gap: 80px;
  column-gap: 32px;
  margin-block: 40px;
}

.section-featured { grid-area: featured; }
.section-weekly   { grid-area: weekly; }
.section-ai       { grid-area: ai; }
aside             { grid-area: aside; }
```

### Imagem quadrada com aspect-ratio

```css
.section-ai img {
  width: 176px;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.more img {
  width: 72px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}
```

## Example

**Before (gaps mistos e imagem sem proporção):**
```css
main {
  display: grid;
  gap: 80px;
  grid-template-columns: 70% 30%;
}
.section-ai img {
  width: 176px;
  height: 176px;
}
h3 {
  margin-top: 8px;
  margin-bottom: 4px;
}
```

**After (com grid-areas, fr units e aspect-ratio):**
```css
main {
  display: grid;
  grid-template-areas:
    "featured featured"
    "weekly weekly"
    "ai aside";
  grid-template-columns: 2fr 1.4fr;
  row-gap: 80px;
  column-gap: 32px;
  margin-block: 40px;
}
.section-ai img {
  width: 176px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}
h3 {
  margin-block: 8px 4px;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Seção ocupa largura total | Repita o nome na grid-area: `"weekly weekly"` |
| Seções lado a lado | Nomes diferentes na mesma linha: `"ai aside"` |
| Imagem precisa ser quadrada | `aspect-ratio: 1/1` + `object-fit: cover` |
| Espaço vertical ≠ horizontal | Separe `row-gap` e `column-gap` |
| Proporção de colunas flexível | Use `fr` units, ajuste decimais (1.3fr, 1.4fr) |
| Margem em cima e embaixo | Use `margin-block: top bottom` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `gap: 80px` (quando row ≠ column) | `row-gap: 80px; column-gap: 32px` |
| `grid-template-columns: 70% 30%` | `grid-template-columns: 2fr 1.4fr` |
| `width: 176px; height: 176px` | `width: 176px; aspect-ratio: 1/1; object-fit: cover` |
| `margin-top: 8px; margin-bottom: 4px` | `margin-block: 8px 4px` |
| Fixar todos os pixels exatos do design | Usar referências visuais com flexibilidade |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Secao nao ocupa a area grid esperada | `grid-area` nao atribuido ao elemento | Adicionar `.section-name { grid-area: name; }` correspondente |
| Imagem distorcida dentro do grid | `object-fit` ausente com dimensoes fixas | Adicionar `object-fit: cover` junto com `aspect-ratio` |
| Gap uniforme quando precisa de valores diferentes | Usando `gap` shorthand para ambos os eixos | Separar em `row-gap` e `column-gap` com valores distintos |
| Colunas com proporcao fixa nao adaptam | Usando porcentagens em vez de fr units | Substituir `70% 30%` por `2fr 1.4fr` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre Pixel Perfect, grid-areas e decisões de layout
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações