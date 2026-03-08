---
name: rs-full-stack-cores-e-fundos
description: "Applies CSS color and background conventions when styling HTML elements. Use when user asks to 'add a background', 'change colors', 'style a component', 'set background image', or any CSS styling task involving colors or backgrounds. Enforces named colors, hex notation, background-color, background-image, background-repeat, background-position, and background-size. Make sure to use this skill whenever writing CSS that involves color values or element backgrounds. Not for JavaScript logic, layout systems like Flexbox/Grid, or typography."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-fundamentals
  tags: [css, colors, background, hex, background-image, background-size]
---

# Cores e Fundos no CSS

> Ao estilizar elementos, use valores de cor descritivos e controle fundos com propriedades especificas para cor, imagem, repeticao, posicao e tamanho.

## Rules

1. **Use cores nomeadas para prototipacao rapida** — `blue`, `red`, `green`, porque sao legiveis e rapidas de aplicar durante desenvolvimento inicial
2. **Use hexadecimal para producao** — `#FF0000` segue o padrao `#RRGGBB` (Red, Green, Blue), porque oferece controle preciso sobre a cor
3. **Sempre prefixe hex com `#`** — `#3498db` nao `3498db`, porque sem o `#` o navegador nao interpreta como cor
4. **Separe propriedades de background** — use `background-color`, `background-image`, `background-repeat`, `background-position`, `background-size` individualmente, porque facilita manutencao e legibilidade
5. **Controle repeticao de imagens de fundo explicitamente** — defina `background-repeat` sempre que usar `background-image`, porque o padrao e repetir em ambos os eixos e isso raramente e o desejado

## How to write

### Cores nomeadas e hexadecimais

```css
/* Cores nomeadas — rapidas, legiveis */
color: blue;
background-color: red;

/* Hexadecimal — precisao em producao */
color: #0000FF;        /* azul */
background-color: #FF0000; /* vermelho */
```

### Background completo com imagem

```css
.hero {
  background-color: #1a1a2e;
  background-image: url('hero-bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
```

## Example

**Before (propriedades faltando):**
```css
.banner {
  background: url('banner.jpg');
}
```

**After (com controle completo):**
```css
.banner {
  background-color: #222;
  background-image: url('banner.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Prototipando rapidamente | Cores nomeadas (`blue`, `red`) |
| Codigo de producao | Hexadecimal (`#3498db`) |
| Imagem de fundo decorativa | Defina repeat, position e size |
| Fallback para imagem que pode falhar | Adicione `background-color` como fallback |
| Precisa de transparencia | Use `rgba()` ou hex 8 digitos (topico avancado) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `background: url(...)` sozinho | `background-image` + `background-repeat` + `background-position` + `background-size` |
| Hex sem `#`: `color: FF0000` | `color: #FF0000` |
| Imagem de fundo sem fallback de cor | `background-color` antes de `background-image` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Cor nao aparece no elemento | Valor hex sem `#` ou com caractere invalido | Verifique que o hex comeca com `#` e tem 3 ou 6 digitos validos |
| Imagem de fundo repete em mosaico | `background-repeat` nao foi definido (padrao e `repeat`) | Adicione `background-repeat: no-repeat` |
| Imagem de fundo nao cobre o elemento inteiro | `background-size` nao definido ou com valor incorreto | Use `background-size: cover` para preenchimento completo |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre tipos de cor, hex RGB, e decisoes de background
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes