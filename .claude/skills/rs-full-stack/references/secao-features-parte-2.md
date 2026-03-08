---
name: rs-full-stack-secao-features-parte-2
description: "Applies CSS Grid card positioning, overflow control, and filter effects when building feature section layouts. Use when user asks to 'create a features section', 'position cards in a grid', 'add drop shadow to images', 'arrange cards with CSS Grid', or 'build a product landing page section'. Covers grid-column/grid-row placement, overflow hidden for contained elements, position absolute inside cards, and CSS filter drop-shadow. Make sure to use this skill whenever positioning cards in grid layouts or applying image filter effects. Not for JavaScript logic, animations, or backend code."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: "CSS Grid Cards"
  tags: ['css', 'grid', 'cards', 'filter', 'drop-shadow', 'position']
---

# Seção Features — Grid Cards com Filtros e Posicionamento

> Posicione cards em CSS Grid usando grid-column e grid-row explícitos, contenha elementos com overflow hidden, e aplique sombras com filter: drop-shadow.

## Rules

1. **Use overflow hidden no card container** — impede transbordo de elementos posicionados absolutamente, porque imagens decorativas não devem vazar do card
2. **Posicione imagens decorativas com position absolute** — o card pai recebe `position: relative`, a imagem decorativa recebe `position: absolute` com coordenadas `top/bottom/left/right`, porque permite sobreposição controlada
3. **Limite largura com max-width** — tanto o card quanto imagens internas devem ter `max-width` definido, porque evita estouro em telas menores
4. **Use grid-column e grid-row explícitos** — defina início e fim das linhas do grid para cada card, porque garante posicionamento preciso independente da ordem no DOM
5. **Use filter: drop-shadow em vez de box-shadow para imagens** — `drop-shadow` respeita a forma real da imagem (transparência), porque `box-shadow` aplica sombra no retângulo do elemento
6. **Use margin-left: auto para empurrar elementos** — em vez de floats ou posicionamento absoluto, `margin-left: auto` empurra o conteúdo para a direita dentro do container flex/block

## How to write

### Card com imagem decorativa posicionada

```css
.card {
  position: relative;
  overflow: hidden;
}

.card .desktop-only {
  position: absolute;
  max-width: 15rem;
  bottom: 2rem;
  right: 2rem;
}

.card > div:first-child {
  max-width: 16rem;
}
```

### Posicionamento explícito no Grid

```css
/* Card ocupa colunas 4-5 */
.card:nth-child(3) {
  grid-column: 4 / 5;
}

/* Card na linha inferior, colunas 1-3 */
.card:nth-child(4) {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
}

/* Card na linha inferior, colunas 3-5 */
.card:nth-child(5) {
  grid-column: 3 / 5;
  grid-row: 2 / 3;
}
```

### Filter drop-shadow em imagens

```css
.card img {
  filter: drop-shadow(1rem 1rem 4rem rgba(0, 0, 0, 0.34));
}
```

### Inverter posição da imagem decorativa

```css
.card:nth-child(4) .desktop-only {
  left: 2rem; /* em vez de right */
}

.card:nth-child(4) {
  margin-left: auto; /* empurra conteúdo para direita */
}
```

## Example

**Before (cards sem posicionamento explícito):**
```css
.features .card {
  /* Sem grid-column/row — depende da ordem do DOM */
}
.features .card img.decorative {
  /* Sem contenção — imagem vaza do card */
}
```

**After (com posicionamento e contenção):**
```css
.features .card {
  position: relative;
  overflow: hidden;
}

.features .card:nth-child(4) {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  margin-left: auto;
}

.features .card img.decorative {
  position: absolute;
  max-width: 15rem;
  bottom: 2rem;
  right: 2rem;
  filter: drop-shadow(1rem 1rem 4rem rgba(0, 0, 0, 0.34));
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Imagem decorativa dentro de card | `position: absolute` + `overflow: hidden` no pai |
| Card precisa ocupar posição específica no grid | `grid-column` e `grid-row` explícitos |
| Sombra em imagem com transparência | `filter: drop-shadow()` em vez de `box-shadow` |
| Conteúdo precisa ir para a direita | `margin-left: auto` |
| Imagem decorativa espelhada (lado oposto) | Troque `right` por `left` (ou vice-versa) |
| Linhas do grid confusas | Lembre: linha 1 = topo, linha 2 = entre rows, linha 3 = fundo |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `box-shadow` em imagens PNG com transparência | `filter: drop-shadow(...)` |
| Cards sem `overflow: hidden` com elementos absolutos | `overflow: hidden` no container |
| `float: right` para empurrar conteúdo | `margin-left: auto` |
| Grid implícito para layouts complexos de cards | `grid-column` e `grid-row` explícitos |
| `width: 15rem` fixo em imagens decorativas | `max-width: 15rem` para flexibilidade |

## Troubleshooting

| Sintoma | Causa provavel | Solucao |
|---------|---------------|---------|
| Imagem decorativa vazando do card | Card sem `overflow: hidden` | Adicione `overflow: hidden` no container do card |
| Sombra aparece como retangulo em imagem PNG | Usando `box-shadow` em vez de `filter` | Use `filter: drop-shadow(...)` que respeita a forma real da imagem |
| Card posicionado na celula errada do grid | Valores de `grid-column`/`grid-row` incorretos | Revise as grid lines — linha 1 = topo, linha 2 = entre rows |
| Conteudo nao empurra para a direita | Usando `float` ou `position` para alinhar | Use `margin-left: auto` para empurrar conteudo para a direita |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre grid lines, filter functions e overflow
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-secao-features-parte-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-secao-features-parte-2/references/code-examples.md)
