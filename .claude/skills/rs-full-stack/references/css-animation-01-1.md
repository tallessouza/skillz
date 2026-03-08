---
name: rs-full-stack-css-animation-01-1
description: "Enforces correct CSS @keyframes animation patterns when writing CSS/SCSS animations. Use when user asks to 'animate an element', 'create a CSS animation', 'move element with CSS', 'add keyframes', or 'use animation-fill-mode'. Applies rules: timeline-first thinking with @keyframes, from/to or percentage-based keyframes, animation-name + animation-duration as minimum pair, fill-mode for persisting states. Make sure to use this skill whenever generating CSS animations or transitions involving keyframes. Not for CSS transitions (use transition property), JavaScript animations, or SVG animations."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: css-animacoes
  tags: [css, animation, keyframes, fill-mode, transform, timeline]
---

# CSS Animations com @keyframes

> Toda animacao CSS e uma mudanca de propriedade baseada em uma linha do tempo com inicio e fim — defina a timeline primeiro, depois aplique.

## Rules

1. **Sempre crie a timeline antes de usar** — defina `@keyframes` com um nome semantico antes de referenciar em `animation-name`, porque a animacao so funciona se a timeline existir
2. **Use `animation-name` + `animation-duration` como par minimo** — sem esses dois, nada acontece, porque o browser precisa saber QUAL timeline e QUANTO TEMPO
3. **Omita o ponto de partida se ja e o estado padrao** — se o elemento ja esta em `translateY(0)`, nao precise declarar `from` ou `0%`, porque o browser usa o estado atual como inicio
4. **Use porcentagens para animacoes multi-etapa** — `from/to` serve para inicio-fim simples; porcentagens permitem paradas intermediarias (25%, 50%, 75%) com comportamentos distintos
5. **Use `animation-fill-mode` para persistir estados** — `forwards` mantem propriedades finais, `backwards` aplica propriedades iniciais antes do delay, `both` faz os dois
6. **`animation-delay` so atrasa o inicio** — o delay nao afeta o fim da animacao; apos completar a timeline, o elemento volta ao estado original (a menos que `fill-mode` esteja definido)

## How to write

### Timeline basica (from/to)

```css
@keyframes move {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(300px);
  }
}

.element {
  animation-name: move;
  animation-duration: 1s;
}
```

### Timeline com porcentagens multi-etapa

```css
@keyframes bounce {
  25% { transform: translateY(300px); }
  30% { transform: translateY(0); }
  50% { transform: translateY(300px); }
  60% { transform: translateY(0); }
}

.element {
  animation-name: bounce;
  animation-duration: 1s;
}
```

### Persistir estado final com fill-mode

```css
@keyframes slide {
  100% {
    transform: translateX(300px);
  }
}

.element {
  animation-name: slide;
  animation-duration: 1s;
  animation-delay: 200ms;
  animation-fill-mode: forwards;
}
```

## Example

**Before (animacao que nao persiste):**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.card {
  animation-name: fadeIn;
  animation-duration: 500ms;
  animation-delay: 1s;
  /* Elemento fica invisivel durante o delay, depois anima, depois VOLTA a piscar pro estado original */
}
```

**After (com fill-mode correto):**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.card {
  animation-name: fadeIn;
  animation-duration: 500ms;
  animation-delay: 1s;
  animation-fill-mode: both;
  /* backwards: aplica opacity:0 durante o delay | forwards: mantem opacity:1 apos completar */
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Animacao simples A→B | Use `from/to` ou apenas `100%` (omita o from se ja e estado padrao) |
| Animacao com "quiques" ou etapas | Use porcentagens multiplas separadas por virgula para mesma propriedade |
| Elemento precisa ficar no estado final | Adicione `animation-fill-mode: forwards` |
| Delay + propriedade inicial diferente do estado padrao | Use `animation-fill-mode: backwards` ou `both` |
| Animacao so de ida sem retorno | `forwards` obrigatorio, senao o elemento volta ao estado original |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `animation-name` sem `animation-duration` | Sempre declare ambos como par minimo |
| `from { transform: translateY(0) }` quando o elemento ja esta em 0 | Omita o `from`, defina apenas o destino |
| Delay sem fill-mode quando o estado inicial difere | Adicione `animation-fill-mode: backwards` ou `both` |
| Porcentagens sem pensar na timeline completa | Mapeie mentalmente cada % na linha do tempo antes de codar |
| Esperar que o elemento fique no estado final automaticamente | O comportamento padrao e VOLTAR ao estado original — use `forwards` |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Animacao nao executa | Falta `animation-duration` | Sempre defina `animation-name` e `animation-duration` como par minimo |
| Elemento volta ao estado original apos animacao | Falta `animation-fill-mode` | Adicione `animation-fill-mode: forwards` para manter o estado final |
| Elemento "pula" antes do delay | Estado inicial do keyframe difere do estado base | Use `animation-fill-mode: backwards` ou `both` para aplicar o keyframe durante o delay |
| Porcentagens nao funcionam como esperado | Timeline nao mapeada mentalmente antes de codar | Desenhe a timeline (0% a 100%) no papel antes de definir as porcentagens |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre linha do tempo, fill-mode backwards vs forwards vs both, e modelo mental de "puxar propriedades"
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes e anotacoes