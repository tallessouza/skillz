---
name: rs-full-stack-css-transition-03
description: "Enforces correct CSS transition patterns including shorthand syntax, element placement, and accessibility. Use when user asks to 'add transition', 'animate on hover', 'css animation', 'smooth effect', or 'transition not working'. Applies rules: transition on element not trigger, prefers-reduced-motion, shorthand order, entry/exit differentiation. Make sure to use this skill whenever writing CSS transitions or debugging transition issues. Not for JavaScript animations, CSS @keyframes, or SVG animations."
---

# CSS Transition — Shorthand, Placement & Accessibility

> Transicoes CSS pertencem ao elemento, nao ao disparo — e devem respeitar prefers-reduced-motion.

## Rules

1. **Use shorthand `transition`** — `transition: all 400ms ease` em vez de propriedades separadas, porque reduz linhas e e mais legivel
2. **Coloque transition no elemento, nao no trigger** — se colocar no `:hover`, so a entrada anima e a saida e abrupta, porque sem hover nao existe transicao definida
3. **Segundo valor numerico e delay** — `transition: all 400ms 2s ease` significa 400ms de duracao com 2s de atraso, porque o parser CSS interpreta o segundo numero como delay
4. **Multiplas propriedades separadas por virgula** — `transition: opacity 1s ease, transform 400ms linear` para tempos diferentes por propriedade
5. **Sempre implemente prefers-reduced-motion** — `@media (prefers-reduced-motion: reduce)` com `transition: none`, porque acessibilidade nao e opcional
6. **Minimo para funcionar: propriedade + duracao** — `transition: opacity 300ms` ja e suficiente, timing-function e delay sao opcionais
7. **Nem toda propriedade CSS aceita transition** — consulte a documentacao se uma transicao nao funcionar, porque algumas propriedades nao sao animaveis

## How to write

### Shorthand basico
```css
.card {
  transition: all 400ms ease;
}
```

### Multiplas propriedades com tempos diferentes
```css
.card {
  transition: opacity 1s ease, transform 400ms linear;
}
```

### Com delay
```css
.card {
  /* 400ms duracao, 2s delay */
  transition: all 400ms 2s ease;
}
```

### Prefers-reduced-motion (obrigatorio)
```css
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }
}
```

### Transicoes diferentes para entrada e saida
```css
.card {
  /* Saida: mais devagar */
  transition: all 500ms ease;
}

.card:hover {
  /* Entrada: mais rapida (sobrescreve) */
  transition: all 100ms ease;
  transform: scale(1.1);
}
```

## Example

**Before (transition no trigger — bug comum):**
```css
.button {
  background: blue;
}
.button:hover {
  background: red;
  transition: background 300ms ease; /* ERRADO: so anima entrada */
}
```

**After (transition no elemento):**
```css
.button {
  background: blue;
  transition: background 300ms ease; /* CORRETO: anima entrada E saida */
}
.button:hover {
  background: red;
}

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Transicao so funciona na entrada | Mover `transition` do `:hover` para o elemento base |
| Entrada rapida, saida lenta | Colocar transition curta no `:hover` e longa no elemento |
| Nao sabe qual propriedade animar | Usar `all` temporariamente, refinar depois |
| Propriedade nao anima | Consultar MDN — pode nao ser animavel |
| Qualquer transicao/animacao visual | Adicionar `prefers-reduced-motion` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `transition` so no `:hover` | `transition` no elemento base |
| Transicao sem `prefers-reduced-motion` | Sempre incluir media query de acessibilidade |
| `transition: all 400ms 2s` sem entender que 2s e delay | Documentar com comentario: `/* 400ms duracao, 2s delay */` |
| Propriedades separadas quando shorthand resolve | `transition: all 400ms ease` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre placement, shorthand parsing e acessibilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-css-transition-03/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-css-transition-03/references/code-examples.md)
