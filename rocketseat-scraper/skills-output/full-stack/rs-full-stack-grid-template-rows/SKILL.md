---
name: rs-full-stack-grid-template-rows
description: "Applies CSS Grid grid-template-rows patterns when structuring row layouts. Use when user asks to 'create a grid layout', 'define row heights', 'set up grid rows', 'structure a page layout with grid', or any CSS Grid row configuration. Enforces correct usage of px, fr, %, repeat() for row definitions, and height context awareness. Make sure to use this skill whenever generating CSS Grid layouts that need explicit row sizing. Not for flexbox layouts, grid-template-columns only tasks, or grid item placement (grid-row/grid-column)."
---

# Grid Template Rows

> Defina alturas de linhas no CSS Grid usando grid-template-rows com unidades fixas, fracionarias e percentuais, sempre garantindo contexto de altura no container.

## Rules

1. **Defina altura no container antes de usar fr/% nas rows** — `height: 100vh` ou valor explicito, porque fr e % calculam baseado na altura disponivel do pai, sem altura definida o resultado e imprevisivel
2. **Rows nao definidas herdam altura automatica do conteudo** — se voce define apenas 2 rows mas tem 4 linhas, as linhas 3 e 4 terao altura automatica baseada no conteudo
3. **Use repeat() para rows uniformes** — `repeat(3, 1fr)` em vez de `1fr 1fr 1fr`, porque e mais legivel e escalavel
4. **Combine unidades fixas + flexiveis** — `200px 1fr 2fr 1fr` permite header fixo com distribuicao proporcional do espaco restante
5. **1fr equivale a "todo o espaco restante"** — quando ha uma unica fracao apos valores fixos, ela ocupa tudo que sobrou, similar a `100%` nesse contexto
6. **Reset margens do body para grid full-viewport** — `margin: 0` no body, porque margens padrao do navegador causam overflow indesejado

## How to write

### Rows com altura fixa + fracionaria

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 200px 1fr 2fr 1fr;
  height: 100vh; /* Contexto de altura obrigatorio para fr funcionar */
}
```

### Rows uniformes com repeat

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  height: 100vh;
}
```

### Rows parcialmente definidas

```css
/* Apenas 2 primeiras rows definidas, demais serao automaticas */
.grid-container {
  display: grid;
  grid-template-rows: 200px 50%;
}
```

## Example

**Before (sem contexto de altura):**

```css
.app {
  display: grid;
  grid-template-rows: 1fr 2fr 1fr;
  /* Rows colapsam para altura do conteudo — fr nao tem referencia */
}
```

**After (com contexto de altura):**

```css
.app {
  display: grid;
  grid-template-rows: 1fr 2fr 1fr;
  height: 100vh; /* Agora fr distribui os 100vh proporcionalmente */
}
body {
  margin: 0; /* Remove overflow causado por margens padrao */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Header com altura fixa + conteudo flexivel | `grid-template-rows: 80px 1fr` |
| Layout simetrico (3x3, 4x4) | `repeat(N, 1fr)` em rows e columns |
| Rows com fr/% nao funcionam | Verificar se o container tem altura explicita |
| Mistura de fixo + flexivel | Fixo primeiro, fr para o restante: `200px 150px 1fr` |
| Grid ocupa viewport inteira | `height: 100vh` + `body { margin: 0 }` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|---------------------|
| `grid-template-rows: 1fr 1fr 1fr` sem height | Adicione `height: 100vh` ou valor explicito |
| `grid-template-rows: 100%` pensando que preenche tudo | Use `1fr` que e semanticamente correto |
| `1fr 1fr 1fr` repetitivo | `repeat(3, 1fr)` |
| Definir todas as rows quando so precisa de 2 | Defina apenas as necessarias, o CSS calcula o resto |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre altura em Grid, analogia com columns, e como o navegador calcula fr sem altura definida
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes e combos columns+rows