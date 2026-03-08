---
name: rs-full-stack-gap-e-margin
description: "Applies CSS Gap and Margin auto spacing patterns when writing Flexbox or Grid layouts. Use when user asks to 'add spacing between elements', 'align items', 'center a div', 'push element to the right', or any layout spacing task. Enforces correct Gap units and Margin auto tricks for alignment. Make sure to use this skill whenever generating CSS layouts with spacing needs. Not for typography, font sizing, or padding inside elements."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-flexbox
  tags: [css, gap, margin, flexbox, grid, spacing, alignment]
---

# Gap e Margin

> Use Gap para espaçamento entre elementos e Margin auto para alinhamento e distribuição de espaço.

## Rules

1. **Use Gap para espaço entre elementos** — `gap: 20px` no container, não margin individual em cada filho, porque Gap é declarativo e não causa colapso de margem
2. **Gap aceita qualquer unidade** — fixa (`20px`), relativa (`10%`), ou flexível (`2rem`), porque a propriedade é agnóstica de unidade
3. **Use Margin auto para empurrar elementos** — `margin-left: auto` empurra o elemento para a direita consumindo todo espaço disponível, porque o navegador distribui o espaço restante automaticamente
4. **Margin auto é alinhamento, não espaçamento** — use para posicionar elementos dentro do container, não para criar gaps uniformes entre eles

## How to write

### Gap no container

```css
.container {
  display: flex;
  gap: 20px; /* fixa */
  /* gap: 10%; */   /* relativa */
  /* gap: 2rem; */  /* flexível */
}
```

### Margin auto para empurrar

```css
/* Empurra elemento e todos após ele para a direita */
.first-item {
  margin-left: auto;
}

/* Empurra todos após o primeiro para a direita */
.first-item {
  margin-right: auto;
}

/* Empurra elemento para baixo (com altura definida e align-items: center) */
.item {
  margin-top: auto;
}
```

## Example

**Before (margin manual em cada filho):**
```css
.container { display: flex; }
.item { margin-right: 20px; }
.item:last-child { margin-right: 0; }
.item-last { float: right; }
```

**After (com Gap e Margin auto):**
```css
.container {
  display: flex;
  gap: 20px;
  align-items: center;
}
.item-push-right {
  margin-left: auto;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Espaçamento uniforme entre filhos | `gap` no container |
| Empurrar um item para o final do eixo | `margin-left: auto` (row) ou `margin-top: auto` (column) |
| Centralizar um item isolado no eixo | `margin-left: auto; margin-right: auto` |
| Gap diferente entre linhas e colunas | `row-gap: 10px; column-gap: 20px` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `margin-right` em cada filho + `:last-child` reset | `gap` no container |
| `float: right` para empurrar elemento | `margin-left: auto` no elemento |
| `justify-content: space-between` só para empurrar 1 item | `margin-left: auto` no item |
| `position: absolute` para alinhar dentro de flex | `margin-top: auto` ou `margin-left: auto` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `gap` nao funciona | Elemento nao e flex ou grid container | Aplique `display: flex` ou `display: grid` no container |
| `margin-left: auto` nao empurra elemento | Container nao e flex | Adicione `display: flex` no container pai |
| Espacamento nas bordas externas indesejado | Usando `margin` em vez de `gap` | Troque para `gap` no container — aplica apenas entre filhos |
| `margin-top: auto` sem efeito | Container sem altura definida | Defina `height` ou `min-height` no container flex |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre Gap vs Margin e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações