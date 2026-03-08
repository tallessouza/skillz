---
name: rs-full-stack-background-color-image-repeat
description: "Applies CSS background properties (background-color, background-image, background-repeat) when styling HTML elements. Use when user asks to 'add background', 'set background color', 'add background image', 'style element background', or any CSS background task. Enforces correct usage of color formats, URL function syntax, and repeat control. Make sure to use this skill whenever generating CSS that involves element backgrounds. Not for CSS layout, positioning, or non-background styling properties."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css
  tags: [css, background, background-color, background-image, background-repeat]
---

# Background Color, Background Image, Background Repeat

> Aplicar backgrounds corretamente respeitando os limites da caixa do elemento e controlando repetição de imagens.

## Rules

1. **background-color aceita qualquer formato de cor** — named-colors, hexadecimal, RGB, HSL, porque CSS suporta todos uniformemente
2. **Background respeita os limites da caixa** — a cor ou imagem preenche apenas a área do elemento (width/height), porque o background é contido pelo box model
3. **background-image usa a função url()** — `url("caminho")` para imagens locais ou externas, porque é a sintaxe padrão para referenciar recursos
4. **Imagens de fundo repetem por padrão** — sem background-repeat explícito, a imagem preenche o elemento repetindo em ambos os eixos, porque o comportamento default é `repeat`
5. **Use no-repeat quando não quiser repetição** — `background-repeat: no-repeat` é o valor mais comum em uso real, porque raramente se deseja tiling automático
6. **Aspas na URL são opcionais mas recomendadas** — `url("img.png")` é mais seguro que `url(img.png)`, porque aspas evitam problemas com caracteres especiais no caminho

## How to write

### Cor de fundo no body

```css
body {
  background-color: #1a1a2e;
}
```

### Cor de fundo em elemento com dimensões

```css
.card {
  width: 200px;
  height: 200px;
  background-color: rgb(45, 120, 200);
}
```

### Imagem de fundo sem repetição

```css
.hero {
  width: 100%;
  height: 400px;
  background-image: url("https://example.com/image.jpg");
  background-repeat: no-repeat;
}
```

## Example

**Before (imagem repetindo indesejavelmente):**

```css
.banner {
  width: 300px;
  height: 200px;
  background-image: url("logo.png");
  /* imagem repete em X e Y preenchendo toda a caixa */
}
```

**After (com controle de repetição):**

```css
.banner {
  width: 300px;
  height: 200px;
  background-image: url("logo.png");
  background-repeat: no-repeat;
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Cor sólida de fundo | `background-color` com o formato de cor preferido |
| Imagem decorativa de fundo | `background-image: url("...")` + `background-repeat: no-repeat` |
| Padrão/textura que deve cobrir tudo | Deixe o repeat padrão ou use `repeat` explícito |
| Repetir apenas horizontalmente | `background-repeat: repeat-x` |
| Repetir apenas verticalmente | `background-repeat: repeat-y` |
| Elemento com dimensões fixas | Background fica contido nos limites de width/height |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `background-image: "img.png"` | `background-image: url("img.png")` |
| Imagem de fundo sem controlar repeat | Adicione `background-repeat: no-repeat` se não quer tiling |
| `url(path com espaços.png)` | `url("path com espaços.png")` — use aspas |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Imagem de fundo nao aparece | Caminho da URL incorreto ou aspas faltando | Verifique o caminho e use `url("caminho")` com aspas |
| Imagem repete indesejavelmente | Comportamento padrao do CSS e `repeat` | Adicione `background-repeat: no-repeat` |
| Cor de fundo nao aparece | Elemento sem dimensoes (width/height) | Defina dimensoes ou adicione conteudo ao elemento |
| Background nao preenche toda a area | Elemento sem `width: 100%` ou `height` definidos | Ajuste as dimensoes do elemento via CSS |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações