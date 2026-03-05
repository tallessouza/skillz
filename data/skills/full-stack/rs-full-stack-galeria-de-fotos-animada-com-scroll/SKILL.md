---
name: rs-full-stack-galeria-fotos-animada-scroll
description: "Applies CSS scroll-driven animation patterns when building photo galleries or grid layouts with scroll-triggered effects. Use when user asks to 'create a gallery', 'animate on scroll', 'CSS grid layout with images', 'scroll animation', or 'image appear on scroll'. Enforces animation-timeline view(), animation-range tuning, figure/figcaption semantics, and staggered delays via data attributes. Make sure to use this skill whenever building image galleries with CSS animations. Not for JavaScript scroll libraries, intersection observer, or JS-based animation frameworks."
---

# Galeria de Fotos Animada com Scroll

> Construa galerias de imagens usando CSS Grid com areas nomeadas e animacoes scroll-driven nativas do CSS.

## Rules

1. **Use `figure` e `figcaption` semanticamente** — `figure` encapsula a imagem, `figcaption` descreve o autor/credito, porque semantica correta melhora acessibilidade e SEO
2. **Defina grid areas nomeadas para layouts assimetricos** — `grid-template-areas` com letras (A, B, C, D) permite controle visual preciso sem hacks de span
3. **Coloque `transition` no elemento base, nao no `:hover`** — porque se colocar no hover, ao remover o mouse a transicao desaparece e o elemento "pula" de volta sem suavidade
4. **Use `animation-timeline: view()` para scroll-driven animations** — dispara a animacao quando o elemento entra na viewport, sem JavaScript
5. **Controle stagger com `animation-range` e data attributes** — elementos com `data-delay` recebem ranges diferentes para aparecer sequencialmente
6. **Sempre declare `animation-fill-mode: backwards`** — para que o estado inicial do keyframe (opacidade 0, translateY) seja aplicado antes da animacao comecar

## How to write

### Grid com areas nomeadas

```css
.content {
  display: grid;
  grid-template-areas:
    "a b b"
    "c c d";
  gap: 2.5rem;
}

.content figure:nth-child(1) { grid-area: a; }
.content figure:nth-child(2) { grid-area: b; }
.content figure:nth-child(3) { grid-area: c; }
.content figure:nth-child(4) { grid-area: d; }
```

### Hover com escala na imagem e figcaption deslizante

```css
/* Transition no elemento base — NAO no :hover */
figure > img {
  transition: scale 500ms;
}

figcaption {
  position: absolute;
  bottom: 0;
  width: 100%;
  transform: translateY(100%);
  transition: transform 500ms;
}

figure:hover > img {
  scale: 1.1;
}

figure:hover figcaption {
  transform: translateY(0);
}
```

### Scroll-driven animation com stagger

```css
@keyframes image-appear {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
}

figure {
  animation: image-appear linear backwards;
  animation-timeline: view();
  animation-range: 100px 350px;
}

figure[data-delay] {
  animation-range: 150px 400px;
}
```

## Example

**HTML structure:**
```html
<section class="gallery">
  <header>
    <span>Galeria de fotos</span>
    <h2>#use snitap por aí</h2>
  </header>
  <div class="content">
    <figure>
      <img src="assets/images/01.png" alt="">
      <figcaption>
        <img src="assets/images/person.png" alt="">
        <span>@lavinia.pereira</span>
      </figcaption>
    </figure>
    <figure data-delay>
      <img src="assets/images/02.png" alt="">
      <figcaption>...</figcaption>
    </figure>
    <figure>
      <img src="assets/images/03.png" alt="">
      <figcaption>...</figcaption>
    </figure>
    <figure data-delay>
      <img src="assets/images/04.png" alt="">
      <figcaption>...</figcaption>
    </figure>
  </div>
</section>
```

**Figcaption com gradiente overlay:**
```css
figcaption {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 1.5rem 2rem;
  background: linear-gradient(to top, rgb(0 0 0 / 0.64), rgb(0 0 0 / 0));
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  color: white;
  transform: translateY(100%);
  transition: transform 500ms;
}

figcaption img {
  width: 2rem;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 50%;
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Layout assimetrico de imagens | Use `grid-template-areas` com areas nomeadas |
| Imagem dentro de container arredondado | `border-radius` no figure + `overflow: hidden` |
| Efeito hover ida-e-volta suave | Declare `transition` no elemento base, nunca no `:hover` |
| Elementos aparecendo em sequencia no scroll | `data-delay` attribute + `animation-range` diferente |
| `animation-timeline: view()` nao suportado | Considere fallback com Intersection Observer, porque este recurso ainda nao esta disponivel em todos os navegadores |
| Imagem de avatar/pessoa | `aspect-ratio: 1/1` + `border-radius: 50%` + `object-fit: cover` |
| Sobra de pixels embaixo do figure | Remova `line-height` herdado do figure |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `figure:hover > img { transition: scale 500ms; }` | `figure > img { transition: scale 500ms; }` |
| `animation: image-appear 2s linear` (tempo fixo com view timeline) | `animation: image-appear linear backwards` + `animation-timeline: view()` |
| `<div class="image-wrapper">` para galeria de fotos | `<figure>` + `<figcaption>` |
| Inline style delays para stagger | `data-delay` attribute + CSS attribute selector |
| `position: relative` + `top/left` para overlay | `position: absolute` + `bottom: 0` dentro de `position: relative` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre transition no base vs hover, animation-timeline view(), e compatibilidade de navegadores
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes e CSS completo da galeria