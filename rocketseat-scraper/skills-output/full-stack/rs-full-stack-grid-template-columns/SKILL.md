---
name: rs-full-stack-grid-template-columns
description: "Applies CSS Grid grid-template-columns patterns when writing layout code. Use when user asks to 'create a grid layout', 'make columns', 'CSS grid', 'responsive columns', or 'split into columns'. Enforces correct use of fr units, repeat(), and mixed units. Make sure to use this skill whenever generating CSS Grid column layouts. Not for Flexbox, grid-template-rows, or grid-template-areas."
---

# Grid Template Columns

> Ao definir colunas em CSS Grid, use `grid-template-columns` no container pai com unidades apropriadas — `fr` para flexibilidade, valores fixos para controle, e `repeat()` para evitar repeticao.

## Rules

1. **Defina colunas no container pai** — `grid-template-columns` vai no elemento pai (grid container), porque ele controla o layout dos filhos
2. **Use `fr` para distribuicao flexivel** — `1fr 1fr 1fr` distribui igualmente, porque `fr` (fraction) divide o espaco disponivel proporcionalmente
3. **Use `repeat()` quando colunas sao iguais** — `repeat(3, 1fr)` em vez de `1fr 1fr 1fr`, porque evita repeticao e deixa claro a intencao
4. **Entenda que `fr` pega o que sobra** — ao misturar `fr` com unidades fixas (`px`, `%`, `vw`), a fracao ocupa apenas o espaco restante
5. **Itens excedentes criam novas linhas automaticamente** — se ha 4 itens e 3 colunas definidas, o 4o item vai para a linha seguinte automaticamente
6. **Nunca confunda `fr` com `%`** — `1fr` e flexivel e preenche o restante; `50%` e fixo relativo ao container e pode causar overflow

## How to write

### Colunas iguais com repeat()

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

### Colunas com proporcoes diferentes

```css
.container {
  display: grid;
  /* Coluna do meio recebe o dobro de espaco */
  grid-template-columns: 1fr 2fr 1fr;
}
```

### Misturando unidades fixas e flexiveis

```css
.container {
  display: grid;
  /* Sidebar fixa, conteudo flexivel */
  grid-template-columns: 250px 1fr;
}
```

## Example

**Before (sem grid, divs empilhadas):**

```css
.container {
  /* Divs filhas ficam uma embaixo da outra */
}
.item {
  width: 33.33%;
  float: left; /* Hack antigo */
}
```

**After (com grid-template-columns):**

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
/* Nenhum estilo necessario nos filhos — o grid controla o layout */
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Todas as colunas iguais | `repeat(N, 1fr)` |
| Coluna central maior | `1fr 2fr 1fr` ou proporcoes desejadas |
| Sidebar fixa + conteudo flexivel | `250px 1fr` |
| Mistura de unidades | Coloque `fr` por ultimo — ele pega o que sobra |
| Mais itens que colunas | Nao faca nada — o grid cria linhas automaticas |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `1fr 1fr 1fr 1fr 1fr 1fr` | `repeat(6, 1fr)` |
| `width: 33.33%; float: left` | `grid-template-columns: repeat(3, 1fr)` |
| `grid-template-columns` no filho | `grid-template-columns` no container pai |
| `50% 50%` para duas colunas iguais | `repeat(2, 1fr)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre fr vs outras unidades, overflow, e linhas automaticas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes