---
name: rs-full-stack-container-itens-e-eixo
description: "Enforces correct Flexbox container/items and axis mental model when writing CSS layouts. Use when user asks to 'create a layout', 'align elements', 'use flexbox', 'put items side by side', or 'change flex direction'. Applies rules: container has display:flex, items are direct children, main axis vs cross axis awareness, flex-direction controls axis orientation. Make sure to use this skill whenever generating CSS flex layouts. Not for Grid layout, positioning, or non-layout CSS properties."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-layout
  tags: [css, flexbox, layout, container, axis, flex-direction]
---

# Flexbox: Container, Itens e Eixo

> Ao usar Flexbox, sempre raciocine em termos de container, itens, eixo principal (main) e eixo cruzado (cross) — nunca "esquerda/direita" ou "cima/baixo" isoladamente.

## Rules

1. **`display: flex` vai no container, nunca nos itens** — porque o container e que ativa o contexto flex para seus filhos diretos
2. **Itens flex sao apenas filhos diretos** — netos nao participam do flex do avo, porque cada contexto flex e independente
3. **Sempre identifique os dois eixos antes de alinhar** — main axis (eixo principal) e cross axis (eixo cruzado), porque todas as propriedades de alinhamento dependem dessa orientacao
4. **`flex-direction` inverte os eixos, nao apenas a direcao visual** — `column` faz o main axis ficar vertical e o cross axis ficar horizontal, porque start/end de ambos os eixos mudam
5. **Itens perdem largura total ao entrar no flex** — no normal flow divs ocupam 100% da largura; com flex, o tamanho e recalculado pelo contexto flex

## How to write

### Container basico com itens lado a lado

```css
/* Container ativa o flex — itens ficam em row por padrao */
.container {
  display: flex;
}
```

### Mudanca de eixo com flex-direction

```css
/* Main axis vertical: itens empilham de cima pra baixo */
.container {
  display: flex;
  flex-direction: column;
}

/* Main axis horizontal invertido: itens da direita pra esquerda */
.container {
  display: flex;
  flex-direction: row-reverse;
}
```

## Example

**Before (normal flow — divs empilhadas):**
```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
</div>
```
```css
/* Sem flex: cada div ocupa 100% da largura, uma abaixo da outra */
.container {
  /* nenhum display especial */
}
```

**After (flex ativado — itens lado a lado):**
```css
.container {
  display: flex;
  /* flex-direction: row e o padrao — main axis horizontal */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Itens lado a lado horizontalmente | `display: flex` (row e padrao) |
| Itens empilhados verticalmente com controle flex | `flex-direction: column` |
| Ordem visual invertida sem mudar HTML | `row-reverse` ou `column-reverse` |
| Precisa alinhar no eixo principal | Identifique qual e o main axis primeiro |
| Precisa alinhar no eixo cruzado | Identifique qual e o cross axis primeiro |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `display: flex` no item filho para alinhar irmaos | `display: flex` no container pai |
| Pensar "alinhar horizontalmente" sem saber o eixo | Verificar `flex-direction` para saber qual e o main axis |
| Usar `float` para colocar itens lado a lado | `display: flex` no container |
| Assumir que main axis e sempre horizontal | Verificar `flex-direction` — com `column`, main axis e vertical |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Itens nao ficam lado a lado | `display: flex` aplicado no item em vez do container | Aplique `display: flex` no elemento pai (container) |
| `justify-content` alinha no eixo errado | `flex-direction: column` inverte os eixos | Com `column`, `justify-content` age no eixo vertical |
| Netos nao respondem ao flex do avo | Flex so afeta filhos diretos | Aplique `display: flex` tambem no elemento pai intermediario |
| Itens encolhem demais | Flex shrink padrao e 1, itens diminuem para caber | Use `flex-shrink: 0` ou `min-width` nos itens que nao devem encolher |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre eixos, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes