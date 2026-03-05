---
name: rs-full-stack-grid-row
description: "Applies CSS grid-row positioning when writing grid layouts. Use when user asks to 'create a layout', 'position grid items', 'use grid-row', 'build a page layout with CSS Grid', or any grid item placement task. Enforces grid-row-start/end and shorthand, virtual line understanding, and implicit row creation awareness. Make sure to use this skill whenever positioning grid children vertically. Not for grid container setup, grid-template-columns, or Flexbox layouts."
---

# Grid Row — Posicionamento Vertical de Items no Grid

> Posicione elementos filhos do grid verticalmente usando linhas virtuais de row, entendendo quando o grid cria linhas implícitas automaticamente.

## Rules

1. **Use grid-row shorthand** — `grid-row: 1 / 4` em vez de `grid-row-start` + `grid-row-end` separados, porque reduz código e é o padrão da indústria
2. **Linhas virtuais de row são independentes das de column** — row refere-se às linhas horizontais que delimitam as faixas verticais do grid, não confundir com as linhas virtuais de coluna
3. **Grid cria linhas implícitas para elementos sem configuração** — se um item ocupa rows 1-4 mas existem mais items, o grid extrapola e cria rows extras automaticamente
4. **Não faça engenharia demais** — configure apenas os items que precisam de posicionamento explícito; o grid auto-posiciona os restantes nos espaços vazios
5. **Combine grid-column e grid-row** — layouts complexos exigem posicionamento nos dois eixos simultaneamente

## How to write

### Shorthand grid-row

```css
/* Shorthand: start / end */
.header {
  grid-row: 1 / 4;
}

/* Equivalente longo (evitar): */
.header {
  grid-row-start: 1;
  grid-row-end: 4;
}
```

### Posicionamento combinado (column + row)

```css
.main {
  grid-column: 2 / 4;
  grid-row: 1 / 3;
}
```

### Deixar o grid auto-posicionar

```css
/* Apenas posicione os items que PRECISAM de posição explícita */
.header {
  grid-row: 1 / 4;
}
.main {
  grid-column: 2 / 4;
  grid-row: 1 / 3;
}
/* .aside e .footer NÃO precisam de grid-row — o grid preenche automaticamente */
```

## Example

**Before (posicionando todos os items manualmente):**
```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.header { grid-row: 1 / 4; }
.main { grid-column: 2 / 4; grid-row: 1 / 3; }
.aside { grid-column: 3 / 4; grid-row: 2 / 3; }
.footer { grid-column: 1 / 4; grid-row: 4 / 5; }
```

**After (confiando no auto-placement do grid):**
```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.header { grid-row: 1 / 4; }
.main { grid-column: 2 / 4; grid-row: 1 / 3; }
/* aside e footer se encaixam automaticamente nos espaços restantes */
```

## Heuristics

| Situação | Faça |
|----------|------|
| Item precisa ocupar múltiplas rows | Use `grid-row: start / end` |
| Item ocupa apenas 1 row na posição natural | Não defina grid-row — auto-placement resolve |
| Layout com 3 colunas e items variados | Configure apenas os items que cruzam múltiplas rows/columns |
| Grid mostra rows extras inesperadas | Items sem configuração causaram linhas implícitas — é normal |
| Precisa posicionar nos dois eixos | Combine `grid-column` e `grid-row` no mesmo item |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `grid-row-start: 1; grid-row-end: 4;` | `grid-row: 1 / 4;` |
| grid-row em TODOS os items | grid-row apenas nos que precisam de posição explícita |
| Confundir linhas virtuais de row com column | Identificar separadamente: rows = horizontais, columns = verticais |
| Criar rows no template só para posicionar 1 item | Usar grid-row no item filho diretamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre linhas virtuais, grid implícito e auto-placement
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-grid-row/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-grid-row/references/code-examples.md)
