---
name: rs-full-stack-classes-utilitarias-pt1
description: "Enforces responsive CSS container patterns using min(), calc(), and custom properties. Use when user asks to 'create a container', 'add responsive layout', 'build utility classes', 'set max-width responsively', or 'handle lateral spacing'. Applies CSS min() function for fluid width, CSS custom properties for breakpoint swaps, and margin-inline auto centering. Make sure to use this skill whenever building responsive containers or utility classes in CSS. Not for JavaScript logic, backend code, or CSS Grid/Flexbox alignment."
---

# Classes Utilitárias CSS — Container Responsivo

> Defina containers responsivos com a funcao min() do CSS e custom properties que trocam via media query.

## Rules

1. **Use min() ao inves de max-width + width separados** — `width: min(var(--maxWidth), 100% - var(--px-lg) * 2)` substitui duas declaracoes, porque o min() escolhe automaticamente o menor valor entre o limite fixo e o calculo fluido
2. **Defina espacamentos laterais como custom properties no :root** — `--px-lg: 1.5rem` para mobile, `--px-lg: 2rem` para desktop, porque a troca acontece apenas no media query sem tocar no componente
3. **Centralize com margin-inline: auto** — nao use `margin: 0 auto`, porque margin-inline e a propriedade logica correta para eixo horizontal
4. **Subtraia os dois lados no calculo** — `var(--px-lg) * 2` garante padding esquerdo E direito, porque esquecer o `* 2` resulta em espaco lateral pela metade
5. **Separe utility CSS em arquivo proprio** — um arquivo `utility.css` dedicado facilita manutencao futura, porque voce encontra o container isolado sem vasculhar estilos globais
6. **Coloque media queries junto ao componente no arquivo utility** — o media query do container fica no mesmo arquivo do container, porque co-localizacao facilita manutencao

## How to write

### Container com min()

```css
/* global.css — custom properties */
:root {
  --px-lg: 1.5rem; /* mobile: 24px */
}

@media (width >= 80em) {
  :root {
    --px-lg: 2rem; /* desktop: 32px */
  }
}
```

```css
/* utility.css — container */
.container {
  --maxWidth: 375px;
  width: min(var(--maxWidth), 100% - var(--px-lg) * 2);
  margin-inline: auto;
}

@media (width >= 80em) {
  .container {
    --maxWidth: 80rem; /* 1280px */
  }
}
```

### Uso no HTML

```html
<header>
  <div class="container">
    <h1>Conteudo centralizado com espacamento lateral</h1>
  </div>
</header>
```

## Example

**Before (duas propriedades separadas):**
```css
.container {
  width: calc(100% - 3rem);
  max-width: 375px;
  margin: 0 auto;
}
```

**After (com min() e custom properties):**
```css
.container {
  --maxWidth: 375px;
  width: min(var(--maxWidth), 100% - var(--px-lg) * 2);
  margin-inline: auto;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Layout com largura maxima e padding lateral | Use min() com custom property |
| Espacamento lateral muda entre breakpoints | Defina custom property no :root, troque via media query |
| Precisa centralizar bloco horizontalmente | margin-inline: auto |
| Projeto tem multiplas secoes com mesmo limite | Reutilize .container como classe utilitaria |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `max-width: 375px; width: calc(100% - 3rem);` | `width: min(375px, 100% - var(--px-lg) * 2);` |
| `margin: 0 auto;` | `margin-inline: auto;` |
| `width: min(var(--max), 100% - 1.5rem)` (sem *2) | `width: min(var(--max), 100% - var(--px-lg) * 2)` |
| Hardcoded `24px` / `32px` nos calculos | Custom properties `--px-lg` trocadas via media query |
| Media queries do container em arquivo separado do container | Media query co-localizado no mesmo arquivo utility |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre min() vs max-width+width, analogia visual e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes