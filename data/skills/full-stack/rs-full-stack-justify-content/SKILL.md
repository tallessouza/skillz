---
name: rs-full-stack-justify-content
description: "Applies Flexbox justify-content distribution patterns when writing CSS layouts. Use when user asks to 'align items', 'distribute elements', 'space elements', 'center content', or 'create a flex layout'. Covers flex-start, flex-end, center, space-evenly, space-around, space-between along main axis. Make sure to use this skill whenever generating Flexbox layouts that need element distribution. Not for align-items, align-content, or Grid layout alignment."
---

# Justify Content — Distribuicao no Eixo Principal

> Justify-content distribui elementos ao longo do eixo principal do Flexbox — so funciona quando ha espaco sobrando no container.

## Rules

1. **Defina espaco no container antes de distribuir** — justify-content so funciona se o container tem espaco sobrando, porque sem espaco nao ha o que distribuir
2. **Em column, defina height explicitamente** — por padrao, a largura e 100% mas a altura nao existe, entao justify-content em column nao faz nada sem height definido
3. **Entenda que justify-content segue o eixo principal** — se flex-direction e row, distribui horizontalmente; se column, verticalmente; se row-reverse, o start e end invertem
4. **Diferencie os tres spaces** — space-between (entre elementos), space-around (ao redor de cada elemento), space-evenly (espacos iguais em todo lugar)

## How to write

### Distribuicao basica

```css
.container {
  display: flex;
  justify-content: space-between; /* elementos grudados nas bordas, espaco entre eles */
}
```

### Column com altura obrigatoria

```css
.container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* SEM ISSO, justify-content nao funciona em column */
  justify-content: center;
}
```

## Example

**Before (elementos sem distribuicao):**
```css
.nav {
  display: flex;
}
/* Todos os items grudados no inicio, espaco desperdicado a direita */
```

**After (com justify-content):**
```css
.nav {
  display: flex;
  justify-content: space-between;
}
/* Logo na esquerda, links na direita, espaco distribuido entre eles */
```

## Heuristics

| Situacao | Valor |
|----------|-------|
| Navbar com logo + links | `space-between` |
| Centralizar um grupo de elementos | `center` |
| Cards com espacamento uniforme | `space-evenly` |
| Elementos com "respiro" ao redor | `space-around` |
| Alinhar ao final (botoes de acao) | `flex-end` |
| Eixo invertido com row-reverse | Lembre que start/end invertem |

## Anti-patterns

| Nunca faca | Faca isso |
|------------|-----------|
| `justify-content: center` em column sem height | Defina `height` antes |
| Usar margin auto para distribuir N items | Use `justify-content` com o valor adequado |
| Confundir space-around com space-evenly | Around = espacos dobram entre items; Evenly = todos iguais |
| Usar justify-content para alinhar no eixo cruzado | Use `align-items` para eixo cruzado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes