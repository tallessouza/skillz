# Code Examples: CSS Animation Timeline — Scroll

## Setup HTML completo da aula

```html
<h1>Title goes here</h1>
<p>Lorem ipsum...</p>
<p>Lorem ipsum...</p>
<p>Lorem ipsum...</p>

<article>
  <h2>Segundo titulo um pouco menor</h2>
  <img src="https://images.unsplash.com/..." alt="">
  <p>Lorem ipsum...</p>
  <p>Lorem ipsum...</p>
  <p>Lorem ipsum...</p>
</article>

<h3>Lorem ipsum...</h3>
<p>Lorem ipsum...</p>
```

## CSS base (layout)

```css
body {
  max-width: 80%;
  margin-inline: auto;
}

img {
  width: 100%;
  height: auto;
  display: block;
}
```

## CSS animacao com scroll

```css
@keyframes fade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

article img {
  animation: fade linear;
  animation-timeline: scroll();
}
```

## Variacoes de eixo

### Vertical explicito
```css
article img {
  animation: fade linear;
  animation-timeline: scroll(y);
}
```

### Usando block (equivalente a y)
```css
article img {
  animation: fade linear;
  animation-timeline: scroll(block);
}
```

### Horizontal (requer scroll horizontal no container)
```css
.horizontal-container {
  overflow-x: scroll;
  white-space: nowrap;
}

.horizontal-container img {
  animation: slide-in linear;
  animation-timeline: scroll(inline);
}

@keyframes slide-in {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0); }
}
```

## Variacao: Progress bar no topo da pagina

```css
@keyframes grow-width {
  0% { width: 0%; }
  100% { width: 100%; }
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: #3b82f6;
  animation: grow-width linear;
  animation-timeline: scroll();
}
```

## Variacao: Fade + slide up

```css
@keyframes fade-slide-up {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

article img {
  animation: fade-slide-up linear;
  animation-timeline: scroll();
}
```

## Fallback pattern para producao

```css
/* Fallback: animacao nao acontece, elemento visivel */
article img {
  opacity: 1;
}

/* Progressive enhancement */
@supports (animation-timeline: scroll()) {
  article img {
    animation: fade linear;
    animation-timeline: scroll();
  }
}
```