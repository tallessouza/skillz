---
name: rs-full-stack-funcoes-matematicas
description: "Applies CSS mathematical functions (calc, min, max, clamp) when writing stylesheets or responsive layouts. Use when user asks to 'create responsive typography', 'set flexible widths', 'write CSS calc', 'use clamp for font-size', or any layout sizing task. Enforces correct unit mixing rules in calc(), proper clamp() three-value syntax, and min/max comparisons. Make sure to use this skill whenever generating CSS that involves dynamic sizing or responsive values. Not for JavaScript math, server-side calculations, or CSS animations."
---

# Funções Matemáticas CSS

> Use calc(), min(), max() e clamp() para criar layouts flexíveis com limites controlados.

## Rules

1. **Use calc() para misturar unidades** — `calc(20% + 4rem)` combina unidades diferentes numa expressão, porque o navegador resolve em runtime
2. **Multiplicação e divisão exigem pelo menos um número puro** — `calc(20% * 4)` funciona, `calc(20px * 4px)` não, porque unidade * unidade não tem significado CSS
3. **Soma e subtração aceitam qualquer unidade** — `calc(30px + 1rem)` funciona, porque o navegador converte ambas para pixels
4. **min() retorna o menor valor** — aceita N argumentos, o navegador recalcula continuamente conforme o viewport muda
5. **max() retorna o maior valor** — mesma lógica do min(), útil para garantir tamanhos mínimos na prática
6. **clamp(min, ideal, max) para tipografia responsiva** — três valores obrigatórios: piso, valor desejado (geralmente em vw), teto, porque evita fonte minúscula ou gigantesca

## How to write

### calc() com unidades mistas

```css
.element {
  width: calc(20% + 4rem);
  height: calc(100vh - 80px);
  padding: calc(1rem * 2);
}
```

### min() e max() para limites responsivos

```css
.container {
  /* Nunca ultrapassa 50px, encolhe com o viewport */
  width: min(100%, 50px, 1rem);

  /* Garante pelo menos 90vh, expande se necessário */
  height: max(90vh, 100%);
}
```

### clamp() para tipografia flexível

```css
.text {
  /* min: 1rem | ideal: 7vw | max: 4rem */
  font-size: clamp(1rem, 7vw, 4rem);
}
```

## Example

**Before (tamanho fixo, quebra em telas pequenas):**

```css
h1 {
  font-size: 48px;
}
.sidebar {
  width: 300px;
}
```

**After (com funções matemáticas):**

```css
h1 {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
.sidebar {
  width: min(300px, 100%);
  padding: calc(1rem + 2vw);
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Misturar %, px, rem, vw numa propriedade | Use `calc()` |
| Definir largura que não ultrapasse um limite | Use `min(valor-grande, limite)` |
| Garantir tamanho mínimo responsivo | Use `max(limite-minimo, valor-fluido)` |
| Tipografia que escala com viewport mas tem piso e teto | Use `clamp(min, ideal-em-vw, max)` |
| Funções CSS avançadas (sin, cos, sqrt) | Verifique compatibilidade em caniuse.com primeiro |
| Combinar min/max/calc | Aninhe livremente: `max(calc(50% + 2vh), 10vh)` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|-----------------|
| `calc(20px * 4px)` | `calc(20px * 4)` — multiplicação precisa de número puro |
| `calc(100px / 2px)` | `calc(100px / 2)` — divisão precisa de número puro |
| `font-size: 10vw` (sem limites) | `font-size: clamp(1rem, 10vw, 4rem)` |
| `width: 100%` quando precisa de limite | `width: min(100%, 800px)` |
| `clamp(4rem, 7vw, 1rem)` (min > max) | `clamp(1rem, 7vw, 4rem)` — min sempre menor que max |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre regras de unidades, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações