---
name: rs-discover-background-css
description: "Applies CSS background properties correctly when styling page backgrounds with images. Use when user asks to 'add background image', 'set page background', 'style body background', 'use background shorthand', or any CSS background task. Enforces proper use of background-image url(), no-repeat, position with axis control, cover vs contain, and shorthand syntax. Make sure to use this skill whenever generating CSS that involves background images or background shorthand. Not for CSS colors-only, gradients, or JavaScript-based image manipulation."
---

# CSS Background com Imagens

> Ao aplicar imagens de fundo com CSS, use a propriedade `background` shorthand com url, no-repeat, posicionamento por eixo e cover para cobrir toda a area visivel.

## Rules

1. **Use `url()` com caminho relativo** — `url(./assets/bg.png)` nao `url(bg.png)`, porque o caminho parte do arquivo CSS e deve ser explicito
2. **Sempre defina `no-repeat`** — imagens de fundo repetem por padrao, o que quase nunca e o comportamento desejado
3. **Posicione com eixo X e Y explicitamente** — `top center` significa Y=top, X=center, porque controlar cada eixo evita surpresas de centralizacao
4. **Use `cover` para preencher area visivel** — `cover` cobre todo o viewport, `contain` apenas contem dentro das dimensoes do container (geralmente indesejado sem width/height explicitos)
5. **Prefira shorthand** — agrupe tudo em `background:` unica propriedade, na ordem: color, image, repeat, position / size
6. **Separe position e size com barra** — no shorthand, a sintaxe e `position / size`, ex: `top center / cover`

## How to write

### Background shorthand completo

```css
body {
  background: url(./assets/bg-mobile.png) no-repeat top center / cover;
}
```

### Propriedades separadas (equivalente)

```css
body {
  background-image: url(./assets/bg-mobile.png);
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
}
```

## Example

**Before (padrao sem controle):**
```css
body {
  background: url(./assets/bg.png);
}
/* Imagem repete, fica no canto superior esquerdo, nao cobre a tela */
```

**After (com this skill applied):**
```css
body {
  background: url(./assets/bg-mobile.png) no-repeat top center / cover;
}
/* Imagem nao repete, posicionada top-center, cobre toda area visivel */
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem de fundo em pagina inteira | `cover` + `no-repeat` + posicionamento explicito |
| Imagem decorativa que deve conter-se | `contain` com width/height definidos no container |
| Responsivo com imagens diferentes por breakpoint | Troque a imagem via media query, mantenha shorthand |
| Background com cor de fallback | Coloque a cor antes da url: `background: #000 url(...) ...` |
| Shorthand com size | Sempre use barra: `position / size` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `background: url(bg.png)` sem repeat/position | `background: url(./assets/bg.png) no-repeat top center / cover` |
| `background-size: contain` sem width/height no container | `background-size: cover` ou defina dimensoes primeiro |
| `background-position: center` sozinho (ambiguo no eixo Y) | `background-position: top center` (explicite ambos eixos) |
| Propriedades separadas quando shorthand basta | Shorthand unico: `background: color image repeat position / size` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre eixos, cover vs contain, e ordem do shorthand
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes