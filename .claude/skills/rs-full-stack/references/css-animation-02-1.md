---
name: rs-full-stack-css-animation-02-1
description: "Applies advanced CSS animation properties when writing stylesheets or component styles. Use when user asks to 'animate an element', 'create CSS animation', 'loop animation', 'pause animation on hover', or 'combine multiple animations'. Covers animation-direction, fill-mode, iteration-count, play-state, timing-function, shorthand syntax, and multiple animations. Make sure to use this skill whenever generating CSS animations beyond simple keyframes. Not for JavaScript animations, SVG animations, or CSS transitions without @keyframes."
---

# CSS Animation — Propriedades Avançadas

> Controle completo de animações CSS exige domínio de 8 propriedades: direction, fill-mode, iteration-count, play-state, timing-function, delay, duration e o shorthand que as unifica.

## Rules

1. **Use `fill-mode: both` como padrão seguro** — evita o "pulo" visual no início/fim da animação, porque `both` aplica estilos do primeiro E último keyframe nos momentos corretos, independente de `direction`
2. **`alternate` exige `iteration-count` > 1** — sem repetição, alternate não tem efeito visível, porque alternar requer pelo menos ida e volta
3. **`play-state` pertence a um trigger, não ao elemento base** — colocar `paused` no elemento base mata a animação antes de começar; use em `:hover`, `:focus` ou classe JS
4. **Construa o shorthand incrementalmente** — adicione propriedade por propriedade testando cada mudança, porque debugar 8 valores numa linha é improdutivo
5. **Separe múltiplas animações por vírgula** — cada animação tem seus próprios controles independentes (duration, count, direction)
6. **Prefira `ease` ou curvas customizadas a `linear`** — `linear` parece mecânico; `ease`, `ease-in-out` ou `cubic-bezier()` dão sensação natural

## How to write

### Shorthand progressivo

```css
/* Comece simples, adicione controles conforme necessário */
animation: move 200ms;                          /* nome + duração */
animation: move 200ms both;                     /* + fill-mode */
animation: move 200ms both infinite;            /* + repetição */
animation: move 200ms both infinite 1s;         /* + delay */
animation: move 200ms both infinite 1s alternate;/* + direção */
animation: move 200ms both infinite 1s alternate ease; /* + timing */
```

### Play-state como trigger

```css
.element {
  animation: move 1s both infinite alternate ease;
}

/* Pause ao hover — play-state no trigger, nunca no base */
.element:hover {
  animation-play-state: paused;
}
```

### Múltiplas animações

```css
.element {
  animation:
    move 200ms both infinite alternate ease,
    fade 100ms both 10;  /* animação independente com count próprio */
}
```

## Example

**Before (animação com "pulo" e sem controle):**

```css
.box {
  animation-name: move;
  animation-duration: 1s;
  animation-direction: reverse;
  /* Sem fill-mode: elemento "pula" para posição final antes de animar */
}
```

**After (com controle completo via shorthand):**

```css
.box {
  animation: move 1s both infinite alternate ease;
}

.box:hover {
  animation-play-state: paused;
}

@keyframes move {
  to { transform: translateX(400px); }
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Animação vai e volta continuamente | `alternate infinite` |
| Elemento deve manter estado final | `fill-mode: forwards` ou `both` |
| Elemento deve começar no estado do keyframe | `fill-mode: backwards` ou `both` |
| Não sabe qual fill-mode usar | Use `both` — cobre todos os casos |
| Precisa pausar/retomar animação | `play-state` em pseudo-classe ou classe JS |
| Animação parece robótica | Troque `linear` por `ease` ou `cubic-bezier()` |
| Quer efeito piscar + mover | Duas animações separadas por vírgula |
| Direction reverse + fill-mode confuso | Use `both` para não pensar em backwards/forwards |

## Anti-patterns

| Nunca escreva | Escreva instead |
|---------------|-----------------|
| `animation-play-state: paused` no elemento base | `animation-play-state: paused` no `:hover` ou trigger |
| `alternate` sem `iteration-count` > 1 | `alternate` com `infinite` ou count >= 2 |
| `direction: reverse` sem `fill-mode` | `direction: reverse` com `fill-mode: both` |
| 8 propriedades separadas para animação simples | Shorthand: `animation: name duration fill count direction timing` |
| `iteration-count: 999` para "infinito" | `iteration-count: infinite` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre fill-mode vs direction, analogias de timeline
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-css-animation-02-1/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-css-animation-02-1/references/code-examples.md)
