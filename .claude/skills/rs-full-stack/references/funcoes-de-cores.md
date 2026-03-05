---
name: rs-full-stack-funcoes-de-cores
description: "Applies CSS color functions (RGB, HSL, Color Mix) when styling elements. Use when user asks to 'add colors', 'style a component', 'change background', 'set text color', or 'mix colors' in CSS. Enforces correct usage of rgb(), hsl(), opacity/alpha channels, and color-mix(). Make sure to use this skill whenever writing CSS color values beyond simple hex. Not for CSS layout, typography, or animations."
---

# Funções de Cores no CSS

> Usar as funcoes de cor corretas (RGB, HSL, color-mix) conforme a necessidade, preferindo HSL para legibilidade e color-mix para mesclas.

## Rules

1. **Use HSL para cores legíveis** — `hsl(270, 80%, 50%)` comunica matiz/saturação/luminosidade melhor que `rgb(153, 25, 230)`, porque humanos pensam em "tom, intensidade, claridade"
2. **Inclua alpha quando precisar de opacidade** — `hsl(270 80% 50% / 0.5)` não `opacity: 0.5` no elemento inteiro, porque alpha afeta só aquela cor, opacity afeta o elemento e filhos
3. **Use color-mix() para mesclar cores** — `color-mix(in hsl, hsl(...), hsl(...))` gera tons intermediários sem cálculo manual, porque o browser interpola no espaço de cor correto
4. **Declare o espaço de cor no color-mix** — sempre `color-mix(in hsl, ...)` ou `color-mix(in srgb, ...)`, porque o resultado muda conforme o espaço de interpolação
5. **RGB vai de 0 a 255 por canal** — 0 é ausência da cor, 255 é máximo; HSL vai de 0-360 (matiz), 0-100% (saturação), 0-100% (luminosidade)

## How to write

### RGB básico
```css
color: rgb(255, 40, 60);
background-color: rgb(255, 40, 60 / 0.8); /* com alpha */
```

### HSL (preferido para legibilidade)
```css
color: hsl(270, 80%, 50%);
border-color: hsl(270 80% 50% / 0.5); /* com alpha */
```

### color-mix() para mescla
```css
background-color: color-mix(in hsl, hsl(0, 100%, 50%), hsl(60, 100%, 50%));
/* vermelho + amarelo = laranja */
```

## Example

**Before (valores mágicos):**
```css
.card {
  color: #9919e6;
  background: #ff6633;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
```

**After (funções semânticas):**
```css
.card {
  color: hsl(270, 80%, 50%);
  background: color-mix(in hsl, hsl(0, 100%, 50%), hsl(60, 100%, 50%));
  border: 1px solid hsl(0 0% 0% / 0.2);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Cor estática simples | HSL ou hex — o que o design system usar |
| Precisa variar luminosidade/saturação via CSS custom properties | HSL, porque cada canal faz sentido isolado |
| Mesclar duas cores do tema | `color-mix(in hsl, var(--cor-a), var(--cor-b))` |
| Opacidade só na cor (não no elemento) | Alpha channel na função de cor |
| Valor vindo de design tool em hex | Converter para HSL se for usar variações |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `opacity: 0.5` para transparência só no background | `background: hsl(... / 0.5)` |
| `color-mix(hsl(...), hsl(...))` sem espaço de cor | `color-mix(in hsl, hsl(...), hsl(...))` |
| `rgb(255, 0, 0, 0.5)` misturando sintaxes | `rgb(255 0 0 / 0.5)` sintaxe moderna |
| Calcular cor intermediária manualmente | `color-mix()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre espaços de cor, saturação, luminosidade e quando usar cada função
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-funcoes-de-cores/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-funcoes-de-cores/references/code-examples.md)
