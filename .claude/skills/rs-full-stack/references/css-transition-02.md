---
name: rs-full-stack-css-transition-02
description: "Applies CSS transition-timing-function and cubic-bezier curves when writing CSS transitions or animations. Use when user asks to 'add a transition', 'animate an element', 'make it smooth', 'add hover effect', or 'create CSS animation'. Enforces correct use of linear, ease, ease-in, ease-out, ease-in-out, cubic-bezier(), and steps(). Make sure to use this skill whenever generating CSS transitions, even for simple hover effects. Not for JavaScript animations, SVG animations, or keyframe-based CSS animations."
---

# CSS Transition Timing Function

> Toda transition-timing-function e sempre uma cubic-bezier por baixo dos panos — linear e ease sao apenas atalhos.

## Rules

1. **Use nomes semanticos antes de cubic-bezier customizado** — `ease-in`, `ease-out`, `ease-in-out` cobrem 80% dos casos, porque sao legiveis e bem otimizados pelos browsers
2. **Entenda a direcao: in = chegada suave, out = saida suave** — `ease-in` significa que o elemento SAI rapido e CHEGA suave; `ease-out` significa que SAI suave e CHEGA rapido, porque "in/out" refere-se ao fim/inicio da curva
3. **Use cubic-bezier() para curvas customizadas** — os 4 valores sao `cubic-bezier(x1, y1, x2, y2)` onde cada par controla um ponto da curva de Bezier, porque permite controle fino da aceleracao
4. **Use steps() para animacoes em etapas discretas** — `steps(n)` divide a transicao em n saltos, porque cria efeito de sprite sheet ou contagem
5. **Cuidado com acessibilidade ao usar steps()** — transicoes em saltos podem incomodar usuarios sensiveis a movimento, porque a mudanca abrupta e mais perceptivel que transicoes suaves
6. **Use ferramentas visuais para cubic-bezier** — cubicbezier.com ou DevTools do browser, porque ninguem precisa memorizar valores numericos de curvas

## How to write

### Timing functions padrao

```css
.element {
  /* Velocidade constante */
  transition-timing-function: linear;

  /* Chegada suave (sai rapido, chega devagar) */
  transition-timing-function: ease-in;

  /* Saida suave (sai devagar, chega rapido) */
  transition-timing-function: ease-out;

  /* Saida e chegada suaves */
  transition-timing-function: ease-in-out;

  /* Atalho generico (default do browser) */
  transition-timing-function: ease;
}
```

### Cubic-bezier customizado

```css
.element {
  /* Curva customizada: cubic-bezier(x1, y1, x2, y2) */
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
```

### Steps para animacao em etapas

```css
.element {
  /* 5 passos discretos ate completar */
  transition-timing-function: steps(5);
}
```

## Example

**Before (sem timing function intencional):**
```css
.card {
  transition: transform 0.3s;
}
.card:hover {
  transform: scale(1.05);
}
```

**After (com timing function adequada):**
```css
.card {
  transition: transform 0.3s ease-out;
}
.card:hover {
  transform: scale(1.05);
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Hover em botoes/cards | `ease-out` — saida suave, resposta rapida |
| Elemento entrando na tela | `ease-out` — desacelera na chegada |
| Elemento saindo da tela | `ease-in` — acelera ao sair |
| Modal abrindo/fechando | `ease-in-out` — suave nos dois lados |
| Velocidade constante (ex: loading bar) | `linear` |
| Sprite sheet ou contador | `steps(n)` |
| Efeito bounce ou overshoot | `cubic-bezier()` com y > 1 |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `transition: all 0.3s` (sem timing) | `transition: transform 0.3s ease-out` |
| `cubic-bezier()` para casos simples | `ease-in-out` quando atalho resolve |
| `steps(1)` | Sem transicao (mesmo efeito) |
| `steps()` sem considerar acessibilidade | `steps()` com `prefers-reduced-motion` check |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre cubic-bezier, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-css-transition-02/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-css-transition-02/references/code-examples.md)
