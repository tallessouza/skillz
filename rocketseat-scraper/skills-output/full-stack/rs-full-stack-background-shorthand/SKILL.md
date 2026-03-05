---
name: rs-full-stack-background-shorthand
description: "Enforces correct CSS background shorthand syntax when styling elements. Use when user asks to 'add background', 'set background image', 'style element background', 'apply background color and image', or any CSS background task. Applies rules: shorthand overrides previous individual properties, position before slash then size, color-url-repeat-position/size order. Make sure to use this skill whenever writing CSS background declarations. Not for CSS layout, flexbox, grid, or non-background styling."
---

# Background Shorthand no CSS

> Use uma unica propriedade `background` para aplicar cor, imagem, repeticao, posicao e tamanho — mas entenda que o shorthand substitui todas as propriedades individuais anteriores.

## Rules

1. **Shorthand sobrescreve propriedades individuais** — ao usar `background:`, todas as propriedades individuais (`background-color`, `background-image`, etc.) anteriores sao desconsideradas, porque o shorthand reseta tudo que nao foi explicitamente declarado
2. **Ordem: cor, url, repeat, position/size** — declare `cor url() repeat position / size`, porque o parser CSS espera essa sequencia
3. **Barra separa position de size** — escreva `center / cover`, nunca `center cover`, porque sem a barra o browser nao distingue posicao de tamanho
4. **Position composta usa espaco** — `top center` com espaco, depois barra, depois size: `top center / cover`
5. **Propriedades sao opcionais** — omita qualquer parte; so a URL ja e interpretada como `background-image`, so a cor como `background-color`
6. **Funciona em qualquer elemento** — `body`, `div`, `section` — o shorthand aplica fundo independente do elemento

## How to write

### Shorthand completo

```css
/* cor + imagem + no-repeat + posicao / tamanho */
body {
  background: #f0f0f0 url('https://example.com/img.jpg') no-repeat center / cover;
}
```

### Apenas cor

```css
body {
  background: #f0f0f0;
}
```

### Imagem com posicao composta

```css
body {
  background: url('img.jpg') no-repeat top center / contain;
}
```

### Em uma div com dimensoes fixas

```css
div {
  width: 300px;
  height: 300px;
  background: url('img.jpg') no-repeat center / cover;
}
```

## Example

**Before (propriedades individuais que serao sobrescritas):**

```css
body {
  background-color: gray;
  background-image: url('img.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

/* Depois alguem adiciona shorthand — TUDO acima e ignorado */
body {
  background: lightblue;
}
```

**After (shorthand unico e completo):**

```css
body {
  background: lightblue url('img.jpg') no-repeat center / cover;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de cor + imagem + posicao | Use shorthand unico |
| Precisa mudar so a cor depois | Use `background-color` individual para nao resetar imagem |
| Position com dois valores (ex: top center) | Espaco entre eles, barra antes do size |
| Quer `cover` ou `contain` | Sempre apos a barra `/` |
| Elemento sem dimensoes definidas | Defina `width`/`height` antes de aplicar background com size |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `background: center cover url(...)` | `background: url(...) no-repeat center / cover` |
| `background-size` apos `background:` shorthand | Inclua o size dentro do shorthand com `/` |
| `background: url(...) cover` sem barra | `background: url(...) center / cover` |
| Misturar shorthand com individuais no mesmo seletor | Escolha um: shorthand completo OU individuais |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre como o shorthand sobrescreve propriedades e ordem de parsing
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes