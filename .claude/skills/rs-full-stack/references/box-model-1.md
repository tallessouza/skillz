---
name: rs-full-stack-box-model
description: "Applies CSS Box Model mental model when writing or reviewing HTML/CSS layout code. Use when user asks to 'style a page', 'add spacing', 'fix layout', 'add margin or padding', 'set width/height', or any CSS layout task. Ensures correct understanding of content, padding, border, and margin layers. Make sure to use this skill whenever generating CSS that involves spacing, sizing, or borders. Not for JavaScript logic, animations, or CSS selectors."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css
  tags: [css, box-model, padding, margin, border, layout]
---

# Box Model

> Todo elemento HTML e uma caixa com camadas: content, padding, border e margin — de dentro pra fora.

## Rules

1. **Pense em camadas de dentro pra fora** — content → padding → border → margin, porque cada camada afeta o tamanho final do elemento
2. **Width e height definem apenas o content** — por padrao (content-box), padding e border somam ao tamanho total, porque o navegador calcula o tamanho de fora somando todas as camadas
3. **Use `box-sizing: border-box`** — faz width/height incluirem padding e border, porque evita calculos manuais e surpresas de layout
4. **Padding e espaco INTERNO** — empurra o conteudo pra dentro da caixa, porque e o preenchimento entre o conteudo e a borda
5. **Margin e espaco EXTERNO** — empurra outras caixas pra longe, porque e o espacamento entre caixas vizinhas
6. **Border tem grossura propria** — adiciona pixels ao tamanho total (em content-box), porque a borda e uma camada fisica entre padding e margin

## How to write

### Espacamento interno (padding)

```css
/* Padding uniforme */
.card {
  padding: 20px;
}

/* Padding direcional: top/bottom | left/right */
.card {
  padding: 50px 20px;
}
```

### Espacamento externo (margin)

```css
/* Margin uniforme */
.section {
  margin: 30px;
}

/* Margin direcional: top | right | bottom | left */
.section {
  margin: 50px 30px 50px 30px;
}
```

### Box sizing correto

```css
/* Aplicar globalmente — padrao recomendado */
*, *::before, *::after {
  box-sizing: border-box;
}
```

## Example

**Before (tamanho imprevisivel):**

```css
.box {
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  margin: 30px;
}
/* Tamanho real renderizado: 300 + 40 + 10 = 350px */
```

**After (tamanho previsivel):**

```css
.box {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  margin: 30px;
}
/* Tamanho real renderizado: 300px (padding e border inclusos) */
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Espaco entre o texto e a borda | Use `padding` |
| Espaco entre dois elementos | Use `margin` |
| Elemento maior que o esperado | Verifique `box-sizing` — provavelmente padding/border somando |
| Margin nao aparece entre elementos | Investigue margin collapsing (margins verticais adjacentes colapsam) |
| Quer tamanho previsivel | Aplique `box-sizing: border-box` globalmente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Calcular width manualmente subtraindo padding | Use `box-sizing: border-box` |
| Usar margin pra espacamento interno | Use `padding` para espaco interno |
| Usar padding pra afastar elementos vizinhos | Use `margin` para espaco externo |
| Esquecer que border adiciona tamanho | Inclua border no calculo ou use border-box |


## Troubleshooting

| Problema | Solução |
|----------|---------|
| **Element larger than expected** | Check `box-sizing` — default `content-box` adds padding and border on top of the declared width. Use `border-box`. |
| **Margin between elements disappearing** | This is margin collapsing — adjacent vertical margins merge into the larger one. Use padding or a border to prevent it. |
| **Padding vs margin confusion** | Padding is space inside the border (between content and border). Margin is space outside the border (between elements). |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes