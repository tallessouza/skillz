---
name: rs-full-stack-introducao-87
description: "Applies CSS animation and transition fundamentals when styling UI elements. Use when user asks to 'animate an element', 'add a transition', 'create a CSS animation', 'make it move', or 'add hover effect'. Distinguishes between CSS transitions (state A to B on trigger) and CSS animations (multi-keyframe timelines). Make sure to use this skill whenever adding motion to UI elements with CSS. Not for JavaScript-driven animations, canvas/WebGL, or SVG animation libraries."
---

# CSS Animations & Transitions — Fundamentos

> Animacao e transicao CSS sao ferramentas distintas: transicao reage a mudanca de estado, animacao define uma linha do tempo independente.

## Rules

1. **Prefira CSS a JavaScript para animacoes fundamentais** — transicoes de hover, fade-in, slide, scale sao nativos do CSS, porque o browser otimiza compositing na GPU sem overhead de JS
2. **Transicao requer gatilho, animacao nao** — `transition` so ativa quando uma propriedade muda (hover, class toggle); `animation` roda sozinha via `@keyframes`, porque sao mecanismos diferentes
3. **Animacao e uma linha do tempo** — pense sempre: ponto A (inicio) → ponto B (fim), com estados intermediarios opcionais, porque toda animacao e movimento entre dois estados
4. **Use `transition` para mudancas simples de estado** — hover, focus, active, porque e mais simples e performatico que `@keyframes` para dois estados
5. **Use `@keyframes` para sequencias complexas** — quando ha mais de dois estados ou a animacao deve rodar sem trigger do usuario

## Decision framework

| Situacao | Use |
|----------|-----|
| Elemento muda ao hover/focus/click | `transition` |
| Elemento anima ao carregar a pagina | `@keyframes` + `animation` |
| Dois estados (A → B) | `transition` |
| Multiplos estados (A → B → C → D) | `@keyframes` |
| Loop infinito | `@keyframes` com `infinite` |
| Resposta a interacao do usuario | `transition` |

## How to write

### Transicao basica

```css
.button {
  background-color: #3498db;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #2980b9;
}
```

### Animacao basica com keyframes

```css
@keyframes slide-in {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.element {
  animation: slide-in 0.5s ease-out;
}
```

## Example

**Before (JavaScript desnecessario):**
```html
<script>
element.onmouseover = () => {
  element.style.backgroundColor = '#2980b9';
};
</script>
```

**After (CSS nativo):**
```css
.element {
  background-color: #3498db;
  transition: background-color 0.3s ease;
}
.element:hover {
  background-color: #2980b9;
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de animacao visual rapida | Comece pelo CSS antes de cogitar JS |
| Animacao complexa com logica condicional | Use JS (CSS nao tem condicionais) |
| Quer explorar tipos de animacao | Consulte animista.net para referencia visual |
| Performance e critica | Anime apenas `transform` e `opacity` (propriedades composited) |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|-------------|
| JS para hover simples | `transition` no CSS |
| `setInterval` para mover elemento | `@keyframes` com `animation` |
| Animar `width`/`height`/`top`/`left` | Animar `transform: translate/scale` |
| `transition: all` | Especifique a propriedade: `transition: opacity 0.3s` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre evolucao do CSS, diferenca historica Flash vs JS vs CSS
- [code-examples.md](references/code-examples.md) — Exemplos expandidos de transitions e animations com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-introducao-87/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-introducao-87/references/code-examples.md)
