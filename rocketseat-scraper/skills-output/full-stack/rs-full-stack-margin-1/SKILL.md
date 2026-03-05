---
name: rs-full-stack-margin-1
description: "Enforces correct CSS margin usage including shorthand syntax, auto centering, and margin collapsing awareness. Use when user asks to 'add spacing', 'center a div', 'add margin', 'space elements', or any CSS layout task involving element spacing. Applies shorthand order (top right bottom left), auto margin centering, and warns about margin collapsing between block elements. Make sure to use this skill whenever writing CSS that involves spacing between elements. Not for padding, border-spacing, or gap in flexbox/grid contexts."
---

# CSS Margin

> Margin e o espaco entre elementos — use shorthand para definir os 4 lados e entenda margin collapsing para evitar bugs de layout.

## Rules

1. **Use shorthand quando aplicar margin em multiplos lados** — `margin: 30px` ao inves de repetir `margin-top`, `margin-right`, etc., porque reduz codigo e segue a convencao padrao
2. **Ordem do shorthand e sentido relogio** — top, right, bottom, left (1 valor = todos, 2 = vertical/horizontal, 3 = top/horizontal/bottom, 4 = cada lado), porque e a convencao CSS universal
3. **Use `margin: auto` com width definida para centralizar blocos** — funciona apenas na horizontal e apenas em elementos block, porque auto calcula espacos iguais nas laterais
4. **Antecipe margin collapsing entre blocos verticais** — quando margin-bottom de um bloco encontra margin-top do proximo, nao somam — prevalece o maior valor, porque e comportamento padrao do CSS
5. **Elementos inline nao aceitam margin vertical** — margin-top e margin-bottom nao funcionam em elementos inline como `span`, porque o modelo de layout inline ignora dimensoes verticais
6. **Use a propriedade especifica quando precisa de margin em apenas um lado** — `margin-top: 30px` ao inves de shorthand, porque comunica intencao e evita efeitos colaterais

## How to write

### Shorthand — todos os lados iguais
```css
.element {
  margin: 30px; /* aplica 30px nos 4 lados */
}
```

### Shorthand — vertical e horizontal
```css
.element {
  margin: 30px 10px; /* 30px top/bottom, 10px left/right */
}
```

### Shorthand — 4 valores (sentido relogio)
```css
.element {
  margin: 30px 10px 80px 4rem; /* top right bottom left */
}
```

### Centralizar bloco com auto
```css
.element {
  width: 50%;
  margin: 0 auto; /* centraliza horizontalmente */
}
```

### Propriedade especifica
```css
.element {
  margin-top: 30px; /* apenas quando precisa de um unico lado */
}
```

## Example

**Before (bug de margin collapsing nao previsto):**
```css
.box-top {
  margin: 30px;
}
.box-bottom {
  margin: 30px;
}
/* Esperava 60px entre os blocos, mas fica apenas 30px */
```

**After (com conhecimento de collapsing):**
```css
.box-top {
  margin: 60px 30px 30px 30px;
}
.box-bottom {
  margin: 30px;
}
/* Ou use padding no container pai para evitar collapsing */
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Spacing igual nos 4 lados | `margin: 30px` (1 valor) |
| Centralizar bloco na pagina | `width` + `margin: 0 auto` |
| Espacamento so em cima | `margin-top: 30px` (propriedade especifica) |
| Dois blocos verticais com espaco previsivel | Lembre do collapsing — use padding no pai ou ajuste valores |
| Elemento inline precisa de espaco vertical | Mude para `display: block` ou `inline-block` primeiro |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `margin-top` em elemento inline sem mudar display | Mude para `display: inline-block` ou use `padding` |
| `margin: auto` sem definir `width` | Defina `width` antes de usar auto |
| Assumir que margins somam entre blocos verticais | Considere margin collapsing — prevalece o maior |
| 4 propriedades separadas quando shorthand resolve | `margin: 30px 10px 80px 4rem` em uma linha |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre margin collapsing, auto, e comportamento inline vs block
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes