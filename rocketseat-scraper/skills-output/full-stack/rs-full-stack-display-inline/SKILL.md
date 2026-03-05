---
name: rs-full-stack-display-inline
description: "Enforces correct CSS display inline behavior when styling inline elements like span, a, strong, em. Use when user asks to 'style a span', 'add margin to inline element', 'fix inline element spacing', or 'why width not working on span'. Applies rules: no width/height on inline, only horizontal margin/padding/border push elements, vertical padding/border renders but does not push. Make sure to use this skill whenever debugging inline element layout issues. Not for flexbox, grid, or display block topics."
---

# Display Inline

> Elementos inline ocupam apenas o espaco do conteudo e so aplicam valores horizontais de margin, padding e border no fluxo do layout.

## Rules

1. **Inline ocupa so o espaco do conteudo** — a caixa envolve apenas o texto/conteudo, sem preencher a linha toda, porque diferente de block, inline nao reclama a linha inteira
2. **Elementos inline ficam em linha** — um ao lado do outro no mesmo fluxo, porque "inline" significa literalmente "em linha"
3. **Largura e altura nao se aplicam** — `width` e `height` sao ignorados em elementos inline, porque o tamanho e determinado pelo conteudo
4. **Margin so funciona horizontal** — `margin-top` e `margin-bottom` nao tem efeito, apenas `margin-left` e `margin-right` empurram elementos
5. **Padding renderiza mas so empurra horizontal** — padding vertical aparece visualmente mas nao empurra elementos acima/abaixo, causando sobreposicao
6. **Border renderiza mas so empurra horizontal** — bordas verticais aparecem mas nao afetam o fluxo vertical, sobrepondo elementos adjacentes

## How to write

### Estilizando inline corretamente

```css
/* Correto: apenas valores horizontais */
span {
  margin-left: 20px;
  margin-right: 20px;
  padding-left: 10px;
  padding-right: 10px;
  border-left: 2px solid #333;
  border-right: 2px solid #333;
}
```

### Elementos inline por padrao

```html
<!-- Estes sao inline por padrao -->
<a href="#">Link</a>
<span>Texto</span>
<strong>Negrito</strong>
<em>Italico</em>
```

## Example

**Before (bug comum — width/height ignorados):**

```css
span {
  width: 200px;    /* ignorado */
  height: 100px;   /* ignorado */
  margin: 20px;    /* top/bottom ignorados */
  padding: 20px;   /* top/bottom renderiza mas nao empurra */
}
```

**After (com entendimento correto):**

```css
span {
  /* Se precisa de width/height, mude para inline-block ou block */
  margin-left: 20px;
  margin-right: 20px;
  padding-left: 20px;
  padding-right: 20px;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| `width`/`height` nao funciona | Verifique se o elemento e inline — se for, use `display: inline-block` ou `block` |
| Margin vertical sem efeito | Elemento e inline — so horizontal funciona |
| Padding vertical causa sobreposicao | Comportamento esperado de inline — padding renderiza mas nao empurra verticalmente |
| Precisa de inline + dimensoes | Use `display: inline-block` |
| Elementos nao ficam lado a lado | Verifique se ha um `display: block` entre eles quebrando o fluxo |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `span { width: 200px; }` | `span { display: inline-block; width: 200px; }` |
| `a { height: 50px; }` | `a { display: inline-block; height: 50px; }` |
| `span { margin-top: 20px; }` esperando empurrar | Use `display: block` ou `inline-block` se precisa de margin vertical |
| Padding vertical em inline esperando layout correto | Aceite sobreposicao ou mude o display |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre comportamento inline, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes