---
name: rs-full-stack-box-sizing-1
description: "Enforces correct CSS box-sizing usage when writing layouts or styling elements. Use when user asks to 'style a component', 'fix layout overflow', 'add padding', 'set width and padding', or 'element is bigger than expected'. Applies border-box by default, explains content-box vs border-box calculation. Make sure to use this skill whenever generating CSS that combines width/height with padding or borders. Not for Flexbox/Grid alignment, animations, or typography."
---

# Box Sizing

> Sempre usar `box-sizing: border-box` para que width/height incluam padding e border no calculo, evitando overflow inesperado.

## Rules

1. **Use `border-box` como padrao global** — `* { box-sizing: border-box; }`, porque o padrao `content-box` soma padding e border ALEM da width declarada, causando overflow
2. **Nunca confie no `content-box` para layouts com padding** — width 200px + padding 40px = 280px de largura real em content-box, porque o calculo soma conteudo + padding + border
3. **Diagnostique overflow verificando box-sizing** — quando um elemento esta maior que o esperado, verifique primeiro se box-sizing esta como content-box, porque padding esta sendo somado a width

## How to write

### Reset global (recomendado)

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

### Elemento com padding seguro

```css
.card {
  width: 200px;
  padding: 40px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  /* Largura total = 200px (border a border) */
}
```

## Example

**Before (content-box — overflow):**

```css
.container {
  width: 100%;
  padding: 20px;
  border: 2px solid black;
  /* Largura real = 100% + 40px padding + 4px border = TRANSBORDA o pai */
}
```

**After (border-box — contido):**

```css
.container {
  width: 100%;
  padding: 20px;
  border: 2px solid black;
  box-sizing: border-box;
  /* Largura real = 100% (padding e border calculados DENTRO) */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Novo projeto CSS | Adicione reset global `border-box` no topo |
| Elemento transbordando o pai | Verifique box-sizing antes de ajustar width |
| Width 100% + padding | Obrigatorio `border-box` |
| Elemento inline com padding | Padding cresce a caixa naturalmente (comportamento normal, nao afetado por box-sizing em width/height) |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `width: calc(100% - 40px)` para compensar padding | `width: 100%; box-sizing: border-box; padding: 20px;` |
| Reduzir padding para caber na width | Mude para `border-box` e mantenha o padding desejado |
| Ignorar porque "funciona no meu layout" | Aplique reset global para consistencia |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre content-box vs border-box, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes