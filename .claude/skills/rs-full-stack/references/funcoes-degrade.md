---
name: rs-full-stack-funcoes-degrade
description: "Applies CSS gradient patterns using linear-gradient and radial-gradient when writing stylesheets. Use when user asks to 'create a gradient', 'add background gradient', 'style a hero section', 'make a color transition', or any CSS background styling task. Enforces correct syntax: angle/direction first, color stops with transition percentages, and background-image property usage. Make sure to use this skill whenever generating CSS with gradient backgrounds. Not for JavaScript color manipulation, SVG gradients, or canvas drawing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-functions
  tags: [css, gradient, linear-gradient, radial-gradient, background]
---

# Funções Degradê CSS

> Ao criar gradientes CSS, use a sintaxe correta de linear-gradient e radial-gradient com angulação, cores e pontos de transição explícitos.

## Rules

1. **Gradientes são imagens** — use `background-image` (ou shorthand `background`), nunca `background-color`, porque o browser interpreta gradientes como imagens
2. **Sempre defina direção antes das cores** — `linear-gradient(90deg, red, blue)` não `linear-gradient(red, blue, 90deg)`, porque o primeiro argumento é a direção/ângulo
3. **Use graus para precisão, keywords para legibilidade** — `90deg` e `to right` produzem o mesmo resultado, escolha conforme o contexto
4. **Defina pontos de transição quando o degradê padrão não serve** — `red 80%, blue` faz 80% vermelho sólido e transição nos 20% restantes, porque controlar onde a transição começa evita gradientes lavados

## How to write

### Linear gradient com ângulo

```css
.hero {
  background-image: linear-gradient(90deg, #ff0000, #0000ff);
}
```

### Linear gradient com keyword de direção

```css
.banner {
  background-image: linear-gradient(to right, #ff0000, #0000ff);
}
```

### Linear gradient com ponto de transição

```css
.card {
  /* 80% vermelho sólido, transição para azul nos 20% restantes */
  background-image: linear-gradient(90deg, red 80%, blue);
}
```

### Radial gradient

```css
.spotlight {
  background-image: radial-gradient(red, blue);
}
```

### Radial gradient com porcentagem

```css
.badge {
  background-image: radial-gradient(red 50%, blue);
}
```

## Example

**Before (erros comuns):**
```css
.hero {
  background-color: linear-gradient(red, blue);
  /* ERRO: background-color não aceita gradiente */
}
```

**After (com esta skill aplicada):**
```css
.hero {
  background-image: linear-gradient(to right, red, blue);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Transição horizontal simples | `linear-gradient(to right, cor1, cor2)` |
| Transição com ângulo específico | `linear-gradient(Xdeg, cor1, cor2)` — 0 a 360 graus |
| Faixa de cor dominante antes da transição | Adicione porcentagem: `cor1 80%, cor2` |
| Efeito de spotlight/circular | `radial-gradient(cor1, cor2)` |
| Gradiente como background único | `background-image` ou shorthand `background` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `background-color: linear-gradient(...)` | `background-image: linear-gradient(...)` |
| `linear-gradient(red, blue, 90deg)` | `linear-gradient(90deg, red, blue)` |
| Gradiente sem direção quando precisa de controle | Sempre explicite `Xdeg` ou `to direction` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Gradiente nao aparece | Usando `background-color` em vez de `background-image` | Use `background-image: linear-gradient(...)` ou shorthand `background` |
| Direcao do gradiente errada | Angulo ou keyword na posicao errada | Primeiro argumento e sempre a direcao: `linear-gradient(90deg, cor1, cor2)` |
| Transicao muito abrupta ou lavada | Falta de pontos de transicao | Adicione porcentagem: `red 80%, blue` para controlar onde a transicao comeca |
| Gradiente cortado ou repetindo | Elemento sem altura definida | Defina altura explicita ou use `min-height` no container |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre gradientes como imagens, ângulos e transições
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações