---
name: rs-full-stack-estilos-secao-mais-lidas
description: "Applies CSS layout patterns for card grid sections with headers, tags, and hover effects. Use when user asks to 'style a card grid', 'create a weekly section', 'position tags over images', 'add hover arrow icons', or 'layout a news section'. Enforces reusable section+header patterns, grid repeat for equal columns, relative/absolute positioning for overlay tags, and hover state background-image swaps. Make sure to use this skill whenever styling grid-based card sections with overlaid elements. Not for JavaScript logic, data fetching, or responsive breakpoints."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [css, grid, layout, cards, hover-effects, positioning]
---

# Estilos para Seções de Cards em Grid (Mais Lidas da Semana)

> Seções com cards repetitivos seguem um padrão reutilizável: section > header com link/seta, grid de colunas iguais, e tags posicionadas sobre imagens com absolute.

## Rules

1. **Extraia padrões comuns para o nível de section** — se múltiplas seções compartilham border-top + padding + fonte no header, estilize `section:has(> header)` uma vez só, porque duplicar estilos em cada seção gera inconsistência
2. **Use `grid-template-columns: repeat(N, 1fr)` para cards uniformes** — porque `1fr` distribui espaço flexivelmente sem valores fixos de largura
3. **Defina altura fixa em imagens de card apenas quando o design exige uniformidade** — `img { height: 160px }` é aceitável quando todas as imagens do grid devem ter a mesma altura
4. **Posicione tags sobre imagens com relative/absolute** — `figure { position: relative }` + `tag { position: absolute; top: 8px; left: 8px }`, porque float ou margin hack quebra em diferentes tamanhos
5. **Troque ícones no hover via background-image** — use `&:hover span { background-image: url(...hover.svg) }` em vez de JS, porque é puro CSS e performático
6. **Use nesting CSS apenas quando há múltiplos filhos** — para seletores simples como `section header a`, escreva inline sem nesting, porque nesting excessivo reduz legibilidade

## How to write

### Padrão reutilizável de section com header

```css
/* Aplique uma vez — todas as sections com header herdam */
section:has(> header) {
  border-top: 1px solid var(--stroke-color);
  padding-block: 12px 24px;
  font: var(--text-span);
}

section header a {
  justify-self: end;
  align-items: center;
  gap: 8px;
}

section header a span {
  background-image: url(../assets/icons/arrow-right.svg);
  width: 16px;
  height: 16px;
}

section header a:hover span {
  background-image: url(../assets/icons/arrow-right-hover.svg);
}
```

### Grid de cards com colunas iguais

```css
.weekly > div {
  grid-template-columns: repeat(4, 1fr);
}

.weekly img {
  height: 160px;
}
```

### Tag posicionada sobre imagem

```css
.weekly figure {
  position: relative;
}

.weekly .content-tag {
  position: absolute;
  top: 8px;
  left: 8px;
}

.weekly figure p {
  margin-top: 8px;
  font-weight: 800;
}
```

## Example

**Before (estilos duplicados por seção):**
```css
.weekly {
  border-top: 1px solid var(--stroke-color);
  padding-block: 12px 24px;
  font: var(--text-span);
}
.trending {
  border-top: 1px solid var(--stroke-color);
  padding-block: 12px 24px;
  font: var(--text-span);
}
.weekly .tag { margin-top: 10px; }
```

**After (padrão extraído + posicionamento correto):**
```css
section:has(> header) {
  border-top: 1px solid var(--stroke-color);
  padding-block: 12px 24px;
  font: var(--text-span);
}

.weekly figure {
  position: relative;
}
.weekly .content-tag {
  position: absolute;
  top: 8px;
  left: 8px;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Múltiplas seções com mesmo header pattern | Extraia para `section:has(> header)` |
| Cards em linha com mesma largura | `repeat(N, 1fr)` no grid |
| Elemento sobreposto a imagem | `relative` no container, `absolute` no elemento |
| Ícone muda no hover | `background-image` swap, nunca JS |
| Espaço entre seções no main | `gap` no main, nunca margin individual |

## Anti-patterns

| Nunca escreva | Escreva no lugar |
|---------------|-----------------|
| `width: 292px` em cards de grid | `grid-template-columns: repeat(4, 1fr)` |
| Duplicar border/padding por seção | `section:has(> header) { ... }` uma vez |
| `float: left` para tag sobre imagem | `position: absolute` com container `relative` |
| `margin-bottom: 80px` em cada section | `main { gap: 80px }` |
| `.arrow:hover { display: block }` via JS | `&:hover span { background-image: url(...) }` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Tag nao aparece sobre a imagem | Container `figure` sem `position: relative` | Adicione `position: relative` ao container pai |
| Cards com larguras desiguais no grid | Uso de largura fixa em vez de `1fr` | Use `grid-template-columns: repeat(N, 1fr)` |
| Icone de seta nao muda no hover | Path do SVG hover incorreto ou seletor CSS errado | Verifique o caminho da imagem e use `&:hover span { background-image: url(...) }` |
| Espacamento inconsistente entre secoes | Margin individual em cada secao | Use `gap` no container pai (main) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre extração de padrões, nesting CSS e posicionamento
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações