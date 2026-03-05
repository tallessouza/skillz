---
name: rs-full-stack-futuro-das-animacoes-02
description: "Applies CSS scroll-driven animation view() function when writing scroll-based animations tied to element visibility in the viewport. Use when user asks to 'animate on scroll', 'fade in on scroll', 'trigger animation when visible', 'scroll-driven animation', or 'viewport animation'. Enforces correct view() syntax with top/bottom offsets, animation-fill-mode, and animation-range alternatives. Make sure to use this skill whenever implementing scroll-based reveal animations in CSS. Not for JavaScript intersection observer, scroll-timeline, or non-scroll animations."
---

# CSS Scroll-Driven Animations: view()

> Usar `animation-timeline: view()` para iniciar e finalizar animacoes baseado na visibilidade do elemento na viewport.

## Rules

1. **Use `view()` para animacoes baseadas em visibilidade** — `animation-timeline: view()` inicia quando o elemento entra na viewport e finaliza quando sai, porque elimina a necessidade de JavaScript/IntersectionObserver
2. **Sempre defina `animation-fill-mode: both`** — sem isso, o elemento nao mantem as propriedades iniciais/finais da animacao, causando flash visual indesejado
3. **Dois argumentos = top offset e bottom offset** — `view(100px 200px)` significa: finaliza a 100px do topo, inicia a 200px do fundo, porque a ordem e contraintuitiva e erros sao comuns
4. **Um argumento = mesmo offset para top e bottom** — `view(100px)` aplica 100px para ambos, o que raramente e o comportamento desejado
5. **Prefira `animation-range` para controle mais intuitivo** — quando os offsets do `view()` ficam confusos, separe o controle com `animation-range`, porque e mais legivel
6. **Combine transformacoes com opacidade** — `scale(0.8)` + `opacity: 0` no inicio cria entrada mais natural que opacidade sozinha

## How to write

### Animacao basica com view()

```css
@keyframes fade-in {
  from {
    opacity: 0;
    scale: 0.8;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

.element {
  animation: fade-in linear both;
  animation-timeline: view();
}
```

### Com offsets personalizados

```css
.element {
  animation: fade-in linear both;
  /* Finaliza a 50% do topo, inicia a 10% do fundo */
  animation-timeline: view(50% 10%);
}
```

### Alternativa com animation-range

```css
.element {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 50%;
}
```

## Example

**Before (JavaScript approach):**
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
document.querySelectorAll('.animate').forEach(el => observer.observe(el));
```

**After (pure CSS with view()):**
```css
.animate {
  animation: fade-in linear both;
  animation-timeline: view();
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Elemento deve animar ao entrar na viewport | `animation-timeline: view()` sem offsets |
| Animacao deve terminar antes do elemento sair | Adicione offset do topo: `view(100px 0px)` |
| Animacao deve comecar depois de parcialmente visivel | Adicione offset do fundo: `view(0px 100px)` |
| Offsets ficam confusos | Use `animation-range` separadamente |
| Um unico valor de offset | Evite — aplica para top E bottom, raramente desejado |
| Unidade dos offsets | Use `%` para responsivo, `px` para preciso |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `animation-timeline: view()` sem `fill-mode` | `animation: fade-in linear both; animation-timeline: view()` |
| `view(90%)` achando que e so bottom | `view(90% 90%)` — explicite ambos valores |
| JavaScript IntersectionObserver para fade-in simples | CSS `animation-timeline: view()` |
| `animation-timeline: scroll()` para visibilidade | `animation-timeline: view()` — scroll() e para progresso da pagina |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre offsets, ordem dos argumentos e mental model da viewport
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo com variacoes de unidades e combinacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-futuro-das-animacoes-02/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-futuro-das-animacoes-02/references/code-examples.md)
