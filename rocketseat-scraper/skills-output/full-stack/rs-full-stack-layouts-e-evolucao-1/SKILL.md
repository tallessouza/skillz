---
name: rs-full-stack-layouts-e-evolucao-1
description: "Applies correct CSS layout strategy (normal flow, flexbox, grid) when writing HTML/CSS code. Use when user asks to 'create a layout', 'align elements', 'build a page structure', 'use flexbox', 'use grid', or any CSS positioning task. Enforces modern layout selection: flexbox for unidirectional alignment, grid for bidirectional columns+rows. Make sure to use this skill whenever generating CSS layout code. Not for animations, colors, typography, or non-layout styling."
---

# Layouts CSS — Evolucao e Escolha Correta

> Escolha o modelo de layout pelo comportamento desejado: normal flow para blocos simples, flexbox para alinhamento unidirecional, grid para grades bidirecionais.

## Rules

1. **Use normal flow como base** — elementos block empilham verticalmente, inline ficam em linha, porque esse e o comportamento padrao e nao precisa de display explicito
2. **Nunca use table para layout** — `display: table` e para dados tabulares, nao para estrutura de pagina, porque table mistura semantica com apresentacao
3. **Nunca use float para layout** — `float` era workaround da era tableless, porque exige `clear: both` e quebra o normal flow de formas imprevisiveis
4. **Flexbox para uma direcao** — use quando alinhamento e em row OU column, porque flexbox e unidirecional por design
5. **Grid para duas direcoes** — use quando precisa controlar colunas E linhas simultaneamente, porque grid trabalha nos dois eixos ao mesmo tempo
6. **Flexbox e grid no container** — aplique `display: flex` ou `display: grid` no elemento pai, porque as propriedades afetam os filhos diretos

## Como escolher

| Necessidade | Layout | Motivo |
|-------------|--------|--------|
| Elementos empilhados verticalmente | Normal flow | Ja e o padrao, nao precisa de nada |
| Itens lado a lado em uma linha | Flexbox (`flex-direction: row`) | Unidirecional horizontal |
| Itens empilhados com controle de espacamento | Flexbox (`flex-direction: column`) | Unidirecional vertical |
| Grade com colunas e linhas definidas | Grid (`grid-template-columns/rows`) | Bidirecionnal |
| Layout de pagina completo (header, sidebar, main, footer) | Grid | Requer controle nos dois eixos |
| Navbar com itens alinhados | Flexbox | Uma direcao com justify-content |

## How to write

### Flexbox — container e itens

```css
.container {
  display: flex;
  justify-content: center;      /* alinha no eixo principal */
  align-items: center;          /* alinha no eixo cruzado */
  gap: 1rem;
}

/* Mudar direcao: row (padrao) ou column */
.container--vertical {
  display: flex;
  flex-direction: column;
}
```

### Grid — colunas e linhas

```css
.grid {
  display: grid;
  grid-template-columns: 200px 1fr 200px;  /* 3 colunas */
  grid-template-rows: auto 1fr auto;        /* 3 linhas */
  gap: 1rem;
}
```

## Example

**Before (float — era tableless):**
```css
.sidebar { float: left; width: 200px; }
.main { float: left; width: calc(100% - 200px); }
.footer { clear: both; }
```

**After (grid moderno):**
```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr auto;
}
.footer {
  grid-column: 1 / -1;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa alinhar itens numa barra horizontal | Flexbox com `justify-content` |
| Precisa de grade com areas nomeadas | Grid com `grid-template-areas` |
| Um elemento ao lado do outro, so isso | Flexbox |
| Layout de pagina inteira com sidebar + header + content | Grid |
| Encontrou `float: left/right` em codigo legado | Substitua por flexbox ou grid |
| Encontrou `display: table` para layout | Substitua por grid |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `float: left` para layout | `display: flex` no container |
| `display: table` para layout | `display: grid` no container |
| `clear: both` para resetar float | Remova floats, use flex/grid |
| `display: inline-block` + hack de espacamento | `display: flex; gap: 1rem` |
| Margin auto em tudo para alinhar | `justify-content` / `align-items` no flex container |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre a evolucao historica e quando cada modelo faz sentido
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula expandidos com variacoes