---
name: rs-discover-entendendo-margin-e-padding
description: "Applies correct margin and padding shorthand patterns when writing CSS box model code. Use when user asks to 'add spacing', 'style a component', 'write CSS', 'add margin', 'add padding', or any layout task involving internal/external spacing. Enforces clockwise shorthand (top-right-bottom-left), distinguishes margin vs padding use cases, and prevents common shorthand mistakes. Make sure to use this skill whenever generating CSS spacing properties. Not for Flexbox gap, Grid gap, or JavaScript layout calculations."
---

# Margin e Padding — Box Model Spacing

> Margin controla espaco externo da caixa, padding controla espaco interno. Use shorthand no sentido do relogio: top, right, bottom, left.

## Rules

1. **Padding = espaco interno** — espaco entre o conteudo e a borda da caixa, porque padding "empurra" o conteudo para dentro
2. **Margin = espaco externo** — espaco entre a borda da caixa e os elementos vizinhos, porque margin "empurra" outros elementos para fora
3. **Use shorthand sempre que possivel** — `margin: 56px auto 0` em vez de declarar cada lado separado, porque reduz repeticao e facilita leitura
4. **Shorthand segue o relogio** — top → right → bottom → left (sentido horario), porque e o padrao CSS universal
5. **Nao defina altura fixa em caixas com conteudo dinamico** — deixe padding + conteudo determinarem a altura, porque a caixa deve crescer conforme o conteudo aumenta
6. **Use bordas temporarias para debug** — `border: 1px solid red` ajuda a visualizar a caixa enquanto aprende, porque torna visivel o espaco que margin/padding ocupam

## How to write

### Shorthand com 1 valor (todos os lados iguais)

```css
/* Padding de 24px em todos os lados */
.profile {
  padding: 24px;
}
```

### Shorthand com 2 valores (vertical | horizontal)

```css
/* 56px em cima/embaixo, auto nas laterais */
.container {
  margin: 56px auto;
}
```

### Shorthand com 3 valores (top | horizontal | bottom)

```css
/* 56px em cima, auto nas laterais, 0 embaixo */
.container {
  margin: 56px auto 0;
}
```

### Shorthand com 4 valores (relogio completo)

```css
/* top: 56px, right: auto, bottom: 0, left: auto */
.container {
  margin: 56px auto 0 auto;
}
```

## Example

**Before (verboso e repetitivo):**

```css
.container {
  margin-top: 56px;
  margin-right: auto;
  margin-bottom: 0;
  margin-left: auto;
}

.profile {
  padding-top: 24px;
  padding-right: 24px;
  padding-bottom: 24px;
  padding-left: 24px;
}

.text {
  margin-top: 8px;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
}
```

**After (com shorthand):**

```css
.container {
  margin: 56px auto 0;
}

.profile {
  padding: 24px;
}

.text {
  margin-top: 8px;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Todos os lados iguais | 1 valor: `padding: 24px` |
| Vertical e horizontal diferentes | 2 valores: `margin: 56px auto` |
| Top diferente de bottom, laterais iguais | 3 valores: `margin: 56px auto 0` |
| Todos os lados diferentes | 4 valores (relogio): `padding: 10px 20px 30px 40px` |
| Apenas 1 lado precisa de espaco | Propriedade individual: `margin-top: 8px` |
| Nao entende o layout da caixa | Adicione `border: 1px solid red` temporariamente |
| Caixa com conteudo dinamico | Nunca defina `height` fixa, deixe padding + conteudo crescerem |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `margin-top: 24px; margin-right: 24px; margin-bottom: 24px; margin-left: 24px` | `margin: 24px` |
| `padding-top: 10px; padding-bottom: 10px` (com laterais zeradas) | `padding: 10px 0` |
| `height: 200px` em caixa com conteudo variavel | Deixe sem height, use padding |
| Shorthand com ordem errada (left-bottom-right-top) | Sempre relogio: top-right-bottom-left |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre box model, analogia do relogio e quando usar margin vs padding
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes