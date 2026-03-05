---
name: rs-full-stack-introducao-84
description: "Applies CSS Value Functions knowledge when writing stylesheets. Use when user asks to 'style a component', 'add CSS transforms', 'use calc()', 'apply filters', 'create gradients', or any CSS property that accepts function values. Categorizes functions into transform, math, filters, colors, gradients, shapes, and reference functions. Make sure to use this skill whenever generating CSS that involves function-based values. Not for pseudo-functions like :not() or :is(), nor for @import url() syntax."
---

# CSS Value Functions

> Ao escrever CSS, aplicar funcoes como valores de propriedades — cada funcao recebe argumentos que definem seu comportamento.

## Key concept

CSS Value Functions sao funcoes usadas como **valores de propriedades CSS** (nao como seletores ou regras at-rule). Toda funcao segue o formato `nome(argumentos)` — os argumentos dizem a funcao o que fazer.

## Decision framework

| Quando precisar de | Categoria | Exemplos |
|-------------------|-----------|----------|
| Mover, rotacionar, escalar elementos | Transformacao | `translate()`, `rotate()`, `scale()` |
| Calculos dinamicos de tamanho | Matematica | `calc()`, `min()`, `max()`, `clamp()` |
| Efeitos visuais em imagens/elementos | Filtros | `blur()`, `brightness()`, `contrast()` |
| Definir cores com canais | Cores | `rgb()`, `hsl()`, `oklch()` |
| Transicoes de cor | Degrades | `linear-gradient()`, `radial-gradient()` |
| Formas e recortes | Formatos | `circle()`, `polygon()`, `path()` |
| Referenciar outros valores | Referencia | `var()`, `attr()`, `env()` |

## How to write

### Estrutura basica de uma CSS Function

```css
/* propriedade: funcao(argumento1, argumento2); */
.element {
  transform: rotate(45deg);
  width: calc(100% - 2rem);
  background: linear-gradient(to right, #000, #fff);
  filter: blur(4px);
  color: hsl(220, 90%, 56%);
}
```

## Common misconceptions

| Confusao comum | Realidade |
|---------------|-----------|
| `:not()`, `:is()` sao CSS functions | Sao **pseudo-funcoes** (seletores), nao value functions |
| `@import url()` e uma CSS function | E uma **at-rule** com funcao de importacao, categoria diferente |
| Funcoes CSS nao aceitam argumentos | Quase todas recebem 1 ou mais argumentos que controlam o comportamento |

## Heuristics

| Situacao | Faca |
|----------|------|
| Valor de propriedade precisa ser dinamico | Use uma funcao matematica (`calc()`, `clamp()`) |
| Precisa aplicar efeito visual | Use funcao de filtro (`blur()`, `drop-shadow()`) |
| Cor precisa de transparencia | Use funcao de cor com canal alpha (`rgb()`, `hsl()`) |
| Propriedade aceita funcao | Sempre verifique quantos argumentos sao necessarios |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre categorias e distincoes entre tipos de funcoes CSS
- [code-examples.md](references/code-examples.md) — Exemplos de cada categoria de CSS function com variacoes