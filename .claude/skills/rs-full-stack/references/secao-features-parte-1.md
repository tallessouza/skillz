---
name: rs-full-stack-secao-features-parte-1
description: "Applies CSS Grid layout patterns for responsive feature card sections when building landing pages or product pages. Use when user asks to 'create a features section', 'build card grid layout', 'make responsive cards', 'layout with grid columns and rows', or 'desktop-only responsive design'. Enforces mobile-first approach with conditional CSS imports, grid-template-columns/rows with fixed and flexible tracks, and nth-child grid placement. Make sure to use this skill whenever creating multi-card sections with different mobile/desktop layouts. Not for flexbox-only layouts, JavaScript interactivity, or backend API work."
---

# Secao Features — Grid Layout Responsivo

> Construa secoes de features com cards usando CSS Grid, importando estilos condicionalmente para desktop e posicionando cards com grid lines.

## Rules

1. **Mobile-first, desktop condicional** — importe CSS de desktop com `@import url("features.css") (width >= 80rem)` ao inves de media queries internas, porque isola completamente os estilos desktop num arquivo separado
2. **Use classes utilitarias para spacing** — `pylg`, `pxlg`, `container`, `grid`, `gap-1.5` ao inves de CSS custom repetido, porque mantem consistencia com o design system
3. **Grid tracks fixos nas extremidades, flexivel no centro** — `grid-template-columns: 17.5rem 1fr 1fr 17.5rem` permite que o conteudo central se adapte enquanto os cards laterais mantem largura fixa
4. **Posicione cards com grid-column start/end** — use `nth-child` + `grid-column: 2 / 4` para spans, porque e declarativo e nao depende de ordem no HTML
5. **Desktop-only com classe utilitaria** — elementos que so aparecem no desktop recebem classe `desktop-only` (display:none no mobile), porque evita conteudo desnecessario no mobile
6. **Divida colunas extras para gaps visuais** — se o layout tem um espaco visual entre cards no meio, crie uma coluna extra (`1fr 1fr` no centro) para representar essa divisao

## How to write

### Estrutura HTML dos cards

```html
<section id="features">
  <div class="container pylg">
    <div class="cards grid gap-1.5">
      <div class="card pylg pxlg">
        <img src="assets/icons/magic-wand.svg" alt="" />
        <h3>A maior biblioteca</h3>
        <p>Descricao do feature</p>
      </div>
      <div class="card pylg pxlg">
        <div>
          <img src="assets/icons/game-controller.svg" alt="" />
          <h3>Experiencia gamificada</h3>
          <p>Descricao do feature</p>
        </div>
        <img class="desktop-only" src="assets/screen-2.png" alt="" />
      </div>
    </div>
  </div>
</section>
```

### CSS do card (cards.css — sempre carregado)

```css
.card {
  background: var(--surface-color);
  border: 1px solid var(--stroke-color);
  border-radius: 1.5rem;
}

.card h3 {
  margin-top: 1rem;
}
```

### CSS de features (features.css — apenas desktop)

```css
/* Importado com: @import url("features.css") (width >= 80rem) */

#features .cards {
  grid-template-columns: 17.5rem 1fr 1fr 17.5rem;
  grid-template-rows: 25rem 25rem;
  gap: 2rem;
}

#features .cards .card:nth-child(1) {
  grid-column: 1 / 2;
}

#features .cards .card:nth-child(2) {
  grid-column: 2 / 4;
}
```

## Example

**Before (sem grid, empilhado):**
```css
.cards {
  display: flex;
  flex-direction: column;
}
```

**After (grid responsivo com import condicional):**
```css
/* index.css */
@import url("cards.css");
@import url("features.css") (width >= 80rem);

/* features.css — so carrega no desktop */
#features .cards {
  grid-template-columns: 17.5rem 1fr 1fr 17.5rem;
  grid-template-rows: 25rem 25rem;
  gap: 2rem;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Card simples (icone + texto) | Um `div.card` com img, h3, p e classes utilitarias |
| Card com imagem desktop-only | Wrapper div para texto + img com classe `desktop-only` |
| Espaco visual entre cards no centro | Adicione colunas extras no grid (1fr 1fr no meio) |
| CSS so para desktop | Import condicional com `(width >= 80rem)` |
| Spacing interno do card | Use classes utilitarias `pylg pxlg` ao inves de CSS custom |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `@media (min-width: 80rem)` dentro do arquivo | `@import url("features.css") (width >= 80rem)` no index |
| `grid-template-columns: 1fr 1fr 1fr 1fr` quando extremos sao fixos | `17.5rem 1fr 1fr 17.5rem` — fixo nas pontas, flexivel no centro |
| Esconder imagem com JS no mobile | Classe `desktop-only` com `display: none` no mobile |
| Posicionar cards com `order` | `grid-column: 2 / 4` com nth-child — explicito e previsivel |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre grid lines, import condicional e decisoes de layout
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-secao-features-parte-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-secao-features-parte-1/references/code-examples.md)
