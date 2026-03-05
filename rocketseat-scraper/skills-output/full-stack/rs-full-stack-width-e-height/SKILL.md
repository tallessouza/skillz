---
name: rs-full-stack-width-e-height
description: "Applies CSS width and height best practices when styling HTML elements. Use when user asks to 'set element size', 'define width', 'define height', 'style a box', 'fix overflow', or any CSS sizing task. Enforces rules: avoid fixed height on text containers, use min/max constraints, understand block vs inline sizing limits, handle overflow. Make sure to use this skill whenever sizing elements with CSS. Not for Flexbox/Grid layout, responsive units, or media queries."
---

# Width e Height no CSS

> Defina larguras comConstraintionts (min/max), evite alturas fixas em containers de texto, e nunca aplique sizing em elementos inline.

## Rules

1. **Nunca defina height fixo em containers de texto** — porque o conteudo e dinamico e vai transbordar (overflow), criando sobreposicao visual
2. **Use min-width e max-width para criar faixas de largura** — porque isso permite flexibilidade dentro de limites controlados
3. **Nunca aplique width/height em elementos inline** — `span`, `a`, `strong` ignoram essas propriedades, porque inline nao aceita dimensoes de caixa
4. **min/max tem prioridade sobre width/height** — mesmo que `height` venha depois na cascata, `max-height` vence, porque e uma regra de especificidade do CSS
5. **Use border para debug visual** — `border: 1px solid` revela o tamanho real da caixa durante desenvolvimento

## How to write

### Largura com constraints

```css
.container {
  width: 500px;
  min-width: 200px;  /* nunca menor que 200px */
  max-width: 800px;  /* nunca maior que 800px */
}
```

### Altura segura (sem fixar em texto)

```css
/* CORRETO: altura minima, cresce com conteudo */
.card {
  min-height: 200px;
}

/* ERRADO: altura fixa causa overflow */
.card {
  height: 200px; /* texto vai transbordar */
}
```

### Debug visual de caixas

```css
.debug {
  border: 1px solid red;
}
```

## Example

**Before (overflow por altura fixa):**

```css
.text-box {
  width: 50px;
  height: 50px;
  /* texto longo transborda, encavala com outros elementos */
}
```

**After (com constraints seguros):**

```css
.text-box {
  max-width: 300px;
  min-height: 50px;
  /* largura limitada, altura cresce com conteudo */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Container com texto dinamico | Use `min-height`, nunca `height` fixo |
| Precisa limitar largura | Use `min-width` + `max-width` como faixa |
| Elemento inline precisa de tamanho | Troque para `display: block` ou `inline-block` primeiro |
| Nao sabe o tamanho real da caixa | Adicione `border: 1px solid` temporario |
| `width` nao esta funcionando | Verifique se o elemento e inline |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `height: 400px` em div com texto | `min-height: 400px` |
| `width: 200px` em `<span>` | `display: inline-block; width: 200px` |
| Adivinhar altura para caber texto | Deixar altura automatica ou usar `min-height` |
| Ignorar overflow apos sizing | Verificar se conteudo cabe na caixa definida |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre overflow, cascata min/max vs width/height, e block vs inline
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes